// Pure logic for the duck facts widget (no DOM). Tested by tools/duck/duck-core.test.mjs.

export function shuffle(items, rng = Math.random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function holdMs(text) {
  return Math.min(12000, Math.max(8000, 8000 + 25 * String(text || "").length));
}

export function createCycler(facts, rng = Math.random) {
  let order = [];
  let last = null;
  return {
    next() {
      if (!facts.length) return null;
      if (!order.length) {
        order = shuffle(facts, rng);
        if (order.length > 1 && order[0] === last) order.push(order.shift());
      }
      last = order.shift();
      return last;
    },
  };
}
