import Mosque from "../chapters/abuDhabi/Mosque";
import Towers from "../chapters/abuDhabi/Towers";
import Landscape, { Skyline } from "../chapters/abuDhabi/Landscape";
import { Prototype } from "../chapters/abuDhabi/Primitives";
import { stageIncludes } from "../chapters/abuDhabi/mechanics";

// The chapter contract is reusable; only Abu Dhabi is implemented in this build.
export default function AbuDhabiChapter({
  page,
  progress,
  enabled,
  onSelect,
  lowPower,
  stage = "e",
}) {
  const shared = { page, progress, enabled, onSelect, lowPower };
  if (stage === "a") return <Prototype {...shared} />;
  return (
    <>
      <Mosque {...shared} />
      {stageIncludes(stage, "c") && (
        <>
          <Skyline {...shared} />
          <Towers {...shared} />
        </>
      )}
      {stageIncludes(stage, "d") && <Landscape {...shared} />}
    </>
  );
}
