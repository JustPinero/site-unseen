# Request #011 — GitHub Actions CI

**Status**: Not Started
**Dependencies**: None

## Description

Add a GitHub Actions workflow that runs tests and type checking on every push and pull request. This prevents regressions from reaching production.

## Requirements

### Workflow File
- Create `.github/workflows/ci.yml`
- Trigger on `push` to `main` and on all `pull_request` events
- Use Node.js 18
- Use PostgreSQL service container for backend tests that need it

### Steps
1. Checkout code
2. Install dependencies (`npm ci`)
3. Generate Prisma client (`npx prisma generate` in `back/`)
4. Run type checking (`npm run typecheck`)
5. Run all tests (`npm test`)

### Constraints
- Keep the workflow simple — single job is fine
- Use `npm ci` for reproducible installs
- Cache `node_modules` for faster runs

## Verification
- Push a commit and confirm the workflow runs successfully in the Actions tab
