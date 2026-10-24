// Original net-character formula; backspace does not erase recorded mistakes.
export function calculateMetrics(charIndex, mistakes, elapsedSeconds) {
  const correctChars = Math.max(0, charIndex - mistakes);
  return {
    wpm: elapsedSeconds > 0 ? Math.round(correctChars / 5 / elapsedSeconds * 60) : 0,
    accuracy: charIndex > 0 ? (correctChars / charIndex * 100).toFixed(2) : "0.00",
  };
}
