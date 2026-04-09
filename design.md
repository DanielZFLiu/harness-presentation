# Harness Presentation — Design Spec

> 10-minute technical presentation for engineering manager. Demonstrates engineering capability, validates architecture decisions, and positions Harness for team assembly when Claude Code becomes available.

## Context

- **Audience:** Engineering manager who actively codes. Cares about reliability, operational maturity, cost controls, team scalability. Gave the original ask and has been hands-off since v1 — needs a fresh introduction to what Harness has become.
- **Goals:** (1) Demonstrate engineering capability and initiative. (2) Validate the architecture as the right foundation. (3) Show potential and a clear roadmap so that when Claude Code arrives, a team can be assembled to build on this.
- **Constraints:** Harness runs only on personal laptop (Claude Code not yet available at work). Presentation will be screen recordings embedded in slides, ported to work computer. Personal laptop available as backup for live demos.
- **Narrative:** The presentation follows a game-building story. "Let's build a video game from scratch" — every feature demo serves this through-line, paying off at the end with a 10-second clip of the working game.

## Approach

**"Show Then Tell"** — demo-led with architecture payoff. Open with the problem, immediately jump into the game story and demo recordings. Once the audience has seen the system work end-to-end, pull back the curtain: "here's why it works" with architecture, guardrails, and code quality. Close with roadmap and game reveal.

## Structure

**15 slides across 4 sections. ~10 minutes total.**

### Section 1: Opening — Problem & Game Hook (~1.5 min)

**Slide 1 — Title**

- "Harness — Always-On AI Agent Orchestration"
- Name, date, "Prototype Presentation"
- Brief — don't explain yet.

**Slide 2 — The Problem**

- "AI coding agents are powerful. But who manages them?"
- Four cards: Task Management, Workspace Isolation, Reliability, Human Review
- Each card poses the question Harness answers.
- Footer: "Harness is the infrastructure layer that answers these questions."
- Narration: "You asked for something always-on. Here's what always-on actually requires."

**Slide 3 — The Hook**

- "Let's build a video game from scratch."
- Set the promise: Harness takes a game spec, decomposes it into tasks, dispatches AI agents, reviews automatically, produces a working game. No human writes a line of code.
- Callout box: "What you'll see: Intake -> Dispatch -> Agent Execution -> Self-Review -> Human Approval -> Working Game"

### Section 2: The Demo — "Watch It Build a Game" (~4 min)

**Slide 4 — Intake: Spec -> Tasks (Screenshots)**

- Before/after: raw game spec markdown -> structured tasks with priorities in the dashboard
- 2 screenshots of the actual Import page
- Quick — 20 seconds. "Harness's intake module decomposes it into structured tasks with priorities."

**Slide 5 — Dispatch + Agent Execution (Recording 1)**

- "Harness takes over"
- Embedded video (~2 min): full lifecycle from task creation -> dispatch -> agent working with live SSE events -> handoff artifact -> review -> approve -> merge
- Narrate live: point out SSE events streaming, cost accumulating, tools being called, zero-touch flow.

**Slide 6 — Agent Asks a Question (Screenshot)**

- "Agents keep humans in the loop"
- Screenshot of the question UI with multiple-choice options
- Explanation: agent pauses execution, question surfaces in dashboard via SSE, operator answers, agent resumes. Timeout fallback to autonomous mode after 5 min.

**Slide 7 — Gen/Eval Pipeline (Recording 2)**

- "Agents review their own work"
- Embedded video (~1.5 min): generator writes code -> evaluator reviews diff -> rejects with feedback -> generator retries -> evaluator approves
- Narrate live: point out GENERATOR/EVALUATOR badges, iteration grouping, verdict display.

**Slide 8 — Three Tiers of Review**

- Left: handoff artifact (summary, files changed, tests, commit hash, cost)
- Right: three review tiers as distinct options:
    - AUTO — auto-approve, skip review, merge immediately
    - AGENT — reviewer agent reviews the diff, approves or rejects
    - HUMAN — operator inspects handoff, approves or requests changes
- Mutually exclusive, configurable per task. Reject from any tier triggers agent retry with feedback.

### Section 3: "How It Works" — Architecture Reveal (~3 min)

**Slide 9 — Module Architecture**

- "Seven modules, tiered dependencies, clean contracts"
- Visual tier diagram: Core (Tier 0) -> Store/Workspace/Agent/Intake (Tier 1, parallel build) -> Daemon (Tier 2) -> Dashboard (Tier 3)
- Three callouts:
    - Core = zero implementation. Only types, interfaces, state machine.
    - Modules depend on interfaces, never internals.
    - 662 tests, zero mocking of SQLite. Each module testable in isolation.
- Narration: "Here's why that demo was smooth."

**Slide 10 — State Machine**

- "Every state transition has an owner. No exceptions."
- Visual flow: backlog -> ready -> queued -> running -> review -> done, with owner labels (human/daemon) on each arrow
- Three columns: Human-owned transitions, Daemon-owned transitions, Enforcement
- Key point: single `validateTransition()` function — every module goes through it. The daemon cannot approve its own work. Architectural enforcement, not policy.

