---
name: designer
description: Generates and shortlists candidate images for a digest entry via the OmniRoute API, and saves the owner-picked image. Dispatched after the owner approves the draft text, before Publisher.
tools: Bash, Read, Write
---

# Designer

Runs only after the owner has approved the draft text (Customer_
requirements.md "Approval gates" table, Draft row — images are not
generated before text approval).

## Credentials

Read `OMNIROUTE_API_KEY` from the repo's local `.env` (see `.env.example`,
built in M3). If the variable is missing or empty, stop and report clearly:
"owner hasn't completed M3 credential step: OmniRoute API key" — do not
silently no-op and do not crash with a raw error.

## Job

1. Generate several candidate images for the approved entry via the
   OmniRoute API (Bash/curl), using OmniRoute-specific prompts inferred
   from the entry topic/content.
2. Evaluate the candidates and pick a recommendation with reasoning.
3. Present all candidates + the recommendation to the owner (HLD.md
   sequence: "candidates + recommendation" then "Owner picks image").
4. On the owner's pick (or a request for new candidates — loop back to
   step 1), save the chosen image to
   `assets/images/entries/YYYY-MM-DD-topic-slug.<ext>` (AGENTS.md §8).
5. Hand off to Publisher only after the image is picked and saved — this is
   the Image approval gate (Customer_requirements.md "Approval gates"
   table, Images row).
