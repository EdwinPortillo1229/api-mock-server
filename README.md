# API Mock Server

A standalone HTTP mock server for local integration testing. Serves fixture data over real HTTP so the CRM's actual API client code paths are exercised — no test accounts or API credentials needed.

Currently supports **Zoom Phone SMS** endpoints. Designed to be extended with any third-party integration.

## Quick Start

```sh
bin/start              # starts on default port 4010
PORT=5050 bin/start    # starts on custom port
bin/stop               # shuts down the server
```

Ctrl+C stops the log tail; the server keeps running in the background until `bin/stop`.

## How It Works

The CRM's `ApiClient` reads `ENV["ZOOM_API_URL"]` (defaults to `https://api.zoom.us`). Point that at the mock server and zero CRM code changes are needed:

```
ZOOM_API_URL=http://host.docker.internal:4010   # from a Docker container (e.g. CRM)
ZOOM_API_URL=http://localhost:4010               # from your host machine
```

### Placeholder System

Fixture JSON files use placeholders that get replaced at request time:

| Placeholder | Replaced With |
|---|---|
| `FIXTURE_ZOOM_USER_ID` | `:userId` from request params (or `mock-zoom-user-id`) |
| `FIXTURE_USER_NAME` | `Mock User` |
| `FIXTURE_DATE_DAY_N_TIME_H` | N days ago at hour H, UTC ISO8601 |
| `FIXTURE_DATE_DAY_N` | N days ago as YYYY-MM-DD |

This means dates are always fresh and relative to "now".

## Available Endpoints

### Zoom Integration (`/v2`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/v2/phone/users/:userId/sms/sessions` | SMS sessions (paginated) |
| GET | `/v2/phone/sms/sessions/:sessionId` | Session messages |
| GET | `/v2/users/me` | User info |

**Pagination**: Pass `?next_page_token=<token>` to get page 2. Page 1 returns a token; page 2 returns an empty token.

**Known sessions**: `sess_001`, `sess_002`, `sess_004` return messages. Unknown session IDs return an empty `sms_histories` array.

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/__admin/errors` | View active error simulation rules |
| POST | `/__admin/errors` | Add an error simulation rule |
| DELETE | `/__admin/errors` | Clear all error rules |

## Error Simulation

Two ways to trigger error responses:

### 1. Per-request header

Add `X-Mock-Error: <status>` to any request:

```sh
curl -H "X-Mock-Error: 429" http://localhost:4010/v2/phone/users/me/sms/sessions
# → 429 with rate limit error body
```

### 2. Stateful rules (for manual testing)

```sh
# Next 3 requests to any path containing "sms/sessions" will return 401
curl -X POST http://localhost:4010/__admin/errors \
  -H "Content-Type: application/json" \
  -d '{"pathPattern": "sms/sessions", "statusCode": 401, "count": 3}'

# View active rules
curl http://localhost:4010/__admin/errors

# Clear all rules
curl -X DELETE http://localhost:4010/__admin/errors
```

## ngrok Tunneling

For remote QA access, enable ngrok:

```yaml
# docker-compose.yml
environment:
  - NGROK_ENABLED=true
  - NGROK_AUTHTOKEN=your_token_here
```

The tunnel URL will appear in the startup banner.

## Adding a New Integration

1. Copy `src/providers/_template/` to `src/providers/<name>/`
2. Add fixture JSON files to `fixtures/`
3. Write route handlers (~15 lines each): load fixture, apply template, return JSON
4. Register the plugin in `src/index.ts` with the appropriate URL prefix

## Project Structure

```
src/
├── index.ts                         # Entry point
├── server.ts                        # Fastify instance + config
├── lib/
│   ├── template-engine.ts           # Placeholder replacement
│   ├── error-simulation.ts          # Error simulation hook + admin routes
│   ├── startup-banner.ts            # Prints routes on boot
│   └── types.ts                     # Shared types
└── providers/
    ├── zoom/
    │   ├── index.ts                 # Fastify plugin, prefix /v2
    │   ├── routes/                  # Route handlers
    │   └── fixtures/                # JSON fixtures + error fixtures
    └── _template/                   # Copy to add a new integration
```
