# Total Audio Orchestrator v3

Multi-agent execution engine for rapid development.

## Quick Start

```bash
# Add alias to your shell (add to ~/.zshrc)
alias tado="node /Users/chrisschofield/workspace/active/total-audio-platform/tools/orchestrator/orchestrator.js"

# Or run directly
node tools/orchestrator/orchestrator.js "your task"
```

## Usage

```bash
# Default workflow (fix)
tado "fix the automations page styling"

# Specific workflows
tado refactor "extract shared button component"
tado audit "check for accessibility issues"
tado polish "improve typography on dashboard"
tado ship "add export feature to contacts"
```

## Workflows

| Workflow   | Agents                                                                                       | Use Case                 |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------ |
| `fix`      | analysis → file-scanner → patch-generator → code-mod → diff → impact-tester                  | Bug fixes, quick changes |
| `refactor` | analysis → context-mapper → file-scanner → patch-generator → code-mod → diff → impact-tester | Code restructuring       |
| `audit`    | analysis → file-scanner → context-mapper → diff                                              | Code review, checks      |
| `polish`   | file-scanner → patch-generator → code-mod → diff                                             | UI/style improvements    |
| `ship`     | analysis → file-scanner → patch-generator → code-mod → impact-tester → pr                    | Full feature delivery    |

## Options

- `--dry-run` - Preview changes without applying (default: on)
- `--force` - Skip safety checks (use with caution)

## Configuration

Edit `orchestrator.manifest.json` to:

- Add/remove protected paths
- Configure workspace context
- Adjust agent models (opus/sonnet/haiku)
- Modify workflows

## Protected Paths

These paths cannot be modified by the orchestrator:

- `packages/core-db/src/lib/rls` - Row-level security
- `packages/core-db/prisma/migrations` - Database migrations
- `.env*` - Environment files
- `apps/*/app/api/auth` - Auth routes

## Agents

| Agent           | Model  | Purpose                            |
| --------------- | ------ | ---------------------------------- |
| analysis        | opus   | Deep problem analysis and planning |
| file-scanner    | sonnet | Locate relevant files              |
| context-mapper  | sonnet | Understand codebase patterns       |
| patch-generator | sonnet | Generate code patches              |
| code-mod        | sonnet | Apply modifications                |
| diff            | haiku  | Show changes                       |
| impact-tester   | sonnet | Run type checks and tests          |
| pr              | haiku  | Create commits and PRs             |
