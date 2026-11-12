# Duck Facts Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A 200×200 animated mascot duck in the right gutter of every page that "says" humorous, sourced LLM facts in a comic speech bubble and reacts to each one.

**Architecture:** Facts live in `_data/duck_facts.yml` and are rendered to `/assets/duck/facts.json` by Liquid. A small vanilla-JS widget, loaded site-wide from `_includes/head.html`, builds its own DOM, filters facts by age at runtime, shuffles them, and cycles bubble + reaction clip (WebM, lazy-loaded). Clips come from a video model seeded with the mascot reference image, post-processed by ffmpeg.

**Tech Stack:** Jekyll (GitHub Pages `actions/jekyll-build-pages`, minima theme), vanilla JS (ES modules, no build step), `node:test` for widget logic, Python 3.12 + PyYAML for the facts validator, ffmpeg 8 for clip processing, OpenRouter API.

**Spec:** [plans/2026-11-12-duck-facts-widget-design.md](2026-11-12-duck-facts-widget-design.md)

## Global Constraints

- Duck box: 200×200 px. Shown only at viewport width ≥ 1240 px; hidden below.
- Every page of the site (home, posts, topic pages, news, About).
- Not interactive: no click/drag/dismiss/hover/chat/sound. The "source" link is the only clickable element.
- Reactions (owner gate 1, 2026-11-12): `surprised`, `laughing`, `nodding`, `thinking`, `facepalm`, `shrugging`; plus `idle` loop.
- Fact fields: `text`, `source_url`, `source_title`, `source_date` (YYYY-MM-DD), `reaction`.
- Recency: a fact is shown only while `source_date` is ≤ 183 days old (runtime filter). Never add a source older than 6 months.
- Humour in phrasing only; never bend the fact. No fabricated claims (AGENTS.md §6).
- Bubble hold time: 8–12 s scaled by text length; fade out; short pause; next fact. Random order per page load; loops forever.
- `prefers-reduced-motion: reduce` → still poster frame, facts still rotate, no fade/bob animation.
- Clips: on-model per [Mascot.md](../Mascot.md), seeded from `assets/images/mascot/duck-reference.png`, prompt forbids logos/trademarks, white page background (`#fdfdfd`), hologram panel kept ("?" idle/thinking, "!" surprised, check mark nodding, "!" facepalm, "?" shrugging).
- Clips lazy-loaded; must not slow page load.
- Video model fails (off-model, loop seam, drifting background) → stop, show clips, ask owner. No automatic fallback.
- English only in all committed files. Feature branch `feature/duck-facts-widget`; owner reviews before merge.
- Owner gates, hard stops in order: (1) reaction set, (2) fact list, (3) clip pick, (4) final page review.

## Review Focus

1. Fewer than ~3 facts left after the age filter (or zero) → widget shows the duck idle with no bubble, no JS error, no empty bubble.
2. `facts.json` or a clip fails to load (404/offline) → duck falls back to the poster image; no console exceptions; page unaffected.
3. Long fact text → bubble never overflows the viewport top or overlaps the content column; text capped at 160 chars by validator.
4. Window resized across 1240 px → widget hides/shows without layout jump of the content column.
5. Background tab / page hidden → cycle pauses (no queued burst of facts on return).

---

### Task 0: Owner gate 1 — reaction set

- [ ] **Step 1:** Ask the owner (dialog) to confirm the reaction set `surprised`, `laughing`, `nodding`, `thinking` + `idle`, with pros/cons. Record the decision in the spec's "Decided by the owner" section. Stop until answered.

### Task 1: Facts data contract + validator

**Files:**
- Create: `tools/duck/check_facts.py`, `tools/duck/test_check_facts.py`, `_data/duck_facts.yml` (empty list `[]`)
- Modify: `_config.yml` — add `tools` to `exclude`

**Interfaces:**
- Produces: `validate(facts: list[dict], today: date) -> list[str]` (error strings, empty = valid); CLI `python tools/duck/check_facts.py [path]` exits 1 on errors. `REACTIONS = {"surprised","laughing","nodding","thinking","facepalm","shrugging"}`, `MAX_AGE_DAYS = 183`, `MAX_TEXT = 160`.

