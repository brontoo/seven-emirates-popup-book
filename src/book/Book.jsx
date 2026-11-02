import { chapters } from "../data/chapters";
import BookCover from "./BookCover";
import BookPages from "./BookPages";
import BookSpine from "./BookSpine";
import ChapterLandmarks from "./ChapterSpread";
import TurningPage from "./TurningPage";
import { pageTurnPose } from "./pageTurn";
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
  lowPower,
  debug = { stage: "e" },
  turn = { active: false, progress: 0 },
}) {
  const handlers = useBookController({
    progress,
    onProgress,
    onDragging,
    enabled: !turn.active,
  });
  const pose = pageTurnPose(turn, chapter);
  const active = chapters[pose.chapter];
  const unfold = progress * pose.unfold;
  const enabled = progress > 0.94 && !dragging && !turn.active;
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
        <group
          rotation={[0, 0, pose.leftAngle]}
          position={[0, pose.movingSide === "left" ? 0.004 : 0, 0]}
        >
          <ChapterLandmarks
            chapter={pose.chapter}
            page="left"
            lowPower={lowPower}
            stage={debug.stage}
            progress={unfold}
            enabled={enabled}
            onSelect={onSelect}
          />
        </group>
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
      <group
        rotation={[0, 0, pose.rightAngle]}
        position={[0, pose.movingSide === "right" ? 0.004 : 0, 0]}
      >
        <ChapterLandmarks
          chapter={pose.chapter}
          page="right"
          lowPower={lowPower}
          stage={debug.stage}
          progress={unfold}
          enabled={enabled}
          onSelect={onSelect}
        />
      </group>
      <TurningPage turn={turn} angle={pose.leafAngle} />
      <VFold
        progress={unfold}
        position={[0, 0.018, -2.25]}
        base={0.26}
        ridge={0.3}
      />
      <VFold
        progress={unfold}
        position={[0, 0.021, 1.65]}
        base={0.25}
        ridge={0.2}
      />
      <Block
        position={[0.12, -0.12, 2.93]}
        size={[0.11, 0.012, 0.5]}
        color="#b39b69"
      />
    </group>
  );
}
