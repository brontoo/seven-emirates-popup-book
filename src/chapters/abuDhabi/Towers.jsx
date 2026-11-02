import { AccordionBlade } from "../shared/AccordionBlade";
import { Assembly, Standing, Tab, Selectable } from "./Primitives";

export const towerSpecs = [
  {
    id: "etihad-1",
    page: "left",
    x: -0.62,
    z: -2.1,
    h: 3.1,
    w: 0.46,
    d: 0.16,
    lean: -0.13,
    color: "#aac0cc",
  },
  {
    id: "etihad-2",
    page: "right",
    x: 0.47,
    z: -2.16,
    h: 3.58,
    w: 0.51,
    d: 0.17,
    lean: -0.12,
    color: "#9fb7c6",
  },
  {
    id: "etihad-3",
    page: "left",
    x: -1.03,
    z: -1.82,
    h: 2.32,
    w: 0.42,
    d: 0.18,
    lean: 0.07,
    color: "#96afc0",
  },
  {
    id: "etihad-4",
    page: "right",
    x: 0.96,
    z: -1.94,
    h: 2.74,
    w: 0.37,
    d: 0.13,
    lean: 0.04,
    color: "#b3c6d0",
  },
  {
    id: "etihad-5",
    page: "right",
    x: 1.36,
    z: -1.86,
    h: 2.43,
    w: 0.36,
    d: 0.14,
    lean: -0.08,
    color: "#9eb4c3",
  },
];
export default function Towers({ page, progress, enabled, onSelect }) {
  const extras = [
    {
      id: "frame-study",
      page: "right",
      x: 2.13,
      z: -1.65,
      h: 2.48,
      w: 0.42,
      d: 0.18,
      lean: 0.02,
      color: "#bebfc4",
      frame: true,
    },
    {
      id: "side-building",
      page: "right",
      x: 2.85,
      z: -1.58,
      h: 1.46,
      w: 0.49,
      d: 0.2,
      lean: -0.06,
      color: "#c6c9ca",
    },
  ];
  return (
    <Selectable id="towers" enabled={enabled} onSelect={onSelect}>
      {[...towerSpecs, ...extras]
        .filter((s) => s.page === page)
        .map((spec) => (
          <Assembly
            key={spec.id}
            id={spec.id}
            page={page}
            position={[spec.x, 0.038, spec.z]}
            nearest={Math.max(
              0.02,
              Math.abs(spec.x) - spec.w / 2 - spec.d - Math.abs(spec.lean),
            )}
            height={spec.h + spec.d + 0.08}
            progress={progress}
          >
            {({ beta }) => (
              <>
                <Tab width={spec.w} depth={0.13} />
                <Standing beta={beta}>
                  <AccordionBlade spec={spec} beta={beta} frame={spec.frame} />
                </Standing>
              </>
            )}
          </Assembly>
        ))}
    </Selectable>
  );
}