- [ ] **Step 1: Write failing tests** in `test_check_facts.py` (pytest):
  - `test_valid_fact_passes` — one complete fact dated `today - 10d` → `[]`.
  - `test_missing_field` — drop `source_url` → error mentions `source_url`.
  - `test_unknown_reaction` — `reaction: "dancing"` → error.
  - `test_too_old` — `source_date = today - 184d` → error; `today - 183d` → no error.
  - `test_future_date` → error.
  - `test_text_too_long` — 161 chars → error; 160 → ok.
  - `test_url_not_https` — `http://…` → error.
  - `test_markdown_in_text` — text containing `**` or `](` → error (text is shown raw).
  - `test_duplicate_url_and_text` — identical `text` twice → error.
- [ ] **Step 2:** Run `python -m pytest tools/duck -v` → FAIL (module missing).
- [ ] **Step 3:** Implement `validate` and CLI in `check_facts.py` (PyYAML `safe_load`; dates may load as `date` objects or strings — accept both).
- [ ] **Step 4:** Run `python -m pytest tools/duck -v` → PASS; `python tools/duck/check_facts.py` on the empty file → exit 0.
- [ ] **Step 5:** Commit `feat(duck): facts data contract and validator`.

### Task 2: Facts content (owner gate 2)

**Files:** Modify `_data/duck_facts.yml`

**Interfaces:** Consumes Task 1 contract and validator.

- [ ] **Step 1:** Dispatch `researcher`: 30+ surprising, verifiable facts about LLMs/AI, each with a primary source dated within the last 6 months (≤3 preferred), URL, title, date. Report shortfall honestly if fewer exist.
- [ ] **Step 2:** Dispatch `editor`: rewrite each as one humorous sentence ≤160 chars, plain text, assign a reaction from the Task 0 set; humour in phrasing only.
- [ ] **Step 3:** Dispatch `critic`: check each fact against its source (no bent facts, no fabrication, date in window).
- [ ] **Step 4:** Write the list into `_data/duck_facts.yml`; run `python tools/duck/check_facts.py` → exit 0.
- [ ] **Step 5:** Owner gate 2: show the list as a table (fact → reaction → source). Apply edits. Stop until approved.
- [ ] **Step 6:** Commit `content(duck): N humorous LLM facts`.

### Task 3: Video model probe + clip generation (owner gate 3)

**Files:**
- Create: `tools/duck/gen_clip.py`, `tools/duck/process_clip.sh`, `assets/duck/clips/{idle,surprised,laughing,nodding,thinking,facepalm,shrugging}.webm`, `assets/duck/clips/{same}.mp4`, `assets/duck/poster.png`
- Modify: `.env` (add `OPENROUTER_VIDEO_MODEL_*` names that work), `Mascot.md` ("How to animate it" section with the working call)

**Interfaces:**
- Produces: clips at `/assets/duck/clips/<reaction>.webm` + `.mp4` fallback, 400×400 (2× for retina), ≤ 4 s, idle seamlessly loopable, each reaction starts and ends on the idle pose; `/assets/duck/poster.png` 400×400 (first idle frame).

- [ ] **Step 1:** Probe candidates with one minimal call each: `google/gemini-omni-1.2-flash` (OpenRouter catalog lists video output), and xAI Grok video via OpenRouter's dedicated endpoint (catalog absence ≠ non-existence; verify by the call itself). Record which accept the reference image and return video.
- [ ] **Step 2:** Implement `gen_clip.py --model <id> --reaction <name> --out <path>`: sends `duck-reference.png` + prompt (character sheet from Mascot.md, the reaction, hologram content per Global Constraints, plain `#fdfdfd` background, static camera, start/end on neutral idle pose, "Avoid any logos or trademarked brand marks"). Key from `.env`, never printed.
- [ ] **Step 3:** Generate `idle` with every working model, in parallel, ≤3 attempts per model. If none is usable → stop, show clips, ask owner (spec rule).
- [ ] **Step 4:** Implement `process_clip.sh <in> <name>`: ffmpeg crop/scale to 400×400, trim to ≤4 s, VP9 WebM (`-crf 34 -b:v 0`, no audio) + H.264 MP4 fallback (`-an -movflags +faststart`); for idle also extract `poster.png`. Check each file ≤ 600 KB.
- [ ] **Step 5:** Owner gate 3: table model → idle clip (paths); owner picks a model. Then generate the 6 reactions with that model, process, show, owner approves. Stop until approved.
- [ ] **Step 6:** Commit `assets(duck): mascot clips and generator tooling`.

### Task 4: Widget core logic (pure, tested)

**Files:**
- Create: `assets/duck/duck-core.js` (ES module), `tools/duck/duck-core.test.mjs`, `assets/duck/facts.json` (front matter `---\n---\n{{ site.data.duck_facts | jsonify }}`)

