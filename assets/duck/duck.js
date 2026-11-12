// Duck facts widget: a non-interactive mascot that "says" sourced facts in a speech bubble.
import { activeFacts, createCycler, holdMs } from "./duck-core.js";

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

function setClip(video, name) {
  video.replaceChildren();
  el("source", { src: new URL(`clips/${name}.webm`, BASE).href, type: "video/webm" }, video);
  el("source", { src: new URL(`clips/${name}.mp4`, BASE).href, type: "video/mp4" }, video);
  video.load();
}

function makeVideo(stage) {
  const v = el("video", { muted: "", playsinline: "", preload: "none", "aria-hidden": "true" }, stage);
  v.muted = true;
  return v;
}

function build() {
  const root = el("aside", { class: "duck-widget", "aria-label": "Duck mascot fact" });
  const bubble = el("div", { class: "duck-bubble", role: "status" }, root);
  const text = el("p", {}, bubble);
  const source = el("a", { class: "duck-source", target: "_blank", rel: "noopener" }, bubble);
  source.textContent = "source";
  const stage = el("div", { class: "duck-stage" }, root);
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
  idle.addEventListener("error", fail, true);
  setClip(idle, "idle");
  idle.addEventListener("playing", () => idle.classList.add("is-on"), { once: true });
  idle.play().catch(fail);

  return function react(name) {
    if (broken || !name) return;
    reaction.addEventListener("error", () => reaction.classList.remove("is-on"), { once: true, capture: true });
    setClip(reaction, name);
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
    facts = activeFacts(await res.json(), new Date());
  } catch {
    return;
  }
  const cycler = createCycler(facts);
  for (;;) {
    const fact = cycler.next();
    if (!fact) return;
    ui.text.textContent = fact.text;
    ui.source.href = fact.source_url;
    ui.source.title = fact.source_title || "";
    ui.bubble.classList.add("is-on");
    react(fact.reaction);
    await visibleWait(holdMs(fact.text));
    ui.bubble.classList.remove("is-on");
    await visibleWait(PAUSE_MS);
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
