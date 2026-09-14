# Customer_requirements.md

End-to-end user flow for producing one digest entry, from the owner's chair
in VS Code with an AI assistant attached. This is the entry-point UX
requirement — not the internal pipeline design (see [Concept.md](Concept.md)
for that).

## Entry point

- Owner opens VS Code with the AI assistant connected to this repo.
- Owner runs **one prompt**. The assistant decides what to do next based on
  repo state — no menu, no separate commands to memorize.

## Flow

1. **Topic check**
   - Backlog has ready topics → assistant proposes one, owner approves/edits.
   - Backlog is empty → assistant prompts a brainstorm session with the
     owner to find new topics/subtopics.
   - Topics must connect to each other (follow-up, contrast, deeper dive) —
     never picked in isolation (AGENTS.md §2).

2. **Draft**
   - On topic approval, assistant researches, writes the entry, and runs a
     Critic pass (sourcing, tone, scope-drift) before it reaches the owner.

3. **Text review**
   - Checked draft goes to the owner for review/edit.
   - Nothing moves forward until the owner approves the text.

4. **Images**
   - Assistant generates several candidate images via API.
   - Assistant evaluates them and presents options to the owner with its own
     recommendation and reasoning.
   - Owner picks (or rejects and requests new candidates).

5. **Save to git**
   - Once text + image are both approved, assistant commits the finished
     entry into its own folder in the repo.

6. **Publish blog**
   - Assistant updates the GitHub Pages blog with the new entry.

7. **LinkedIn short version**
   - Assistant drafts the condensed LinkedIn version (AGENTS.md §3 rules:
     link back to the blog post, both standing CTAs present).
   - Saved to git.

8. **LinkedIn publish**
   - Assistant posts the short version to LinkedIn.

## Approval gates (hard stops)

| Step | Gate |
|---|---|
| Topic | Owner approves topic before drafting starts |
| Draft | Owner approves text before images are generated |
| Images | Owner picks final image before saving/publishing |

## Decided

- Image generation: OmniRoute API, key in a local gitignored `.env`.
- LinkedIn posting: LinkedIn API, automated.
- Blog publish: Jekyll site, via a GitHub Actions workflow on merge to main.
- Pipeline built as split agent roles (subagent types, dispatched in
  sequence from one driving session), not one sequential agent (see HLD.md).
- A Critic pass runs before the draft reaches the owner.

## Decided (LinkedIn access)

- Direct LinkedIn API (no MCP). Owner steps required before Publisher can
  post automatically:
  1. Create a LinkedIn Developer app (developer.linkedin.com).
  2. Request "Share on LinkedIn" product → `w_member_social` scope.
  3. Complete OAuth once, store the resulting access token in the local
     `.env` alongside the OmniRoute key.

## Decided (this pass)

- Cadence: ad hoc, owner-initiated — no recurring trigger.
- Research sourcing: open web search, no fixed allowlist.
- Repo stores both formats as separate files per entry — no
  generate-at-publish step.

## Open dependencies

None outstanding.

## Remaining build tasks (not open questions — no further owner decision needed)

- Owner completes the LinkedIn app/OAuth steps above.
- GitHub Actions workflow file for Jekyll deploy not yet written.
