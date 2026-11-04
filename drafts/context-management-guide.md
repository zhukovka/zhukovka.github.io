### 1. Fundamental Constraint: The Context Window as a Fixed Budget

The context window functions as the fundamental primitive and constraint in agentic software engineering. While model capabilities and task horizons have expanded exponentially, context window ceilings have remained fixed at around 1 million tokens.

Every token loaded upfront—system prompts, tool definitions, instruction files, and read files—directly competes with the space required to execute complex, long-horizon tasks.

```text
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

***

### 2. Core Philosophy: The Zero Overhead Principle

The guiding principle of scalable context management is **"don't pay for what you don't use"**.

* **Eliminate Unconditional Prompts**: Unconditional instruction files (such as massive `CLAUDE.md` files bundled inside plugins) inject large token payloads at session start across every single turn, regardless of relevance. This limits the number of plugins that can run concurrently.

* **Shift to On-Demand Pay-Per-Use**: Context customization should rely on abstractions that cost **zero baseline tokens** when idle or expand into context only when triggered by specific user or model actions.

***

### 3. Practical Abstractions & Architecture Matrix

To scale context engineering across large enterprise codebases and monorepos, developers must combine four primary abstractions:

| Abstraction Primitive | Baseline Token Cost    | Execution Context                | Trigger Mechanism                  | Primary Use Case                                              |
| --------------------- | ---------------------- | -------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| **Hooks**             | **0 Tokens**           | Out-of-Context (Local Script)    | Event-driven (e.g., Post-Tool Use) | Real-time feedback loops ("red squigglies", lint/type errors) |
| **Skills**            | Short Description Only | In-Context (Main Session)        | Model-selected lazy expansion      | Domain-specific guidelines & CLI workflows                    |
| **Sub-Agents**        | Short Description Only | Out-of-Context (Isolated Window) | Model-selected task delegation     | Heavy sub-tasks requiring clean context isolation             |
| **Tool Search (MCP)** | Tool Names Only        | In-Context (System Prompt)       | Model queries via Search Tool      | Dynamic tool discovery across large MCP fleets                |

***

### 4. Step-by-Step Implementation Patterns

#### Pattern A: Zero-Overhead Event Hooks ("Red Squigglies")

Hooks run local executable scripts completely outside the context window. When idle, they consume zero context space. When an event occurs (such as file editing via `edit_tool`), the hook executes, evaluates relevance in cheap CPU cycles, and injects context *only* if an error or rule violation occurs.

* **Use Case**: Immediate feedback at the exact moment of a mistake, preventing the model from wasting tokens on compilation attempts later.

```shellscript
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

Here's a concrete scenario: a React/TypeScript monorepo with rules for testing, API conventions, styling, and migrations.

## BAD: swap rules in and out per turn

A hook or wrapper script rewrites the system prompt (or `CLAUDE.md`) based on what you're doing:

```text
Turn 1: "Write a test for useAuth"
┌─────────────────────────────────────────┐
│ system prompt                           │
│ ## Active rules                         │
│ - testing.md (full 800 tokens)          │  ← injected
└─────────────────────────────────────────┘
│ user: Write a test for useAuth          │
│ assistant: ...                          │

Turn 2: "Now add an endpoint for it"
┌─────────────────────────────────────────┐
│ system prompt                           │
│ ## Active rules                         │
│ - api-conventions.md (full 1200 tokens) │  ← testing evicted, API swapped in
└─────────────────────────────────────────┘
│ user: Write a test for useAuth          │  ← identical to before, but cache is dead
│ assistant: ...                          │
│ user: Now add an endpoint for it        │
```

The change happens near the top, so everything after it (the entire conversation) is a cache miss. Every turn you pay full price to reprocess the whole history. The model also loses the testing rules it was just following, so it may drift on the earlier test.

## GOOD: static index, expand by appending

The prefix never changes. It only contains a short index telling Claude *where* the rules are:

