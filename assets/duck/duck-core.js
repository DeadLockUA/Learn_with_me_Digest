// Pure logic for the duck facts widget (no DOM). Tested by tools/duck/duck-core.test.mjs.

export function shuffle(items, rng = Math.random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// How long each fact stays up before the next one (owner, 2026-11-12).
export const HOLD_MS = 60000;

// A wait that the viewer can cut short (click on the duck). `waitFn(ms)` returns a promise.
export function createSkippableWait(waitFn) {
  let pending = null;
  return {
    wait(ms) {
      return new Promise((resolve) => {
        const done = () => {
          if (pending === done) pending = null;
          resolve();
        };
        pending = done;
        waitFn(ms).then(done);
      });
    },
    skip() {
      if (pending) pending();
    },
  };
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
