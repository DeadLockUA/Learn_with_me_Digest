import test from "node:test";
import assert from "node:assert/strict";
import { shuffle, holdMs, createCycler } from "../../assets/duck/duck-core.js";

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

test("holdMs bounds and monotonic", () => {
  assert.equal(holdMs(""), 8000);
  assert.equal(holdMs("x".repeat(160)), 12000);
  assert.equal(holdMs("x".repeat(500)), 12000);
  let prev = 0;
  for (let n = 0; n <= 160; n += 10) {
    const v = holdMs("x".repeat(n));
    assert.ok(v >= prev && v >= 8000 && v <= 12000);
    prev = v;
  }
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
