---
description: Prime agent with codebase understanding
---

# Prime: Load Project Context

## Objective

Build comprehensive understanding of the Site Unseen speed dating simulator by analyzing project structure, documentation, reference files, and key code.

## Process

### 1. Analyze Project Structure

List all tracked files:
!`git ls-files`

Show directory structure:
!`find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path '*/node_modules/*' -not -path '*/dist/*' | head -100`

### 2. Read Core Documentation

- Read `CLAUDE.md` (project overview, conventions, architecture)
- Read all files in `reference/` (compatibility rules, event rules)
- Read `requests/` directory listing (construction roadmap)

### 3. Analyze Backend

**back/** (Node.js + Express + Socket.io):
- Read `package.json` for dependencies
- Read server entry point and route definitions
- Review Socket.io event handlers
- Review simulation engine logic
- Check Prisma schema for data models

### 4. Analyze Frontend

**front/** (React + TypeScript + Vite):
- Read `package.json` for dependencies
- Review component structure
- Check Socket.io client integration
- Review simulation views (detailed + quick)

### 5. Analyze Shared Code

**shared/** (if exists):
- Read type definitions
- Review validators (Zod schemas)
- Check constants

### 6. Understand Current State

Check recent activity:
!`git log -15 --oneline`

Check current branch and status:
!`git status`

Check which requests are completed:
!`grep -l "Status:.*Complete" requests/*.md 2>/dev/null || echo "No completed requests found"`

## Output Report

Provide a concise summary covering:

### Project State
- What's implemented vs planned
- Which requests are complete
- Current build status

### Architecture
- Backend routes and services
- Socket.io events configured
- Database schema state
- Frontend components and views

### Tech Stack
- All dependencies and versions
- Build and dev tooling

### Active Work
- Current branch and recent commits
- In-progress requests
- Any blockers or concerns

**Make this summary easy to scan — use bullet points and clear headers.**
