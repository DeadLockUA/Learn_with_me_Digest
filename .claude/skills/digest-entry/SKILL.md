---
name: digest-entry
description: Run one digest entry end to end — dispatches the six subagent roles (topic-manager, researcher, editor, critic, designer, publisher) in sequence, stopping for explicit owner approval at each gate. Use when the owner asks to run/produce/start a digest entry, or invokes /digest-entry. This is the one-prompt entry point (Customer_requirements.md "Entry point").
---

# Digest Entry

Orchestrates one full digest entry as a sequence of subagent dispatches via
the Agent tool, matching HLD.md's decided architecture (subagent types
dispatched in sequence from one driving session — not a `Workflow`-tool
pipeline). The owner runs this one skill; it decides what to do next based
on repo state (Customer_requirements.md "Entry point").

Source of truth for gate wording: Customer_requirements.md "Approval gates
(hard stops)" table. Do not paraphrase past what that table says when
presenting a gate to the owner.

## Sequence

Dispatch subagents via the Agent tool in this order. Do not skip a role and
do not reorder them.

1. **topic-manager** — proposes or brainstorms a topic from `Themas.md`.
2. **GATE — Topic approval.** Present the proposal to the owner. Stop and
   wait. Do not dispatch researcher until the owner approves the topic
   (Customer_requirements.md, Topic row: "Owner approves topic before
   drafting starts").
3. **researcher** — gathers/verifies sources for the approved topic.
4. **editor** — drafts blog + LinkedIn from Researcher's output.
5. **critic** — reviews the draft (sourcing, tone, scope-drift). If Critic
   sends it back, re-dispatch editor, then critic again, until clean.
6. **GATE — Draft/text approval.** Present the checked draft to the owner.
   Stop and wait. Do not dispatch designer until the owner approves the
   text (Customer_requirements.md, Draft row: "Owner approves text before
   images are generated"). If the owner requests edits, re-dispatch editor
   (then critic) and return to this gate — do not proceed on a partial or
   implied approval.
7. **designer** — generates ONE candidate image via the OpenRouter API
   (fixed prompt template, see designer.md), presents it to the owner.
8. **GATE — Image approval.** Present the candidate to the owner. Stop and
   wait. Do not dispatch publisher's commit/deploy steps until the owner
   approves the image (Customer_requirements.md, Images row: "Owner picks
   final image before saving/publishing"). If the owner rejects it,
   re-dispatch designer for ONE new candidate (not a batch) and return to
   this gate.
9. **publisher — repo/deploy steps only** — commits the entry (blog +
   LinkedIn file + image) and triggers the Jekyll deploy. Publisher must
   stop itself after this and must NOT call the LinkedIn API yet (see its
   own agent definition).
10. **GATE — LinkedIn approval.** This is a separate stop from the Image
    approval gate, even though the same publisher role just ran the
    git/deploy steps. Ask the owner explicitly, immediately before any
    LinkedIn call. Source of truth (Customer_requirements.md, LinkedIn
    publish row): "Owner gives explicit go-ahead immediately before
    posting — separate from and after the text/image approvals; blog
    publish (step 6) does not imply this approval." A completed commit or
    successful Jekyll deploy is never itself this approval.
11. **publisher — LinkedIn step** — only after gate 10's explicit
    go-ahead, dispatch publisher again (or continue its run) to make the
    LinkedIn API call.

## Rules

- Never merge gates. Each of the four gates (topic, draft, images,
  LinkedIn) is its own stop, even when two gates would otherwise land back
  to back (e.g. image pick and LinkedIn go-ahead are both "late" in the
  pipeline but must never be collapsed into one ask).
- If repo state shows a partially-completed entry (e.g. a draft exists but
  isn't yet critic-checked), resume from the appropriate step instead of
  restarting from topic-manager.
- Credentials: designer needs `OPENROUTER_API_KEY` +
  `OPENROUTER_IMAGE_MODEL`, publisher needs
  `LINKEDIN_ACCESS_TOKEN`, both from the local `.env` (M3). If either
  subagent reports the credential missing, relay that to the owner as a
  blocker rather than retrying or skipping the step silently.
