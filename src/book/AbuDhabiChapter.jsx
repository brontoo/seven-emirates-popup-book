import {
  FoldableMosque,
  FoldableTowers,
  FoldableMangroves,
  FoldableDubai,
} from "../landmarks/FoldableLandmark";
export const foldingModels = {
  mosque: FoldableMosque,
  towers: FoldableTowers,
  mangroves: FoldableMangroves,
  burj: FoldableDubai,
};
export default function ChapterLandmarks({
  entries,
  progress,
  enabled,
  onSelect,
}) {
  return entries.map((entry) => {
    const Model = foldingModels[entry.model];
    return Model ? (
      <group key={entry.model} position={entry.position}>
        <Model progress={progress} enabled={enabled} onSelect={onSelect} />
      </group>
    ) : null;
  });
}