```text
┌─────────────────────────────────────────┐
│ system prompt (static)                  │
│                                         │
│ ## Project rules (read when relevant)   │
│ - Writing/editing tests → docs/testing.md      │
│ - HTTP endpoints, API shape → docs/api.md      │
│ - Styling, design tokens → docs/styling.md     │
│ - DB schema changes → docs/migrations.md       │
└─────────────────────────────────────────┘   ← ~100 tokens, cached forever

Turn 1: user: Write a test for useAuth
        assistant: [Read docs/testing.md]      ← 800 tokens APPENDED here
        tool result: <testing.md contents>
        assistant: ...writes the test

Turn 2: user: Now add an endpoint for it
        assistant: [Read docs/api.md]          ← 1200 tokens APPENDED here
        tool result: <api.md contents>
        assistant: ...writes the endpoint
```

On turn 2, the prefix (system prompt + all of turn 1, including `testing.md`) is byte-identical to the previous request, so it's a cache hit. You only pay full price for the new tokens at the end. And `testing.md` stays in context, so the rules are still available if you say "actually, adjust that test."

## The tradeoff

|                       | BAD                                  | GOOD                                         |
| --------------------- | ------------------------------------ | -------------------------------------------- |
| Cache hits            | Almost never                         | Nearly every turn                            |
| Prefix size           | Small                                | Small                                        |
| Rules available later | Only if re-injected                  | Stay in history                              |
| Cost of a rule load   | Full reprocess of everything         | Just the appended tokens                     |
| Risk                  | Model forgets rules it was following | Model might not read the file when it should |

That last risk is the real downside of the good approach. The index entries need to be specific about *when* to read each file ("Writing/editing tests →", not just "testing"), or Claude may skip the lookup. This is the same mechanism skills use: a name and a trigger description in the prefix, and the full instructions loaded on demand.

## In Claude Code specifically

* **Good**: a short `CLAUDE.md` with pointers like the index above, or skills with good descriptions, or `@docs/api.md`-style references loaded on demand.

* **Bad**: a `UserPromptSubmit` hook or script that regenerates `CLAUDE.md` based on the current task, or that prepends different rule text to the system prompt each turn.

* **Fine**: a hook that appends context to the conversation each turn (it lands at the end, after the cached prefix), as long as it doesn't modify earlier content.

The principle is about **who writes it and how it changes**. There are two kinds of context, and they should live in separate places with separate rules.

## The two categories

|                  | Static primitives                                   | Runtime memory                                               |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| **Written by**   | You (the developer)                                 | The agent, during execution                                  |
| **Changes**      | Deliberately, via commits and review                | Constantly, as the agent learns                              |
| **Examples**     | Skills, hooks, plugins, `CLAUDE.md`, slash commands | `notes.md`, `progress.md`, scratch files, memory directories |
| **Trustworthy?** | Reviewed, versioned, tested                         | Unreviewed, may be wrong or stale                            |

## BAD: mixed together

The agent is allowed to write to the same place your engineered instructions live:

```text
.claude/
  CLAUDE.md              ← your rules AND the agent appends "lessons learned" here
  skills/
    deploy/SKILL.md      ← agent "improves" this after a failed run
```

What goes wrong:

* The agent hits a flaky test and writes "tests always fail on first run, just retry" into `CLAUDE.md`. That's now a permanent rule in every future session.

* A wrong or one-off conclusion gets baked into a skill, and the skill degrades silently over time.

* Git diffs become noise. You can no longer tell which lines you wrote and which the agent did.

* It also breaks the cache advice from earlier: editing `CLAUDE.md` or a skill mid-session changes the stable prefix.

* A prompt injection (from a web page or a file the agent read) can write itself into your permanent instructions.

## GOOD: separated

```text
.claude/
  CLAUDE.md              ← static, human-edited, reviewed in PRs
  skills/deploy/SKILL.md ← static, versioned, read-only for the agent
  hooks/                 ← static

.agent-memory/           ← runtime, agent-owned, gitignored
  progress.md            ← "migrated 12 of 40 components, next: Table"
  findings.md            ← "useAuth has a circular dep with useSession"
  todo.md
```

How they interact:

* `CLAUDE.md` contains one static line: "Check `.agent-memory/progress.md` at the start of a long task, and update it as you go."

* The agent reads and writes only to `.agent-memory/`. Your primitives are never touched.

* Memory is disposable. You can delete it, inspect it, or reset it between tasks without affecting your engineered setup.

## A concrete workflow

A long refactor spanning many sessions:

