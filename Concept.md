# Concept.md

Ideas under consideration for **how** the digest gets produced — tools,
agents, and workflows. Not commitments; not what goes *in* a digest entry
(that's editorial, decided per entry per [AGENTS.md](AGENTS.md)). Move an
idea out of here once it's actually built, and describe the real thing in
AGENTS.md instead.

## Pipeline shape

A candidate end-to-end flow for one digest entry:

1. **Trigger** — cadence-based (e.g. weekly Routine) or ad hoc (owner picks a
   topic and kicks it off manually).
2. **Research** — an agent gathers sources for the chosen topic/subtopic
   (web search/fetch, or a specific source the owner points at).
3. **Draft** — an agent writes both formats (blog + LinkedIn, AGENTS.md §3)
   against the style guide in AGENTS.md §5.
4. **Self-check** — Critic agent verifies claims are sourced, the entry
   doesn't drift beyond its declared topics (AGENTS.md §2), and no
   fabricated facts/citations slipped in (AGENTS.md §6).
5. **Owner review** — human review/edit before either format is treated as
   final (AGENTS.md §4 step 5).
6. **Publish** — merge to the main branch; GitHub Actions deploys the Jekyll
   site, Blogger posts the short form to LinkedIn via its API.

## Publishing channels — implementation

The dual-format/cross-link/CTA rules themselves are policy, not an idea —
see AGENTS.md §3. Decided (owner, 2026-09-14):

- Editor drafts the long form first; the short (LinkedIn) form is derived
  from it, not written in a separate pass.
- The LinkedIn CTA line is freshly written per post (not a templated
  rotation) — Critic checks both required parts (AGENTS.md §3) are present.
- The cross-link to the blog is inserted as a placeholder at draft time;
  Publisher resolves it to the real URL before posting to LinkedIn.

## Topic continuity — implementation

The continuity rule itself is policy — see AGENTS.md §2. Open: does the
follow-up chain get written down anywhere durable (a running list per topic
thread), or does the owner just carry it between sessions for now?

## Agents & roles

Built in M4 — see HLD.md "Components" and "Decided" for the actual roster
(topic-manager, researcher, editor, critic, designer, publisher) and
`.claude/agents/*.md` / `.claude/skills/digest-entry/` for the
implementation. HLD.md is the source of truth for this now; not duplicated
here.

## Trigger mechanism

**Decided:** owner-initiated, ad hoc — the owner starts a session and runs
the entry prompt each time (Customer_requirements.md). No recurring
Routine/cron trigger.

## Tooling notes

- Research: `WebSearch`/`WebFetch` for general sources; direct links the
  owner supplies take priority over agent-discovered ones.
- Drafting/editing happens as normal file edits in this repo (no special
  CMS).
- Git: one branch per entry (or per batch), PR opened for owner review,
  merged by the owner (AGENTS.md §9).

## Decided (this pass)

- Cadence: ad hoc — owner starts a session and kicks off an entry, no
  cron/Routine trigger.
- Research sourcing: open web search (`WebSearch`/`WebFetch`), no fixed
  allowlist — cite per AGENTS.md §6.
- LinkedIn API access: direct API, no MCP. Owner still needs to create the
  Developer app, get `w_member_social` scope, and complete OAuth (see
  Customer_requirements.md).

Also decided: the repo holds both formats as separate files per entry
(blog + LinkedIn), committed together by Editor — no generate-at-publish
step.

## Open questions

None outstanding.
