// Duck facts widget: a mascot that "says" sourced facts in a speech bubble.
// A fact stays up for a minute; clicking the duck (or Enter/Space on it) shows the next one.
import { createCycler, createSkippableWait, HOLD_MS } from "./duck-core.js";

const BASE = new URL("./", import.meta.url);
const PAUSE_MS = 1500;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sleep that only counts time while the tab is visible, so a hidden tab pauses the cycle.
function visibleWait(ms) {
  return new Promise((resolve) => {
    let left = ms;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      if (!document.hidden) left -= now - last;
      last = now;
      if (left <= 0) resolve();
      else setTimeout(tick, Math.min(250, left));
    };
    setTimeout(tick, Math.min(250, ms));
  });
}

function el(tag, attrs = {}, parent) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

// Errors fire per <source>; only the last one failing means no source can play,
// so the WebM error must not abort before the MP4 fallback is tried.
function setClip(video, name, onNoSource) {
  video.replaceChildren();
  el("source", { src: new URL(`clips/${name}.webm`, BASE).href, type: "video/webm" }, video);
  const last = el("source", { src: new URL(`clips/${name}.mp4`, BASE).href, type: "video/mp4" }, video);
  last.addEventListener("error", onNoSource, { once: true });
  video.load();
}

function makeVideo(stage) {
  const v = el("video", { muted: "", playsinline: "", preload: "none", "aria-hidden": "true" }, stage);
  v.muted = true;
  return v;
}

function build() {
  const root = el("aside", { class: "duck-widget", "aria-label": "Duck mascot fact" });
  const bubble = el("div", { class: "duck-bubble", "aria-live": "off" }, root);
  const text = el("p", {}, bubble);
  const source = el("a", { class: "duck-source", target: "_blank", rel: "noopener" }, bubble);
  source.textContent = "source";
  const stage = el("div", { class: "duck-stage", role: "button", tabindex: "0", "aria-label": "Show the next duck fact" }, root);
  el("img", { src: new URL("poster.png", BASE).href, alt: "Rubber duck mascot with AR glasses", width: "200", height: "200" }, stage);
  document.body.appendChild(root);
  return { bubble, text, source, stage };
}

function setupVideos(stage) {
  const idle = makeVideo(stage);
  const reaction = makeVideo(stage);
  idle.loop = true;
  let broken = false;
  const fail = () => {
    broken = true;
    idle.remove();
    reaction.remove();
  };
  setClip(idle, "idle", fail);
  idle.addEventListener("playing", () => idle.classList.add("is-on"), { once: true });
  idle.play().catch(fail);

  return function react(name) {
    if (broken || !name) return;
    setClip(reaction, name, () => {
      reaction.classList.remove("is-on");
      idle.classList.add("is-on");
    });
    reaction.addEventListener(
      "playing",
      () => {
        reaction.classList.add("is-on");
        idle.classList.remove("is-on");
      },
      { once: true }
    );
    reaction.addEventListener(
      "ended",
      () => {
        idle.classList.add("is-on");
        reaction.classList.remove("is-on");
      },
      { once: true }
    );
    reaction.play().catch(() => {});
  };
}

async function run() {
  const ui = build();
  const react = reducedMotion ? () => {} : setupVideos(ui.stage);
  let facts;
  try {
    const res = await fetch(new URL("facts.json", BASE));
    if (!res.ok) return;
    const data = await res.json();
    facts = Array.isArray(data) ? data.filter((f) => f && f.text) : [];
  } catch {
    return;
  }
  const cycler = createCycler(facts);
  const waiter = createSkippableWait(visibleWait);
  ui.stage.addEventListener("click", () => waiter.skip());
  ui.stage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      waiter.skip();
    }
  });
  for (;;) {
    const fact = cycler.next();
    if (!fact) return;
    ui.text.textContent = fact.text;
    ui.source.href = fact.source_url;
    ui.source.title = fact.source_title || "";
    ui.bubble.classList.add("is-on");
    react(fact.reaction);
    await waiter.wait(HOLD_MS);
    ui.bubble.classList.remove("is-on");
    await waiter.wait(PAUSE_MS);
  }
}

function start() {
  if (!window.matchMedia("(min-width: 1300px)").matches) {
    // Widget is hidden at this width; start only once the viewport grows wide enough.
    const mq = window.matchMedia("(min-width: 1300px)");
    const onChange = (e) => {
      if (e.matches) {
        mq.removeEventListener("change", onChange);
        run();
      }
    };
    mq.addEventListener("change", onChange);
    return;
  }
  run();
}

const later = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
if (document.readyState === "complete") later(start);
else window.addEventListener("load", () => later(start), { once: true });