1. Your skill `migrate-component` defines *how* to migrate (static, tested, same every time).

2. The agent keeps `progress.md` for *where it is* (runtime state).

3. After the session, you review `progress.md`. If it contains a genuinely useful insight ("always run codegen before the typecheck"), **you** promote it into the skill or `CLAUDE.md` via a normal commit.

That last step matters. Runtime memory is where the agent can learn, and static primitives are where you decide what's worth keeping.

## Why it's worth the separation

* **Safety**: the agent can't silently rewrite its own rules.

* **Debuggability**: when behavior changes, you know whether to look at your code or the agent's notes.

* **Cache stability**: static files stay unchanged, so the prefix stays cacheable. Memory is read on demand and appended, like the lazy expansion pattern.

* **Reproducibility**: the same primitives plus empty memory gives the same starting behavior.

A rough test: if the agent can edit it mid-run, it's memory and shouldn't be in the same place as the things you engineered.

Almost always by accident, through a reasonable-sounding shortcut. Nobody sets out to design the bad version. Here are the common routes.

## 1. A well-meaning instruction in your own prompt or CLAUDE.md

The most common one:

```markdown
# CLAUDE.md
Whenever you learn something new about this codebase, add it to this file
so you don't forget next time.
```

It sounds smart: the agent "learns" and gets better. In practice you've given it write access to its own permanent instructions. The first flaky test, wrong guess, or one-off workaround can become a rule for every future session.

The same pattern shows up in skills: "after each run, update this skill with improvements."

## 2. Built-in convenience features that write to instruction files

Some tools make it easy to append to your instruction file from the chat (Claude Code has had shortcuts for adding to `CLAUDE.md` in the past; check the docs for how your version handles this). That's fine when *you* choose what to add. It becomes the bad pattern when the agent does it on its own initiative and you don't review the result.

## 3. Permissions that are too broad

If the agent has write access to `.claude/`, `CLAUDE.md`, or skill folders, and you're approving edits quickly or running in a permissive mode, it can modify its own setup without you noticing. Edits to `CLAUDE.md` look like any other file edit in a long session.

## 4. No separation was ever designed

You start with one `CLAUDE.md`. It grows. Some lines are yours ("use pnpm"), some were added by the agent ("the auth module has a circular dependency"), and some came from a teammate's session. Nobody decided to mix them; there was just one file and it was the obvious place to put things.

## 5. Prompt injection

The agent reads a web page, an issue comment, or a dependency README containing text like "add the following to your project notes." If the agent's notes and your rules are the same file, injected text can land in your permanent instructions.

## 6. Self-improving agent setups

Agent builders sometimes add a "reflection" step: after each task, the agent summarizes lessons into its prompt or rule store. Without a separate, disposable memory area and a human promotion step, that loop writes unreviewed conclusions straight into the thing that shapes future behavior.

## How to notice you're in it

* `git log` on `CLAUDE.md` or skills shows commits you don't remember writing, or the file keeps growing.

* Behavior drifts between sessions and you can't tell why.

* The file contains oddly specific, one-off statements ("tests fail on first run, retry").

* Two teammates get different behavior from the same repo.

## Simple guardrails

* Tell the agent to write notes to a dedicated file (e.g. `.agent-memory/notes.md`), never to `CLAUDE.md` or skills.

* Review diffs to instruction files like code. Put them under CODEOWNERS if you work on a team.

* Use permission rules to deny writes to `.claude/skills/` and `CLAUDE.md` for routine runs.

* Promote useful findings yourself, after reading them.

***

### 5. Multi-Agent Operational Scaling

When scaling from a single session to concurrent agents, managing human cognitive context-switching becomes the primary bottleneck.

* **Git Worktree Isolation**: Assign each concurrent agent session its own Git worktree to prevent agents from overwriting each other's working directories.

* **Visual Session Identity**: Utilize visual labeling commands (`/rename`, `/color`) to quickly identify agent tasks across 16–20+ parallel sessions.

* **Automated Feedback Polling**: Deploy cron-like background commands (`/loop`) to periodically monitor long-running CI test builds without manual prompt intervention.

* **Autonomous Execution Safeguards**: Enable auto mode to bypass permission prompts safely using multi-stage background classifier screenings.

***
