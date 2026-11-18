---
name: prompt
description: |
  Generate well-structured prompts for AI agents to fix specific problems.
  Triggers on: "make a prompt", "generate a prompt", "create a prompt for",
  "write a prompt", or "prompt for an agent". Use when you need to hand off
  a problem to another AI agent with clear instructions for analysis, planning,
  impact assessment, and execution.
author: Claude Code
version: 1.0.0
date: 2026-01-21
---

# Agent Prompt Generator

## Purpose

Generate comprehensive, well-structured prompts that can be given to another AI agent to fix a specific problem. The prompts follow a consistent structure that ensures the agent will analyze the codebase, create a plan, assess impacts, and execute safely.

## Trigger Conditions

Activate this skill when the user says:
- "make a prompt"
- "generate a prompt"
- "create a prompt for..."
- "write a prompt for an agent"
- "prompt for an agent to fix..."

## Process

### Step 1: Gather Information

If the problem isn't fully clear, ask clarifying questions:

1. **What is the specific problem?** (error message, architectural issue, bug, etc.)
2. **What is the desired outcome?** (what should work after the fix?)
3. **Are there any constraints?** (don't touch certain files, maintain backwards compatibility, etc.)
4. **What's the scope?** (single file fix vs. multi-module refactor)

### Step 2: Generate the Prompt

Use this template structure:

```markdown
**Task: [Concise title describing the fix]**

**Problem:**
[Clear description of what's wrong, including any error messages or symptoms]

**Your task:**

1. **Analyze the codebase** to understand:
   - [Specific things to investigate]
   - [Files or modules to examine]
   - [Dependencies to trace]

2. **Create a plan** to fix the issue:
   - Identify exactly which files need to change
   - List all import statements or references that need updating
   - Determine if any related code also needs modification

3. **Assess potential impacts:**
   - Will this break any existing tests?
   - Are there circular import risks?
   - Does documentation (README, CLAUDE.md, etc.) need updating?
   - Any other side effects or breaking changes?

4. **Execute the fix** once the plan is approved.

**Constraints:**
[Any specific limitations or requirements]
```

### Step 3: Customize Based on Problem Type

#### For Refactoring/Moving Code:
Add to analysis section:
- All files that import from the affected module
- Any re-exports that need updating
- Package/module boundary considerations

#### For Bug Fixes:
Add to analysis section:
- Steps to reproduce the bug
- Expected vs actual behavior
- Related code paths that might have similar issues

#### For Architectural Changes:
Add to analysis section:
- Current architecture and why it's problematic
- Proposed architecture and its benefits
- Migration path from current to proposed

#### For Dependency Issues:
Add to analysis section:
- Current dependency graph
- Circular dependency detection
- Proper layering (which modules should depend on which)

## Example Output

**Task: Move shared Graph API client from `ingestion` to `common`**

**Problem:**
`processing/utils/handler.py` imports `GraphClient` from `ingestion/utils/graph_client.py`. This creates a dependency between `processing` and `ingestion` modules that should be independent. Each module should only depend on `common/`.

**Your task:**

1. **Analyze the codebase** to understand:
   - What `GraphClient` does and all its dependencies within `ingestion/`
   - All files in both `ingestion/` and `processing/` that import from the affected modules
   - Any other cross-module dependencies that violate this pattern

2. **Create a plan** to move the shared code to `common/`:
   - Identify exactly which files need to move
   - Identify all import statements that need updating
   - Determine if any related utilities (retry decorators, auth helpers, etc.) also need to move

3. **Assess potential impacts:**
   - Will this break any existing tests?
   - Are there circular import risks?
   - Does `common/CLAUDE.md` need updating to document the new module?
   - Any other side effects?

4. **Execute the refactor** once the plan is approved.

## Notes

- The prompt should be self-contained—the receiving agent shouldn't need additional context
- Include specific file paths when known
- Mention any project conventions the agent should follow (e.g., "check CLAUDE.md files")
- For complex problems, suggest the agent create a todo list to track progress
- Always include the impact assessment section—it prevents regressions

## Anti-Patterns

- Don't generate vague prompts like "fix the bug in the code"
- Don't skip the analysis step—agents should understand before changing
- Don't omit constraints—they prevent scope creep
- Don't forget impact assessment—it's the safety net
