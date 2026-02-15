---
description: Research and create implementation plan for a request
argument-hint: [request-number or feature-description]
---

# Planning: Request Implementation Plan

## Request

$ARGUMENTS

## Determine Context

### 1. Load Request File

Read the request file: `requests/[number]-*.md`

Extract:
- Description and requirements
- Dependencies (check if completed)
- Acceptance criteria

### 2. Load Reference Files

Based on the request, read applicable reference docs:
- `reference/compatibility-rules.md` — for matching/demographic features
- `reference/event-rules.md` — for simulation mechanics
- `CLAUDE.md` — for project conventions and architecture

## Research Process

### 1. Analyze Existing Codebase

Search for related implementations:
- **shared/** — existing types, validators, constants
- **back/** — existing routes, services, Socket.io handlers, simulation engine
- **front/** — existing components, hooks, views

Identify:
- Reusable code and patterns
- Existing conventions to follow
- Potential conflicts or breaking changes

### 2. Design Implementation Approach

Determine:
- Which files need to be created or modified
- What data models are required
- What API endpoints or Socket.io events are needed
- How state flows between server and client
- Testing strategy

### 3. Break Down Into Tasks

Create detailed, actionable tasks with:
- Specific file paths
- Exact function/component names
- Clear acceptance criteria
- Validation commands

## Output: Create Plan Document

Save plan as: `plans/[request-number]-[feature-name].md`

**CRITICAL**: Format this plan for ANOTHER AGENT to execute without seeing this conversation. Include all context needed.

### Required Plan Sections

#### 1. Overview
- Request description and number
- Key requirements
- Success criteria

#### 2. Step by Step Tasks
For each task:
- **Task number and name**
- **File**: Exact path
- **Action**: Create or modify
- **Details**: Specific implementation guidance
- **Related files**: Dependencies

#### 3. Testing Strategy
- Manual test steps
- Automated tests to write

#### 4. Validation Commands
```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Tests
npm test
```

## Confirmation

After creating the plan, confirm:
- Plan saved to `plans/` directory
- All tasks are explicit with file paths
- Validation commands are exact
- Another agent could execute this without context

**Next step**: Run `/execute plans/[plan-file].md` to implement
