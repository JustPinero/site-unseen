---
description: Execute an implementation plan
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Edit, Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(git:*)
---

# Execute: Implement from Plan

## Plan to Execute

Read plan file: `$ARGUMENTS`

## Execution Instructions

### 1. Read and Understand

- Read the ENTIRE plan carefully
- Understand all tasks and their dependencies
- Review the validation commands
- Check the request file referenced for full context

### 2. Pre-Flight Checks

Before writing any code:

```bash
# Ensure clean working state
git status

# Ensure project builds (if already scaffolded)
cd back && npm run build 2>/dev/null; cd ..
cd front && npm run build 2>/dev/null; cd ..
```

### 3. Execute Tasks in Order

For EACH task in "Step by Step Tasks":

#### a. Navigate to the task
- Identify the file path
- Read existing related files if modifying
- Check for dependencies on other files

#### b. Implement the task
- Follow the detailed specifications exactly
- Maintain consistency with existing code patterns
- Include proper TypeScript types (strict mode)
- Use shared types — don't duplicate across front/back

#### c. Verify as you go
- After each file change, check syntax
- Ensure imports resolve
- Verify types are properly defined

### 4. Full Verification

After all tasks complete:

```bash
# Type check backend
cd back && npx tsc --noEmit

# Type check frontend
cd front && npx tsc --noEmit

# Build both
cd back && npm run build
cd front && npm run build
```

### 5. Run Validation Commands

Execute ALL validation commands from the plan in order. If any fail, fix the issue and re-run.

### 6. Final Verification

Before completing:
- All tasks from plan completed
- All validation commands pass
- Code follows project conventions (CLAUDE.md)
- Shared types used (no duplication)
- No `any` types without justification

## Output Report

### Completed Tasks
- List of all tasks completed
- Files created (with paths)
- Files modified (with paths)

### Validation Results
```bash
# Output from each validation command
```

### Ready for Commit
- Confirm all changes are complete
- Suggest commit message following conventional commits
- Ready for `/commit` command

## Notes

- If you encounter issues not addressed in the plan, document them
- If you need to deviate from the plan, explain why
- Never skip verification steps
