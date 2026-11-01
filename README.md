# The Seven Emirates — A story in paper

A standalone React / Three.js pop-up book prototype. The first chapter contains procedural papercraft interpretations of the Sheikh Zayed Grand Mosque, Etihad Towers, and Abu Dhabi’s mangroves. Dubai is explicitly a **paper study**, demonstrating the chapter transition. The other five Emirates are listed as future chapters. No Tomorrow’s Earth Expo integration is included.

## Run locally

Use Node.js 22.12+ (validated with Node 24.19) and npm.

```sh
npm ci
npm run dev
```

Open the address Vite prints (normally port 5173). For a production build:

```sh
npm run build
npm run preview
```

The application is static, requires no API keys or services, and bundles fonts locally. It makes no external requests at runtime. Use a local web server rather than opening `index.html` from disk. The 3D renderer loads separately from the accessible page content.

## Explore

- The hardcover opens automatically, the pages settle, and the three papercraft assemblies rise in sequence.
- Drag to orbit; scroll or pinch to zoom. The camera is constrained to keep the book legible.
- Click a 3D landmark or use its accessible story card below the book. Cards work with Tab and Enter/Space.
- Use the next/previous arrows to turn between Abu Dhabi and the Dubai study.
- The book control closes/reopens it; the circular arrow replays the opening.
- “The collection” lists all seven chapters. “Behind the folds” explains the interaction.
- Experience settings offer reduced motion and lighter rendering. Device reduced-motion preferences are respected automatically.
- Escape closes dialogs and focus returns to the previous control.

## Structure

```text
src/
  App.jsx                     Editorial shell, accessible selection, dialogs, navigation
  styles.css                  Responsive layout and typography
  hooks/usePreferences.js     Reduced-motion and WebGL detection
  data/chapters.js             Chapter content, scene placements, landmark stories
  book/Book.jsx               Hardcover, spine, pages, page-turn leaf, model registry
  book/materials.js           Locally generated paper grain and cover artwork
  book/Scene.jsx              Lighting, camera, canvas, chapter playback
  animation/bookTimeline.js   Reusable opening, folding, closing, and page-turn timelines
  landmarks/Paper.jsx         Shared cardstock primitives, gussets, interaction wrapper
  landmarks/Mosque.jsx        Domes, four minarets, solid arched colonnades
  landmarks/Towers.jsx        Five creased towers and Dubai study
  landmarks/Mangroves.jsx     Extruded water layers and layered tree canopies
```

Landmarks are actual 3D meshes; there are no image billboards or remote models. The book uses a hinged hard cover, nine visible page layers on each side, textured paper surfaces, a rounded spine, gutter creases, and a ribbon. The page-turn system folds away the current assemblies, turns a double-sided cardstock leaf around the binding, swaps chapter data at the midpoint, and unfolds the new scene. Procedural popup assemblies use articulated root rotation and vertical expansion; this is a visual paper-engineering prototype rather than a physical paper simulation. Production assets can supply true scored hinge rigs.

## Add a chapter

1. Add its stories to `landmarks` in `src/data/chapters.js`.
2. Give the chapter an available flag, landmark IDs, and a `scene` list of `{ model, position }` records.
3. Register a procedural component in `book/Book.jsx`, or provide an `asset` URL for an existing model ID as described below.
4. Navigation automatically includes chapters marked `available`; keep unfinished chapters unavailable.

Geometry, chapter content, timeline orchestration, and selection are separate. Landmark IDs link the 3D interaction and accessible story cards. The number of popup animation slots is derived from chapter data.

## Replace procedural models with Blender GLB assets

Store self-contained `.glb` files under `public/models/`. In Blender:

1. Work in meters; export Y-up glTF. Apply scale and rotation. Place the landmark’s origin at the **center of its paper base**, on the ground plane. The book lies in X/Z and height is +Y after export.
2. Use real thickness (roughly 0.015–0.04 scene units), scored folds, beveled cardstock edges, and separated paper layers. Model architecture as folded paper rather than a realistic building. Keep paper double-sided where necessary; use solid geometry for visible edges.
3. Use warm off-white, desaturated blue-grey, and muted green roughness-1 materials. Avoid metalness, clearcoat, transmission, baked glossy highlights, or a floor in the asset. Pack textures into the GLB; prefer 1K texture maps and a shared material palette.
4. Target 10–25k triangles per landmark and a small number of materials. Check desktop and mobile before increasing detail. Author LOD variants if needed.
5. Suggested local footprints: mosque 3.1 × 2.24 units, towers 2.05 × 1.6, mangroves 2.7 × 1.6. Keep maximum height around 3 units. Page dimensions are approximately 4.3 × 5.5 units per side.
6. Export glTF 2.0 / GLB with selected objects. The included loader needs no external Draco or KTX decoder; use ordinary glTF geometry/textures initially.

Change the scene record, retaining the model ID, placement, and story:

```js
{ model: 'mosque', position: [-2.17, 0.1, -0.3],
  asset: '/models/abu-dhabi-mosque.glb', assetScale: 1,
  assetOffset: [0, 0, 0] }
```

The included `Asset` adapter uses Drei `useGLTF`, clones the scene, enables shadows, and keeps the same selection and animation wrapper. Test assets with `npm run dev`; a missing or invalid GLB triggers the accessible paper-edition fallback. Material properties should be authored in Blender. No actual production GLB is included.

For production paper engineering, put each scored fold on a named hinge/pivot in Blender and export an `Unfold` animation. Extend `Asset` with Drei `useAnimations`; advance its action from the shared GSAP timeline rather than playing an independent animation. Keep the base pivot fixed and coordinate hinge rotations with page angle. Retain the reduced-motion endpoint and the procedural story controls. Validate contact/shadow continuity at closed, midpoint, and fully open poses.

## Performance and accessibility

- Normal mode caps DPR at 1.65; lighter mode uses DPR 1, a 1024 shadow map, no PCSS soft-shadow shader, and no antialiasing.
- Low-memory/four-core devices default to lighter rendering when the browser exposes those hints.
- Models use small procedural geometries, shared texture caches, local fonts, and no postprocessing or continuous auto-rotation.
- Rendering pauses when the canvas is idle; orbit controls and GSAP timelines request frames during changes.
- Reduced motion takes each sequence directly to its final state; it removes the cinematic camera drift.
- WebGL initialization failures, context loss, or renderer errors show a static paper-book illustration. Stories and chapter navigation remain usable.
- Dialogs use native modal focus trapping; all landmark stories are available without interacting with the canvas. The canvas is supplementary.

## Verification

```sh
# Install Chromium once, or use a system Chromium:
npx playwright install chromium
npm test
# Optional browser location:
CHROMIUM_PATH=/path/to/chromium npm test
```

The tests exercise actual WebGL rendering with Chromium, opening, selection, page turns in both directions, close/reopen/replay, a mobile viewport, reduced motion, lighter rendering, keyboard selection, and the no-WebGL fallback. Screenshots are generated under `artifacts/`.

This repository is a visual prototype. Papercraft landmarks are recognizable procedural interpretations, not architectural surveys. Only Abu Dhabi and the Dubai transition study have scene content. Asset quality and performance on physical student devices should be evaluated before production use.
