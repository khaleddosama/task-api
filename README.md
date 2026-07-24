# Task API

A small CRUD API that manages a to-do list in memory. Built with **Node.js** and **Express** for the FlyRank Backend Track (Assignment A1).

Data is stored in memory only — restarting the server clears any changes.

## Quick start

**Requirements:** Node.js 18+

```bash
npm install
npm start
```

Server runs at [http://localhost:3000](http://localhost:3000).

Interactive docs: [http://localhost:3000/docs](http://localhost:3000/docs)

## Endpoints

| Method | Path | Description | Status codes |
|--------|------|-------------|--------------|
| GET | `/` | API metadata | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200, 404 |
| POST | `/tasks` | Create a task | 201, 400 |
| PUT | `/tasks/:id` | Update a task | 200, 400, 404 |
| DELETE | `/tasks/:id` | Delete a task | 204, 404 |
| GET | `/stats` | Task counts (extra) | 200 |
| POST | `/reset` | Restore seed tasks (extra) | 200 |

### Query parameters (extras)

- `GET /tasks?done=true` — filter by done status
- `GET /tasks?search=milk` — search by title

## Example: curl

```bash
curl -i http://localhost:3000/tasks/1
```

Expected output:

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-..."
Date: ...
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"title":"Learn HTTP basics","done":false}
```

404 example:

```bash
curl -i http://localhost:3000/tasks/99
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"error":"Task 99 not found"}
```

## Swagger UI

Open [http://localhost:3000/docs](http://localhost:3000/docs) to try every endpoint with **Try it out**.

> Add a screenshot of the Swagger UI page here after running the server.

## Project structure

```
├── server.js       # Express app and routes
├── openapi.json    # OpenAPI spec for Swagger UI
├── package.json
└── README.md
```

## The mortality experiment

Create tasks, restart the server, then call `GET /tasks` again. The new tasks disappear because data lives only in memory — when the process stops, the variables are gone. Week 3 adds a database so data survives restarts.
