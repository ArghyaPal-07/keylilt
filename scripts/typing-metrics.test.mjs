import test from "node:test";
import assert from "node:assert/strict";
import { calculateMetrics } from "../src/utils/typingMetrics.js";
test("net WPM uses five characters per word and elapsed minutes", () => {
  assert.deepEqual(calculateMetrics(150, 0, 30), { wpm: 60, accuracy: "100.00" });
  assert.deepEqual(calculateMetrics(150, 15, 30), { wpm: 54, accuracy: "90.00" });
  assert.deepEqual(calculateMetrics(50, 0, 10), { wpm: 60, accuracy: "100.00" });
});
test("empty and zero-time sessions produce finite values", () => {
  assert.deepEqual(calculateMetrics(0, 0, 0), { wpm: 0, accuracy: "0.00" });
  assert.equal(calculateMetrics(1, 0, 0).wpm, 0);
});
test("original cumulative error semantics remain after backspace", () => {
  assert.deepEqual(calculateMetrics(10, 2, 30), { wpm: 3, accuracy: "80.00" });
  assert.deepEqual(calculateMetrics(2, 4, 30), { wpm: 0, accuracy: "0.00" });
});
