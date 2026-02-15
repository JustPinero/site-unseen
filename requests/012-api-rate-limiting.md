# Request #012 — API Rate Limiting

**Status**: Not Started
**Dependencies**: None

## Description

Add rate limiting to the Express API to prevent abuse. The `POST /simulations` endpoint is the most important to protect since it creates DB records and can trigger simulation runs.

## Requirements

### Package
- Install `express-rate-limit`

### Rate Limits
- **Global**: 100 requests per minute per IP across all endpoints
- **Creation**: 10 requests per minute per IP on `POST /api/v1/simulations`

### Behavior
- Return `429 Too Many Requests` with a JSON error body matching the existing error format: `{ error: { code: "RATE_LIMITED", message: "..." } }`
- Apply global limiter as middleware in `app.ts`
- Apply creation limiter directly on the POST route in `simulations.ts`

### Constraints
- Trust proxy headers (Railway runs behind a reverse proxy) — set `app.set("trust proxy", 1)`
- Use the default in-memory store (fine for single-instance deployment)

## Verification
- Rapid-fire requests to POST endpoint get 429 after 10 requests
- Normal usage is unaffected
- All existing tests still pass
