import { clamp01 } from "../mechanisms/kinematics.js";

// A single sheet turns over the binding. Its old front and new back carry the
// corresponding chapter halves. Only a fully folded chapter changes at 50%.
export function pageTurnPose(turn, chapter = 0) {
  if (!turn?.active)
    return {
      chapter,
      unfold: 1,
      leafAngle: 0,
      leftAngle: 0,
      rightAngle: 0,
      movingSide: null,
    };
  const t = clamp01(turn.progress),
    forward = turn.to > turn.from,
    outgoing = t < 0.5;
  const leafAngle = Math.PI * (forward ? t : 1 - t);
  const movingSide = outgoing
    ? forward
      ? "right"
      : "left"
    : forward
      ? "left"
      : "right";
  return {
    chapter: outgoing ? turn.from : turn.to,
    unfold: outgoing ? 1 - 2 * t : 2 * t - 1,
    leafAngle,
    leftAngle: movingSide === "left" ? leafAngle - Math.PI : 0,
    rightAngle: movingSide === "right" ? leafAngle : 0,
    movingSide,
  };
}

export function adjacentAvailableChapter(current, chapters) {
  const available = chapters.flatMap((c, i) => (c.available ? [i] : []));
  return (
    available.find((i) => i > current) ??
    available.filter((i) => i < current).at(-1) ??
    current
  );
}
