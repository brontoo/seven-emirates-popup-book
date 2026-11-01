import { useMemo } from "react";
import * as THREE from "three";
import { Paper } from "../landmarks/Paper";

export const stickerDesigns = [
  {
    id: "flag",
    x: -3.62,
    z: -1.94,
    w: 0.89,
    h: 0.52,
    rotation: -0.12,
    color: "#f0ead8",
  },
  {
    id: "earth",
    x: -1.0,
    z: -1.94,
    w: 0.66,
    h: 0.66,
    rotation: 0.15,
    color: "#e2e4cb",
  },
  {
    id: "burj",
    x: -0.66,
    z: -0.12,
    w: 0.82,
    h: 1.28,
    rotation: -0.09,
    color: "#e6dbc1",
  },
  {
    id: "mosque",
    x: -3.78,
    z: 0.02,
    w: 1.04,
    h: 0.89,
    rotation: 0.11,
    color: "#eee7d4",
  },
  {
    id: "mountain",
    x: -1.16,
    z: 1.31,
    w: 1.12,
    h: 0.75,
    rotation: -0.13,
    color: "#d8dfca",
  },
  {
    id: "mangrove",
    x: -3.48,
    z: 1.43,
    w: 0.9,
    h: 0.93,
    rotation: -0.12,
    color: "#e6e8d1",
  },
  {
    id: "stamp",
    x: -2.22,
    z: 2.15,
    w: 1.28,
    h: 0.49,
    rotation: 0.05,
    color: "#e9d8b8",
  },
];
function stickerTexture(id) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const c = canvas.getContext("2d");
  c.translate(192, 192);
  c.strokeStyle = "#496759";
  c.fillStyle = "#496759";
  c.lineWidth = 5;
  c.lineJoin = "round";
  c.lineCap = "round";
  const path = (points) => {
    c.beginPath();
    points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
  };
  const text = (str, y, size = 26) => {
    c.font = `${size}px Georgia`;
    c.textAlign = "center";
    c.fillStyle = "#496759";
    c.fillText(str, 0, y);
  };
  if (id === "flag") {
    c.fillStyle = "#e4e2ce";
    c.fillRect(-145, -95, 290, 190);
    c.fillStyle = "#5d836c";
    c.fillRect(-145, -95, 290, 63);
    c.fillStyle = "#303d34";
    c.fillRect(-145, 32, 290, 63);
    c.fillStyle = "#a95f4b";
    c.fillRect(-145, -95, 77, 190);
  }
  if (id === "burj") {
    c.fillStyle = "#54716a";
    c.beginPath();
    [
      [-65, 95],
      [-65, 30],
      [-40, 30],
      [-40, -25],
      [-19, -25],
      [-19, -85],
      [-7, -85],
      [0, -145],
      [7, -85],
      [16, -85],
      [16, -23],
      [38, -23],
      [38, 32],
      [61, 32],
      [61, 95],
    ].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fill();
    text("DUBAI", 137, 29);
    c.strokeRect(-132, -163, 264, 322);
  }
  if (id === "mosque") {
    path([
      [-145, 70],
      [145, 70],
    ]);
    c.strokeRect(-92, -10, 184, 80);
    for (let i = -1; i <= 1; i++) {
      c.beginPath();
      c.moveTo(i * 66 - 27, -10);
      c.bezierCurveTo(i * 66 - 45, -46, i * 66 - 9, -61, i * 66, -92);
      c.bezierCurveTo(i * 66 + 9, -61, i * 66 + 45, -46, i * 66 + 27, -10);
      c.stroke();
    }
    for (const x of [-125, 125]) {
      path([
        [x, 70],
        [x, -63],
        [x - 9, -63],
        [x, -115],
        [x + 9, -63],
        [x, -63],
      ]);
    }
    for (const x of [-64, -32, 0, 32, 64]) {
      c.beginPath();
      c.arc(x, 57, 10, Math.PI, 0);
      c.stroke();
    }
    text("ABU DHABI", 125, 25);
  }
  if (id === "mountain") {
    c.fillStyle = "#87997b";
    c.beginPath();
    c.moveTo(-158, 77);
    c.lineTo(-63, -88);
    c.lineTo(-4, -5);
    c.lineTo(55, -120);
    c.lineTo(158, 77);
    c.closePath();
    c.fill();
    path([
      [-88, -44],
      [-63, -88],
      [-36, -48],
      [-15, -57],
    ]);
    c.strokeStyle = "#f4eedc";
    path([
      [20, -55],
      [55, -120],
      [88, -58],
      [57, -78],
      [42, -56],
    ]);
    text("RAS AL KHAIMAH", 130, 23);
  }
  if (id === "mangrove") {
    path([
      [0, 101],
      [0, -50],
      [-68, -80],
      [0, -16],
      [77, -66],
    ]);
    c.fillStyle = "#83966f";
    for (const [x, y, r] of [
      [-58, -67, 49],
      [8, -104, 63],
      [67, -56, 55],
      [-20, -25, 43],
    ]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = "#7fa299";
    path([
      [-132, 118],
      [-72, 108],
      [-12, 121],
      [58, 108],
      [128, 119],
    ]);
    text("MANGROVES", 158, 22);
  }
  if (id === "earth") {
    c.beginPath();
    c.arc(0, -10, 125, 0, Math.PI * 2);
    c.fillStyle = "#8dada2";
    c.fill();
    c.strokeStyle = "#f0ead4";
    c.stroke();
    c.fillStyle = "#d9deb3";
    c.beginPath();
    c.moveTo(-90, -69);
    c.lineTo(-29, -111);
    c.lineTo(30, -79);
    c.lineTo(14, -16);
    c.lineTo(-33, -5);
    c.lineTo(-12, 65);
    c.lineTo(-55, 97);
    c.lineTo(-87, 28);
    c.closePath();
    c.fill();
    c.beginPath();
    c.ellipse(72, 44, 26, 56, -0.4, 0, Math.PI * 2);
    c.fill();
    text("TREAD LIGHTLY", 151, 24);
  }
  if (id === "stamp") {
    c.strokeStyle = "#8d6b4b";
    c.lineWidth = 5;
    c.strokeRect(-165, -118, 330, 236);
    c.setLineDash([7, 7]);
    c.strokeRect(-151, -104, 302, 208);
    c.setLineDash([]);
    text("EXPLORE UAE", 17, 43);
    text("SEVEN EMIRATES · ONE HOME", 66, 15);
    text("✧  1971  ✧", -48, 24);
  }
  // Fine print grain is deterministic, embedded, and matte.
  for (let i = 0; i < 1000; i++) {
    c.fillStyle = `rgba(78,72,52,${(i % 5) * 0.013})`;
    c.fillRect(((i * 79) % 380) - 190, ((i * 113) % 380) - 190, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
function Sticker({ design }) {
  const { id, x, z, w, h, rotation, color } = design;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const rectangular = id === "flag" || id === "stamp";
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2,
        irregular = 1 + 0.014 * Math.sin(i * 2.7);
      let px, py;
      if (rectangular) {
        px =
          Math.sign(Math.cos(a)) *
          Math.pow(Math.abs(Math.cos(a)), 0.22) *
          w *
          0.5;
        py =
          Math.sign(Math.sin(a)) *
          Math.pow(Math.abs(Math.sin(a)), 0.22) *
          h *
          0.5;
      } else {
        px = Math.cos(a) * w * 0.5;
        py = Math.sin(a) * h * 0.5;
      }
      i
        ? s.lineTo(px * irregular, py * irregular)
        : s.moveTo(px * irregular, py * irregular);
    }
    s.closePath();
    return s;
  }, [id, w, h]);
  const map = useMemo(() => stickerTexture(id), [id]);
  return (
    <group
      name={`cover-sticker-${id}`}
      position={[x, -0.276, z]}
      rotation={[Math.PI / 2, 0, Math.PI + rotation]}
    >
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.018,
              bevelEnabled: true,
              bevelSize: 0.005,
              bevelThickness: 0.003,
              bevelSegments: 1,
            },
          ]}
        />
        <Paper color={color} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        <meshStandardMaterial
          map={map}
          transparent
          roughness={1}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  );
}
export default function CoverStickers() {
  return (
    <group name="outside-cover-stickers">
      {stickerDesigns.map((design) => (
        <Sticker key={design.id} design={design} />
      ))}
    </group>
  );
}
