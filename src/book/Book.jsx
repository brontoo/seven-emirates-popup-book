import { chapters } from "../data/chapters";
import BookCover from "./BookCover";
import BookPages from "./BookPages";
import BookSpine from "./BookSpine";
import ChapterLandmarks from "./AbuDhabiChapter";
import { useBookController } from "./BookController";
import { coverAngle, leafOffset } from "../mechanisms/kinematics";
import { VFold } from "../mechanisms/PopUpMechanism";
import { Block } from "../landmarks/Paper";

export default function Book({
  progress,
  chapter,
  dragging,
  onDragging,
  onProgress,
  onSelect,
}) {
  const handlers = useBookController({ progress, onProgress, onDragging });
  const active = chapters[chapter];
  const entries = active.scene || [];
  const enabled = progress > 0.94 && !dragging;
  const left = entries.filter((e) => e.side === "left"),
    right = entries.filter((e) => e.side !== "left");
  return (
    <group position={[-2.18 * (1 - progress), 0.04, 0]} name="mechanical-book">
      <BookSpine progress={progress} />
      <group
        position={leafOffset(progress)}
        rotation={[0, 0, coverAngle(progress)]}
        name="moving-leaf"
      >
        <BookCover front handlers={handlers} />
        <group {...handlers}>
          <BookPages
            side={-1}
            label="THE SEVEN EMIRATES  /  A SUSTAINABILITY ADVENTURE"
            progress={progress}
          />
        </group>
        <ChapterLandmarks
          entries={left}
          progress={progress}
          enabled={enabled}
          onSelect={onSelect}
        />
        {/* A visible fore-edge grip remains raycastable from the inside at full opening. */}
        <group {...handlers}>
          <Block
            position={[-4.32, -0.02, 0.3]}
            size={[0.065, 0.085, 1.3]}
            color="#b5a17a"
          />
        </group>
      </group>
      <group rotation={[0, Math.PI, 0]}>
        <BookCover />
      </group>
      <BookPages
        side={1}
        label={`${active.index}    —    ${active.title.toUpperCase()}`}
        progress={progress}
      />
      <ChapterLandmarks
        entries={right}
        progress={progress}
        enabled={enabled}
        onSelect={onSelect}
      />
      <VFold
        progress={progress}
        position={[0, 0.018, -1.5]}
        base={1.13}
        ridge={1.05}
      />
      <VFold
        progress={progress}
        position={[0, 0.021, 0.7]}
        base={0.75}
        ridge={0.67}
      />
      <Block
        position={[0.12, -0.12, 2.93]}
        size={[0.11, 0.012, 0.5]}
        color="#b39b69"
      />
    </group>
  );
}
