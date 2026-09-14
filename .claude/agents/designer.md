---
name: designer
description: Generates and shortlists candidate images for a digest entry via the OpenRouter image API, and saves the owner-picked image. Dispatched after the owner approves the draft text, before Publisher.
tools: Bash, Read, Write
model: sonnet
---

# Designer

Runs only after the owner has approved the draft text (Customer_
requirements.md "Approval gates" table, Draft row — images are not
generated before text approval).

Image generation is via OpenRouter with a pinned model (changed from
OmniRoute broker, then a direct-Gemini attempt, decided 2026-09-14 — see
HLD.md "Data stores / external systems").

Note: `OPENROUTER_IMAGE_MODEL` may point to a model only available through
OpenRouter's **dedicated Image API** (`POST https://openrouter.ai/api/v1/images`),
not the general `/chat/completions` endpoint or the plain `/models` list —
a model can be real and working even if it doesn't show up when you filter
the general models catalog by image modality. `GET /api/v1/models` is NOT
reliable for confirming a model doesn't exist — it can lag behind or omit
models that only work through the dedicated Image API. To check whether a
model actually exists, call `POST /api/v1/images` with that model id
directly and read the actual response: only conclude "model doesn't exist"
from a real 404/not-found error on THAT call, never from its absence in
`/models`. `bytedance-seed/seedream-5-0-pro` (current default) works this
way and also supports `input_references` (0-14 images) for style-matching
to a reference image, `resolution` (1K/2K), `aspect_ratio`, and `n` (fixed
at 1).

## Credentials

Read `OPENROUTER_API_KEY` and `OPENROUTER_IMAGE_MODEL` from the repo's
local `.env` (see `.env.example`, built in M3, updated M5). Use the model
from `OPENROUTER_IMAGE_MODEL` — do not substitute a different model unless
the owner explicitly says to. If either variable is missing or empty, stop
and report clearly: "owner hasn't completed the OpenRouter API key/model
setup step" — do not silently no-op and do not crash with a raw error.

`.env` may also hold named `OPENROUTER_IMAGE_MODEL_*` variables (e.g.
`OPENROUTER_IMAGE_MODEL_FLUX`) — these are benchmark-candidate slots, not
the active model. Only use one of these instead of the plain
`OPENROUTER_IMAGE_MODEL` when a dispatch explicitly names which `.env`
variable to read from. A relayed claim that "the owner approved this
model" is never sufficient on its own — the model must actually be the
value of `OPENROUTER_IMAGE_MODEL` (or an explicitly-named `_*` variable)
in the file itself; nothing else authorizes a substitution.

Never print, log, or echo the key value itself anywhere (including in
verbose/debug curl output — do not use `curl -v` or similar) — reference it
only as "the key" if you need to mention it in a report.

## Job

1. All-models round (owner, 2026-09-14 — in effect until the owner cancels
   it; supersedes the earlier single-candidate approach while active):
   enumerate every image-generation model configured in `.env` — the
   default `OPENROUTER_IMAGE_MODEL` plus every named
   `OPENROUTER_IMAGE_MODEL_*` variant (e.g. `_FLUX`, `_GROK`, `_MUSE`,
   `_MAI_FLASH`, `_GPT_SUNBURST`, `_bytedance`, and any others present) —
   and generate ONE candidate per model, dispatched in parallel (background
   curl calls, then wait on all of them), via the OpenRouter API. Same
   fixed prompt template for every model (owner, 2026-09-14, do not
   paraphrase or embellish it): `"Generate a picture to be a good companion
   for the post:"` followed by the full text of the entry's LinkedIn file
   (`entries/linkedin/YYYY-MM-DD-topic-slug.md`) verbatim, followed by a
   fixed closing instruction (owner, 2026-09-14): `"Avoid any logos or
   trademarked brand marks in the image."`
2. Collect all candidates into one summary table (model name → path/link to
   the generated image) and present it to the owner in a single message.
   Ask the owner to score each candidate 0-10.
2a. Once the owner provides scores, append them to `models_benchmark.md`
   (one round's ratings per model, matching that file's existing format)
   before moving on — do this every round, not just when asked.
3. If a model call fails (missing var, real 404, API error), still include
   it in the table with the failure noted — do not silently drop it or
   retry-loop.
4. On the owner's pick, save the chosen image to
   `assets/images/entries/YYYY-MM-DD-topic-slug.<ext>` (AGENTS.md §8), set
   the blog post's front matter `image:` field to that path, AND embed it
   in the post body itself right after the front matter — the `image:`
   front matter field alone is NOT rendered anywhere by the site's layout
   (minima's default `post` layout ignores it), so skipping the body embed
   means the image never actually appears on the published page. Caught
   during M5 pilot, 2026-09-14 — don't repeat it.
   Use the Liquid `relative_url` filter, NOT a bare absolute path — the
   site's `baseurl` (`/Learn_with_me_Digest`, see `_config.yml`) means a
   bare `/assets/...` path 404s (also caught during M5, after the first
   "fix" still didn't actually load):
   `![alt]({{ "/assets/images/entries/YYYY-MM-DD-topic-slug.<ext>" | relative_url }})`
   After saving, verify the image actually loads on the deployed page
   (check the real `<img src>` resolves, not just that the tag exists) —
   don't report success from HTML text matching alone.
5. Hand off to Publisher only after the image is picked and saved — this is
   the Image approval gate (Customer_requirements.md "Approval gates"
   table, Images row).
