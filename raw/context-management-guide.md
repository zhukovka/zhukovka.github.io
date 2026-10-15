### 1. Fundamental Constraint: The Context Window as a Fixed Budget

The context window functions as the fundamental primitive and constraint in agentic software engineering. While model capabilities and task horizons have expanded exponentially, context window ceilings have remained fixed at around 1 million tokens.

Every token loaded upfront—system prompts, tool definitions, instruction files, and read files—directly competes with the space required to execute complex, long-horizon tasks.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FIXED CONTEXT WINDOW (~1M TOKENS)                 │
├───────────────────┬────────────────────────────────────────────────────┤
│ Upfront Overhead  │             Task Execution Workspace               │
│ (System Prompt,   │      (File Reading, Code Edits, Tool Outputs,      │
│ Tool Schemas,     │             Reasoning & Planning Steps)            │
│ Unconditional Rules)                                                   │
└───────────────────┴────────────────────────────────────────────────────┘
```

* **The "npm on an Arduino" Analogy**: In traditional desktop software development, dependency bloat can be absorbed by pulling in multiple library versions. In context engineering, every token incurs a physical memory and cost trade-off; developers cannot naively dump entire codebases or static documentation sets into the prompt window.
* **The KV Cache Constraint**: Modern LLMs process tokens up to 10x cheaper when prompt prefixes remain static across turns. Dynamic rule-swapping mechanisms—similar to an LRU cache that evicts and inserts rules turn-by-turn—break KV cache stability and severely inflate token costs.

---

### 2. Core Philosophy: The Zero Overhead Principle

The guiding principle of scalable context management is **"don't pay for what you don't use"**.

* **Eliminate Unconditional Prompts**: Unconditional instruction files (such as massive `CLAUDE.md` files bundled inside plugins) inject large token payloads at session start across every single turn, regardless of relevance. This limits the number of plugins that can run concurrently.
* **Shift to On-Demand Pay-Per-Use**: Context customization should rely on abstractions that cost **zero baseline tokens** when idle or expand into context only when triggered by specific user or model actions.

---

### 3. Practical Abstractions & Architecture Matrix

To scale context engineering across large enterprise codebases and monorepos, developers must combine four primary abstractions:

| Abstraction Primitive | Baseline Token Cost | Execution Context | Trigger Mechanism | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Hooks** | **0 Tokens** | Out-of-Context (Local Script) | Event-driven (e.g., Post-Tool Use) | Real-time feedback loops ("red squigglies", lint/type errors) |
| **Skills** | Short Description Only | In-Context (Main Session) | Model-selected lazy expansion | Domain-specific guidelines & CLI workflows |
| **Sub-Agents** | Short Description Only | Out-of-Context (Isolated Window) | Model-selected task delegation | Heavy sub-tasks requiring clean context isolation |
| **Tool Search (MCP)** | Tool Names Only | In-Context (System Prompt) | Model queries via Search Tool | Dynamic tool discovery across large MCP fleets |

---

### 4. Step-by-Step Implementation Patterns

#### Pattern A: Zero-Overhead Event Hooks ("Red Squigglies")
Hooks run local executable scripts completely outside the context window. When idle, they consume zero context space. When an event occurs (such as file editing via `edit_tool`), the hook executes, evaluates relevance in cheap CPU cycles, and injects context *only* if an error or rule violation occurs.

* **Use Case**: Immediate feedback at the exact moment of a mistake, preventing the model from wasting tokens on compilation attempts later.

```bash
#!/bin/bash
# post-tool-use-hook.sh (Post-Tool Execution Event)
# 1. Inspect input JSON passed to script via stdin
INPUT_JSON=$(cat)
FILE_EDITED=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // empty')

# Quick-exit if irrelevant (costs 0 context tokens)
if [[ "$FILE_EDITED" != *.ts ]]; then
  exit 0
fi

# 2. Run local linter/type-check script
LINT_OUTPUT=$(npx tsc --noEmit "$FILE_EDITED" 2>&1)

# 3. Inject context ONLY if errors exist
if [ $? -ne 0 ]; then
  echo "{"
  echo "  \"additional_context\": \"[LINTER ERROR - RED SQUIGGLY]: Fix before proceeding:\n$LINT_OUTPUT\""
  echo "}"
fi
```

#### Pattern B: Skills as Lazy System Prompts
Skills store detailed instructions inside a dedicated directory (`skill.md`). Only the short front-matter description is loaded into the system prompt at startup; the detailed body is lazily expanded into context ("pay-per-use") only when selected by the model.

```markdown
---
name: database-migrations
description: "Instructions for creating and running PostgreSQL schema migrations using Prisma. Use when updating database models."
---

# Database Migration Guidelines
1. Always run `npx prisma migrate dev --name <migration_name>` in dry-run mode first.
2. Ensure backward compatibility for existing production tables.
3. Check foreign key constraint definitions in `prisma/schema.prisma`.
```

* **Scaling Caveat**: In massive enterprise monorepos with thousands of skills, loaded description strings will eventually exhaust prompt space. Keep skill descriptions concise and specific.

#### Pattern C: Mitigating MCP Tool Schema Bloat
Exposing dozens of Model Context Protocol (MCP) servers injects massive JSON schemas into the baseline system prompt. Enabling **Tool Search** defers schema loading: only tool names reside in the prompt upfront, and full schemas are retrieved dynamically via a search tool when required.

#### Pattern D: Separating Context Engineering from Model Memory
* **Context Engineering**: Developer-written static primitives (hooks, skills, plugins) that define how agents operate across repos.
* **Model Memory**: Dynamic, model-curated text files updated and read during runtime execution. Keep these architectural layers distinct.

---

### 5. Multi-Agent Operational Scaling

When scaling from a single session to concurrent agents, managing human cognitive context-switching becomes the primary bottleneck.

* **Git Worktree Isolation**: Assign each concurrent agent session its own Git worktree to prevent agents from overwriting each other's working directories.
* **Visual Session Identity**: Utilize visual labeling commands (`/rename`, `/color`) to quickly identify agent tasks across 16–20+ parallel sessions.
* **Automated Feedback Polling**: Deploy cron-like background commands (`/loop`) to periodically monitor long-running CI test builds without manual prompt intervention.
* **Autonomous Execution Safeguards**: Enable auto mode to bypass permission prompts safely using multi-stage background classifier screenings.
