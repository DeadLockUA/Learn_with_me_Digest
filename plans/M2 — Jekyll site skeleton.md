# M2 — Jekyll site skeleton

Goal: scaffold the Jekyll site so it builds and serves the `_posts/`
structure decided in M1, with a theme minimal enough not to block content
work. HLD.md already decides Jekyll as the generator — this milestone picks
the remaining unresolved details (hosting mode, theme) and implements them.

## Tasks

1. **Draft options** for the two undecided pieces:
   - GitHub Pages hosting mode — project site (`username.github.io/repo`,
     zero DNS setup) vs. user/org site or custom domain.
   - Theme — a stock supported theme (e.g. `minima`) vs. a from-scratch
     minimal layout. Bias toward "boring and unblocking," per HLD's own
     framing.
2. **Check constraints** that affect M1's file layout:
   - `_posts/YYYY-MM-DD-topic-slug.md` naming already matches Jekyll's
     required post filename format — confirm no clash.
   - Confirm `entries/linkedin/` and `assets/images/entries/` (non-post
     content) don't get swept into the Jekyll build or published output
     unintentionally.
   - GitHub Pages' supported-gems allowlist if using `github-pages` gem vs.
     a plain `jekyll` gem installed via Actions (latter needed either way
     for M3's custom Actions deploy, per HLD "Decided").
3. **Present options to owner** with a recommendation (benefits/drawbacks) —
   get an explicit decision on hosting mode + theme.
4. **Write the decision back** into HLD.md (`Decided` section) — hosting
   mode and theme are currently unstated there.
5. **Scaffold the site**: `_config.yml`, minimal `Gemfile`, chosen theme,
   a root `index.md`/layout listing posts, `.gitignore` entries for Jekyll
   build output (`_site/`, `.jekyll-cache/`).
6. **Verify local build** — `bundle exec jekyll build` (or serve) succeeds
   against the current scaffolded folders from M1, including the
   `.gitkeep`-only empty state (no posts yet).

## Gate

Do not start M3 (GitHub Actions deploy workflow) until hosting mode + theme
are written into HLD.md and the site builds locally.

**Deviation (owner, 2026-09-14):** no local Ruby available on the dev
machine; owner chose to defer build verification to M3's GitHub Actions run
instead of installing Ruby/Docker locally. First Actions run is the actual
build gate.
