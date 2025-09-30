---
name: execute-tasks
description: Execute the next queued task using the appropriate agents and context.
arguments:
  - name: task
    description: Optional task identifier or short description to focus on.
    required: false
---
@include .agent-os/instructions/core/execute-tasks.md
