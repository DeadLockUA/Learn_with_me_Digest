# Duck facts widget — design

Status: draft, awaiting owner approval (2026-11-12).

## Intent

An animated mascot duck in the empty space to the right of each page's
content, in the spirit of the old Office assistants (the paperclip) — but
**not interactive**. It "talks": a comic-style speech bubble appears above it
with a short, humorous fact about LLMs/AI, the duck reacts to the fact, then
the next fact comes. It makes the site feel alive and on-brand, and
quietly shows the digest's topic area.

## Goals

- Duck is 200×200 px, placed in the right-hand empty area of every page
  (the area right of the 740 px minima content column — see the owner's
  screenshot: roughly level with the banner, top-right of the page).
- Animation made with a **video generation model** (owner's choice), from the
  mascot reference image, delivered as looping WebM clips.
- Clips: one idle loop + reaction clips (owner-approved set, proposal:
  `surprised`, `laughing`, `nodding`, `thinking`). Each fact carries one
  reaction tag; when the fact appears, the matching reaction plays once, then
  the duck returns to idle.
- Speech bubble: comic-book style, above the duck, shows the fact text plus a
  small "source" link under it (owner, 2026-11-12).
- 30 facts about LLMs/AI, **humorous tone** (owner, 2026-11-12), pre-written,
  stored in a Jekyll data file (`_data/duck_facts.yml`: `text`, `source_url`,
  `source_title`, `source_date`, `reaction`).
- Cycle: bubble appears → reaction plays → fact holds long enough to read
  (scaled by length, ~8–12 s) → bubble fades → short pause → next fact.
  Order randomized per page load; loops forever.

## Non-goals

- No clicks, drag, dismiss, hover behaviour, or chat (owner: "not
  interactive"). The source link is the only clickable element.
- No sound.
- No live/AI-generated facts at runtime; facts are static, pre-researched.

## Anti-goals (would count as failure even if it works)

- A fact without a real, working source, or a fabricated/unverified claim
  (AGENTS.md §6). Humour lives in the phrasing, never in bending the fact.
- AI-related sources older than 6 months (prefer ≤3) — AGENTS.md §6 recency.
- The duck looking off-model vs [Mascot.md](../Mascot.md) (legs/arms, no AR
  glasses, different style), or visible trademarks/logos in clips.
- Visible seams: background box that doesn't match the page, a jump at the
  loop point, or a jump when switching idle ↔ reaction.
- Overlapping or squeezing the content column, or horizontal scrolling.
- Slowing any page noticeably (heavy video eagerly loaded).

## Constraints

- Site: Jekyll, `minima` theme, GitHub Pages via Actions. Home page is
  [index.md](../index.md) with layout [_layouts/home.html](../_layouts/home.html).
  The widget must reach every page, so it hooks into the site-wide layout
  (the theme's `default` layout, overridden locally, or a site-wide include) —
  exact mechanism is the builder's call. Heavy clips must not slow every page
  load: lazy-load them.
- Video model: not configured in `.env` today (only image models). The
  OpenRouter catalog lists video output only for `google/gemini-omni-1.x-flash`;
  a Grok video model is not in the catalog, but catalog absence is not proof
  of non-existence — verify by a direct API call before ruling it out.
  Any new model goes into `.env` as a named variable.
- Clips must start from the mascot reference image
  ([assets/images/mascot/duck-reference.png](../assets/images/mascot/duck-reference.png))
  and the prompt must forbid logos/trademarks.
- English only in all committed files (facts, alt text, code comments).
- Work on a feature branch; owner reviews before merge.

## Decided by the owner

- Video-model animation → looping WebM (2026-11-12).
- Humorous fact tone (2026-11-12).
- Small "source" link in the bubble (2026-11-12).
- On **every page** of the site — home, posts, topic pages, news, About
  (2026-11-12, replaces the earlier "home page only").
- 30 pre-generated facts about LLMs etc.
- Reaction set (gate 1, 2026-11-12): `surprised`, `laughing`, `nodding`,
  `thinking`, `facepalm` (with a wing), `shrugging` (wing nubs) + `idle` loop.
- If the video model can't deliver usable clips (off-model duck, loop seam,
  drifting background): stop, show the failed clips, and ask the owner — no
  automatic fallback (2026-11-12).
- The 6-month recency rule applies for as long as a fact is shown
  (2026-11-12): each fact has a `source_date`; the build drops facts whose
  source is older than 6 months; fresh facts are added quarterly to keep the
  pool topped up. If fewer than 30 sourced facts exist within 6 months, ship
  what exists and say so — don't reach for older sources.

## Builder's calls (marked as such)

- Background: generate clips on a plain white background matching the page
  (`#fdfdfd` minima body) so no alpha/keying is needed — *builder's call*;
  fall back to chroma-key → VP9-alpha WebM if the model can't hold a clean
  background.
- Responsive: show the widget only when the viewport is wide enough to fit it
  beside the content column without overlap (≈ ≥1240 px); hidden otherwise —
  *builder's call*.
- Position: absolutely positioned in the right gutter, scrolls with the page
  (not sticky) — *builder's call*.
- `prefers-reduced-motion`: show a still frame and rotate facts without
  animation — *builder's call*.
- Clip length/resolution, file sizes, lazy-loading strategy, JS structure.
- Facts are gathered by the `researcher` agent and phrased by `editor`,
  checked by `critic`, then the owner approves the list before build.
- Clip candidates: one generation per available video model, presented to
  the owner in a table to pick (mirrors the AGENTS.md §8 image rule).
- Hologram panel: kept in every clip so the duck stays on-model — "?" in idle
  and `thinking`, "!" in `surprised`, check mark in `nodding`, "?" or blank
  glow in `laughing`, "!" in `facepalm`, "?" in `shrugging` — *builder's call*; the owner sees it when picking clips.
- Second duck: the home banner already shows the duck; the owner placed the
  widget beside it knowingly (screenshot), so two ducks are intended.
- Owner gates, in order, each a hard stop before the step that depends on
  it: (1) reaction set, (2) fact list, (3) clip pick, (4) final page review.
  Fact research and the video-model test may run in parallel —
  *builder's call*.
