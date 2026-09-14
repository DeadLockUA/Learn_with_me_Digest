# M4 — Agent roster implementation

Goal: build the six subagent roles HLD.md decides on (Topic Manager,
Researcher, Editor, Critic, Designer, Publisher), dispatched in sequence
from one driving session — not a `Workflow`-tool pipeline (HLD.md
"Decided"). Owner still runs **one prompt** per entry (Customer_
requirements.md "Entry point"); the driving session/skill does the
dispatching and gate-checking.

## Tasks

1. **Draft the orchestration mechanism** — how "owner runs one prompt"
   maps to "driving session dispatches six subagent types in sequence":
   - Option A: a repo-local Skill (`.claude/skills/digest-entry/SKILL.md`)
     that the owner invokes (`/digest-entry`), whose instructions tell the
     assistant to dispatch each role via the Agent tool in order, stopping
     at each gate.
   - Option B: plain prose instructions added to AGENTS.md/CLAUDE.md that
     the assistant follows whenever the owner says "run an entry" — no
     dedicated skill file.
   - Recommendation: Option A — a Skill gives an explicit, discoverable
     entry point (matches "no menu, no separate commands to memorize" by
     being the *one* command) and keeps the sequencing logic out of the
     always-loaded AGENTS.md (token cost).
2. **Define each subagent** as `.claude/agents/<role>.md` (frontmatter:
   `name`, `description`, `tools`; body: role instructions referencing the
   relevant AGENTS.md section):
   - `topic-manager` — reads `Themas.md`, proposes/brainstorms a connected
     topic (AGENTS.md §2). Tools: Read, Edit (to update Themas.md), Grep.
   - `researcher` — gathers/verifies sources for the approved topic
     (AGENTS.md §6). Tools: WebSearch, WebFetch, Read.
   - `editor` — drafts blog + LinkedIn per AGENTS.md §3/§5, saves to the M1
     file layout (AGENTS.md §8). Tools: Read, Write, Edit.
   - `critic` — checks sourcing/tone/scope-drift/fabrication before the
     owner sees the draft (AGENTS.md §6, Concept.md). Tools: Read,
     WebFetch (to spot-check citations) — no Write (review-only).
   - `designer` — generates/evaluates images via the OmniRoute API (key
     from M3's `.env`), presents candidates + a recommendation. Tools:
     Bash (curl to OmniRoute) or WebFetch, Read, Write (save chosen image
     to `assets/images/entries/`).
   - `publisher` — commits the entry, triggers the Jekyll deploy (git push
     to main), and posts to LinkedIn **only after a separate explicit
     owner go-ahead** (Customer_requirements.md gate, decided 2026-09-14).
     Tools: Bash (git, LinkedIn API call).
3. **Wire the gates** into the orchestrating Skill's instructions — stop
   and wait for owner input at each:
   - Topic approval (before Researcher runs).
   - Draft/text approval (before Designer runs).
   - Image approval (before Publisher saves/deploys).
   - LinkedIn approval (immediately before the LinkedIn post call — always
     a separate stop, even though it's the same Publisher role that also
     did the git/Jekyll steps).
4. **No live credentials yet** — M3's owner steps (LinkedIn OAuth,
   OmniRoute key) may still be open. Build Designer/Publisher so they read
   `OMNIROUTE_API_KEY`/`LINKEDIN_ACCESS_TOKEN` from `.env` and fail with a
   clear "owner hasn't completed M3 step X" message if missing, rather than
   silently no-op-ing or crashing unhelpfully.
5. **Dry-run check** — with no real topic yet (pilot entry is M5), verify
   at least that: the Skill triggers, each Agent-tool dispatch has valid
   frontmatter (`name`/`description`/`tools` parse), and the gate-stop
   points actually pause for input rather than auto-continuing. A full
   content run is M5, not M4.
6. **Update docs**: HLD.md "Remaining build tasks" (agent roster is no
   longer just a plan), Concept.md if the orchestration mechanism differs
   from what's implied there (still says "subagent types dispatched in
   sequence" — should still match).

## Gate

Do not start M5 (pilot entry) until all six agent definitions exist, the
orchestrating Skill dispatches them in the right order, and all four gates
(topic/draft/image/LinkedIn) actually stop for owner input in a dry run.
