import { useCallback, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { clamp01 } from "../mechanisms/kinematics";

/** Raycast starts the gesture. Pointer capture + a window fallback retain it. */
export function useBookController({ progress, onProgress, onDragging }) {
  const { gl, size } = useThree();
  const drag = useRef(null);
  const latest = useRef({
    progress,
    onProgress,
    onDragging,
    width: size.width,
  });
  latest.current = { progress, onProgress, onDragging, width: size.width };
  const move = useCallback((event) => {
    const d = drag.current;
    if (!d || event.pointerId !== d.id) return;
    const value = clamp01(d.progress + (d.x - event.clientX) / d.travel);
    latest.current.onProgress(value);
  }, []);
  const end = useCallback(
    (event) => {
      if (!drag.current || event.pointerId !== drag.current.id) return;
      const id = drag.current.id;
      drag.current = null;
      latest.current.onDragging(false);
      if (gl.domElement.hasPointerCapture(id))
        gl.domElement.releasePointerCapture(id);
      gl.domElement.style.cursor = "grab";
    },
    [gl],
  );
  useEffect(() => {
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    gl.domElement.addEventListener("lostpointercapture", end);
    const blur = () => {
      if (drag.current) end({ pointerId: drag.current.id });
    };
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      gl.domElement.removeEventListener("lostpointercapture", end);
      window.removeEventListener("blur", blur);
      if (drag.current) latest.current.onDragging(false);
    };
  }, [move, end, gl]);
  return {
    onPointerDown: (event) => {
      if (event.button !== 0 || drag.current) return;
      event.stopPropagation();
      drag.current = {
        id: event.pointerId,
        x: event.clientX,
        progress: latest.current.progress,
        travel: Math.max(200, latest.current.width * 0.48),
      };
      event.target.setPointerCapture(event.pointerId);
      latest.current.onDragging(true);
      gl.domElement.style.cursor = "grabbing";
    },
    onPointerMove: (event) => {
      if (drag.current) {
        event.stopPropagation();
        move(event);
      }
    },
    onPointerUp: (event) => {
      if (drag.current) {
        event.stopPropagation();
        end(event);
      }
    },
    onPointerCancel: end,
    onPointerOver: () => {
      if (!drag.current) gl.domElement.style.cursor = "grab";
    },
    onPointerOut: () => {
      if (!drag.current) gl.domElement.style.cursor = "auto";
    },
  };
}