**Interfaces:**
- Produces (exports from `duck-core.js`):
  - `activeFacts(facts: Fact[], now: Date, maxAgeDays = 183): Fact[]`
  - `shuffle<T>(items: T[], rng: () => number = Math.random): T[]` (returns new array)
  - `holdMs(text: string): number`
  - `createCycler(facts: Fact[], rng?): { next(): Fact | null }` — walks a shuffled order, reshuffles at the end, never repeats the same fact twice in a row across the reshuffle boundary; `next()` returns `null` when `facts` is empty.

- [ ] **Step 1: Write failing tests** (`node --test tools/duck/`):
  - `activeFacts` keeps age 183 d, drops 184 d, drops future dates, drops invalid dates.
  - `shuffle` with a seeded rng is deterministic, is a permutation, does not mutate input.
  - `holdMs("")` = 8000; `holdMs("x".repeat(160))` = 12000; monotonic in between; never outside [8000, 12000].
  - `createCycler([])` → `next()` is `null`; with 3 facts, 30 calls never return the same fact twice in a row and each fact appears 10 times; with 1 fact, always that fact.
- [ ] **Step 2:** Run `node --test tools/duck/` → FAIL.
- [ ] **Step 3:** Implement. `holdMs` = `8000 + 25 * length`, clamped to [8000, 12000].
- [ ] **Step 4:** Run `node --test tools/duck/` → PASS.
- [ ] **Step 5:** Commit `feat(duck): widget core logic`.

### Task 5: Widget DOM, styles, site-wide include

**Files:**
- Create: `assets/duck/duck.js` (ES module, imports `duck-core.js`), `assets/duck/duck.css`, `tools/duck/preview.html` (local harness mimicking minima: 740 px centered column, header, long body)
- Modify: `_includes/head.html` — add `<link rel="stylesheet" href="{{ '/assets/duck/duck.css' | relative_url }}">` and `<script type="module" src="{{ '/assets/duck/duck.js' | relative_url }}"></script>`

**Interfaces:**
- Consumes: Task 4 exports; Task 3 clip/poster paths; `/assets/duck/facts.json`.
- Produces: `<aside class="duck-widget" aria-hidden="false">` appended to `body`, containing `.duck-bubble` (text + `<a class="duck-source" target="_blank" rel="noopener">source</a>`) and `.duck-stage` (poster `<img>` + one `<video muted playsinline>` for idle and one for reactions).

- [ ] **Step 1:** CSS: `.duck-widget` absolute, `top: 200px`, `left: calc(50% + 370px + 40px)` (right of minima's 740 px column), 200×200 stage; `display:none` below `min-width: 1240px`; comic bubble above the duck with a tail, max-width 260 px, never above viewport top; fade via opacity transition; reduced-motion media query disables transitions and video.
- [ ] **Step 2:** JS: build DOM after `load` (then `requestIdleCallback` where available) so clips never compete with page load; fetch `facts.json`; `activeFacts` → `createCycler`; loop: show bubble → play reaction clip once → return to idle loop → wait `holdMs` → fade → 1.5 s pause → next. Pause on `visibilitychange` hidden, resume on visible. Any fetch/video error → keep poster, stop the cycle silently. Zero facts → idle duck, no bubble. Bubble text via `textContent` (never `innerHTML`).
- [ ] **Step 3:** Verify in Chrome against `tools/duck/preview.html` served by `npx http-server . -p 4000`: duck right of column at 1440 px; hidden at 1200 px; resize across 1240 px has no column jump; 3 facts cycle with reactions; `facts.json` 404 → poster only, no console errors; reduced motion (DevTools emulation) → still image, facts rotate; long 160-char fact fits; hidden tab pauses. Record a GIF.
- [ ] **Step 4:** Commit `feat(duck): animated facts widget on every page`.

### Task 6: Owner gate 4 + merge

- [ ] **Step 1:** Show the owner the preview GIF and Task 5 checklist results. Stop until approved.
- [ ] **Step 2:** On approval, merge `feature/duck-facts-widget` to `main` (owner's go-ahead), let GitHub Actions deploy.
- [ ] **Step 3:** Check the live site in Chrome on home, one post, one topic page, news, About: duck visible at ≥1240 px, `facts.json` served as JSON (Liquid rendered), no console errors.
- [ ] **Step 4:** Add to the spec's "Decided by the owner" section: "Refresh facts quarterly via plan Task 2 steps 1–5." Commit `docs(duck): facts refresh cadence`.
