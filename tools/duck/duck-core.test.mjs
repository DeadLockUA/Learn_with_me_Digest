import test from "node:test";
import assert from "node:assert/strict";
import { shuffle, createCycler, createSkippableWait, HOLD_MS } from "../../assets/duck/duck-core.js";

const f = (text) => ({ text });

function seeded(seed) {
  return () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
}

test("shuffle is deterministic with seeded rng, a permutation, non-mutating", () => {
  const input = [1, 2, 3, 4, 5, 6];
  const a = shuffle(input, seeded(7));
  const b = shuffle(input, seeded(7));
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(input, [1, 2, 3, 4, 5, 6]);
});

test("HOLD_MS is one minute", () => {
  assert.equal(HOLD_MS, 60000);
});

const never = () => new Promise(() => {});
const after = (ms) => new Promise((r) => setTimeout(r, ms));

test("skippable wait resolves on skip before the timer", async () => {
  const w = createSkippableWait(never);
  let done = false;
  const p = w.wait(60000).then(() => (done = true));
  await after(5);
  assert.equal(done, false);
  w.skip();
  await p;
  assert.equal(done, true);
});

test("skippable wait resolves on its timer", async () => {
  const w = createSkippableWait((ms) => after(ms));
  await w.wait(5);
});

test("skip with nothing pending is a no-op and does not skip the next wait", async () => {
  const w = createSkippableWait((ms) => after(ms));
  w.skip();
  let done = false;
  w.wait(40).then(() => (done = true));
  await after(10);
  assert.equal(done, false);
});

test("createCycler on empty returns null", () => {
  assert.equal(createCycler([]).next(), null);
});

test("createCycler with one fact always returns it", () => {
  const c = createCycler([f("only")]);
  for (let i = 0; i < 5; i++) assert.equal(c.next().text, "only");
});

test("createCycler never repeats back-to-back and is fair", () => {
  const facts = [f("a"), f("b"), f("c")];
  for (let seed = 1; seed < 50; seed++) {
    const c = createCycler(facts, seeded(seed));
    const counts = { a: 0, b: 0, c: 0 };
    let last = null;
    for (let i = 0; i < 30; i++) {
      const x = c.next().text;
      assert.notEqual(x, last);
      counts[x]++;
      last = x;
    }
    assert.deepEqual(counts, { a: 10, b: 10, c: 10 });
  }
});