**Slide 11 — Guardrails & Operational Safety**

- "Built for 24/7 operation — what stops it from going off the rails?"
- 2x3 grid:
    - Cost Controls — daily budget cap with mid-run enforcement
    - Stall + Timeout Detection — 5 min stall or 1 hour wall-clock -> cancelled
    - Quality Gates — shell commands must pass before agent finishes
    - Command Restrictions — deny/allow regex on Bash
    - Crash Recovery — daemon restart reconciles orphaned tasks, single-instance lock
    - Rate Limit Awareness — dispatch pauses on API rate limits, concurrency halved on warnings

**Slide 12 — Agent Profiles & Customization**

- "Specialized agents for specialized work"
- Left: code snippet of `harness.config.json` showing default/quick/heavy profiles with evaluator and qualityChecks
- Right: four points:
    - Named profiles — different models, budgets, permissions per task type. Inherit from default.
    - Per-repo context — agents load target repo's CLAUDE.md, skills, settings. Each codebase teaches agents its conventions.
    - Subagents — profiles declare sub-agents with own tools, prompts, model overrides.
    - Sandbox tiers — SDK permissions, command restrictions, disallowed tools.
- Narration: directly answers manager's ask about specialized/sandboxed agents for complex codebases.

### Section 4: Roadmap & Game Reveal (~1.5 min)

**Slide 13 — Roadmap: The Path to Always-On**

- "Infrastructure is built. Here's what's next."
- Horizontal timeline: v3.0 (SHIPPED) -> v3.1 (NEXT) -> v3.2-3.3 (PLANNED) -> v3.4 (PLANNED) -> v4 (VISION)
    - v3.0: Gen/eval pipeline. 662 tests.
    - v3.1: MCP server + task memory. Agents query own state. Context-limit recovery.
    - v3.2-3.3: Agent teams. Cron scheduler. Memory consolidation. Run observer.
    - v3.4: Task dependencies. Sprint contract negotiation. Docker isolation tiers.
    - v4: Agent-as-operator. AI manages the queue. Jira/Linear integration.
- Enterprise extensions footer: Jira/Linear connectors, Docker isolation, per-repo targeting, streaming input, analytics dashboard.
- Narration: connect v4 directly to his ask about Jira and 24/7 autonomous operation. "The infrastructure for v4 is what v3.0 through v3.4 are building toward."

**Slide 14 — The Ask**

- "When Claude Code arrives, we're ready."
- Two columns:
    - What exists today: full lifecycle, gen/eval pipeline, guardrails, configurable profiles, 7 modules with 662 tests, detailed roadmap through v4
    - What a team unlocks: Jira/Linear integration, Docker isolation, multi-repo support, agent-as-operator, per-codebase specialization at scale, production hardening
- Not a direct "give me a team" ask — structured so the manager sees the gap and draws the conclusion.

**Slide 15 — Game Reveal (Mic Drop)**

- "Remember the game? No human wrote a line of code."
- Embedded video: 10-second clip of the working game in a browser
- "Thank you. Questions?"
- Narration: short. "Remember the game spec from the beginning? Here it is." Play clip. Pause. Close.

## Assets Required

| Asset               | Type                    | Description                                                                         | Duration/Size |
| ------------------- | ----------------------- | ----------------------------------------------------------------------------------- | ------------- |
| Intake before/after | 2 screenshots           | Import page: raw spec + decomposed tasks                                            | —             |
| Full lifecycle      | Recording 1             | Task creation -> dispatch -> agent working -> handoff -> review -> approve -> merge | ~2 min        |
| Agent question UI   | 1 screenshot            | Question panel with multiple-choice options in dashboard                            | —             |
| Gen/eval pipeline   | Recording 2             | Generator -> evaluator rejects -> generator retries -> evaluator approves           | ~1.5 min      |
| Handoff artifact    | 1 screenshot (optional) | Review state with summary, files, tests, cost                                       | —             |
| Working game        | Recording 3             | The game running in a browser                                                       | ~10 sec       |

All recordings compressed via ffmpeg to <10 MB each.

## Technical Implementation

- **Framework:** SvelteKit (same as the dashboard — dogfooding)
- **Slide navigation:** Keyboard (arrow keys) and click-based
- **Video embedding:** `<video>` elements with compressed mp4 files, inline playback
- **Screenshots:** Static images embedded in slides
- **Styling:** External design file `presentation-theme.md` — to be created via frontend-design skill
- **Target:** Static build, portable to work computer (no daemon dependency)
- **Browser:** Designed for fullscreen presentation mode

## Game Choice

A web-based HTML5 Canvas game that:

- Claude can reliably build in a single session (or pipeline)
- Looks good in 10 seconds of footage
- Needs no build tooling (opens directly in a browser)
- Is instantly recognizable

Recommended: Snake, space shooter, or simple platformer. Final choice deferred to recording time.
