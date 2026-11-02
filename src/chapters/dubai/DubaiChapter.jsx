import Museum from "./Museum";
import { BurjKhalifa, EmiratesTowers, DubaiSkyline } from "./Architecture";
import Metro from "./Metro";
import Landscape from "../shared/Landscape";
import { Prototype } from "../shared/Primitives";
import { stageIncludes } from "../shared/mechanics";
export default function DubaiChapter({
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
      <Museum {...shared} />
      {stageIncludes(stage, "c") && (
        <>
          <BurjKhalifa {...shared} />
          <EmiratesTowers {...shared} />
          <DubaiSkyline {...shared} />
        </>
      )}
      {stageIncludes(stage, "d") && (
        <>
          <Landscape {...shared} enabled={false} />
          <Metro {...shared} />
        </>
      )}
    </>
  );
}
