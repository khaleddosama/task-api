const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiSpec = require("./openapi.json");

const app = express();
const PORT = 3000;

app.use(express.json());

const SEED_TASKS = [
  { id: 1, title: "Learn HTTP basics", done: false },
  { id: 2, title: "Build first API endpoint", done: true },
  { id: 3, title: "Test with curl", done: false },
];

let tasks = SEED_TASKS.map((task) => ({ ...task }));
let nextId = 4;

function findTask(id) {
  return tasks.find((task) => task.id === id);
}

function validateTitle(title) {
  if (typeof title !== "string" || !title.trim()) {
    return null;
  }
  return title.trim();
}

function parseTaskId(rawId) {
  const id = Number.parseInt(rawId, 10);
  if (Number.isNaN(id)) {
    return null;
  }
  return id;
}

app.get("/", (_req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", (req, res) => {
  let result = tasks;

  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    result = result.filter((task) => task.done === done);
  }

  if (req.query.search) {
    const needle = req.query.search.toLowerCase();
    result = result.filter((task) => task.title.toLowerCase().includes(needle));
  }

  res.json(result);
});

app.get("/tasks/:id", (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "invalid task id" });
  }

  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  return res.json(task);
});

app.post("/tasks", (req, res) => {
  const title = validateTitle(req.body?.title);
  if (!title) {
    return res.status(400).json({ error: "title is required and cannot be empty" });
  }

  const task = { id: nextId, title, done: false };
  nextId += 1;
  tasks.push(task);

  return res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "invalid task id" });
  }

  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const body = req.body ?? {};
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "request body cannot be empty" });
  }

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    const title = validateTitle(body.title);
    if (!title) {
      return res.status(400).json({ error: "title cannot be empty" });
    }
    task.title = title;
  }

  if (Object.prototype.hasOwnProperty.call(body, "done")) {
    if (typeof body.done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }
    task.done = body.done;
  }

  return res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "invalid task id" });
  }

  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  tasks = tasks.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.get("/stats", (_req, res) => {
  const done = tasks.filter((task) => task.done).length;
  res.json({ total: tasks.length, done, open: tasks.length - done });
});

app.post("/reset", (_req, res) => {
  tasks = SEED_TASKS.map((task) => ({ ...task }));
  nextId = 4;
  res.json(tasks);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});
