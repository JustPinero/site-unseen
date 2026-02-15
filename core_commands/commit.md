---
description: Create git commit with conventional message format
argument-hint: [file1] [file2] ... (optional - commits all changes if not specified)
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
---

# Commit: Create Git Commit

## Files to Commit

Files specified: $ARGUMENTS

(If no files specified, will commit all changes)

## Commit Process

### 1. Review Current State

Check git status:
!`git status`

Review changes to commit:
!`git diff HEAD`

### 2. Analyze Changes

Examine the diff and determine:

**Type of change:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation only
- `test`: Adding or updating tests
- `chore`: Maintenance (deps, config, etc.)
- `perf`: Performance improvement
- `style`: Code style/formatting

**Scope:**
- `front`: Frontend React app changes
- `back`: Backend Express/Socket.io changes
- `shared`: Shared types/validators
- `db`: Database schema/migrations
- `docs`: reference/, requests/, CLAUDE.md
- `infra`: Project config, CI/CD, tooling

**Description:**
- Brief summary of what changed (50 chars or less)
- Use imperative mood ("add" not "added")

**Body (if needed):**
- More detailed explanation
- Reference request number if applicable: `Implements request #NNN`

### 3. Security Check

Before committing, verify:
- No secrets, API keys, or credentials in the diff
- No `.env` files being committed
- No database connection strings exposed

### 4. Stage Files

If specific files provided:
```bash
git add $ARGUMENTS
```

If no files specified:
```bash
git add .
```

### 5. Create Commit

Using conventional commit format:

```
type(scope): description

[optional body]

Implements request #NNN (if applicable)
```

### 6. Confirm Success

Verify commit created:
!`git log -1 --oneline`

## Output Report

**Commit Hash**: [hash]
**Commit Message**: [message]
**Files Committed**: [list]
**Summary**: X files changed, Y insertions(+), Z deletions(-)
