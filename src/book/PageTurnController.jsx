import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { chapters } from "../data/chapters";
import { adjacentAvailableChapter } from "./pageTurn";
// Keep explicit page transitions bounded in real time on low-frame-rate devices.
gsap.ticker.lagSmoothing(0);
import { clamp01 } from "../mechanisms/kinematics";

export function usePageTurnController({
  chapter,
  onChapter,
  reduced,
  onStart,
}) {
  const [turn, setTurn] = useState({
    active: false,
    from: chapter,
    to: chapter,
    progress: 0,
  });
  const animation = useRef(null),
    latest = useRef();
  latest.current = { chapter, onChapter, onStart, turn };
  useEffect(() => () => animation.current?.kill(), []);
  const cancel = useCallback(() => {
    animation.current?.kill();
    const c = latest.current.chapter;
    setTurn({ active: false, from: c, to: c, progress: 0 });
  }, []);
  const request = useCallback(
    (target) => {
      const state = latest.current;
      if (state.turn.active || target === state.chapter) return;
      animation.current?.kill();
      state.onStart();
      const source = state.chapter,
        clock = { progress: 0 };
      setTurn({ active: true, from: source, to: target, progress: 0 });
      animation.current = gsap.to(clock, {
        progress: 1,
        duration: reduced ? 0.18 : 3,
        ease: "power2.inOut",
        onUpdate: () =>
          setTurn({
            active: true,
            from: source,
            to: target,
            progress: clock.progress,
          }),
        onComplete: () => {
          latest.current.onChapter(target);
          setTurn({ active: false, from: source, to: target, progress: 1 });
        },
      });
    },
    [reduced],
  );
  const scrub = useCallback((value) => {
    animation.current?.kill();
    const state = latest.current;
    state.onStart();
    const t = clamp01(value);
    const from =
        state.turn.from !== state.turn.to ? state.turn.from : state.chapter,
      to =
        state.turn.from !== state.turn.to
          ? state.turn.to
          : adjacentAvailableChapter(state.chapter, chapters);
    if (t === 0 || t === 1) state.onChapter(t === 1 ? to : from);
    setTurn({ active: t > 0 && t < 1, from, to, progress: t });
  }, []);
  const choose = useCallback((value) => {
    animation.current?.kill();
    latest.current.onStart();
    latest.current.onChapter(value);
    setTurn({ active: false, from: value, to: value, progress: 0 });
  }, []);
  return { turn, request, cancel, scrub, choose };
}
