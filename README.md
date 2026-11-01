# The Seven Emirates — A Sustainability Adventure

A standalone React / Three.js / React Three Fiber / Drei papercraft book prototype. The book starts **closed** and stays closed until deliberately dragged. Opening, paper engineering, and closing are a continuous, reversible interaction. There is no opening timeline, click-to-open button, automatic completion, spring, or scale-based landmark reveal.

## Run

Node.js 22.12+ and npm (validated using Node 24.19):

```sh
npm ci
npm run dev
```

Vite listens on all interfaces on port 5173 by default. Use a locally reachable host address or an environment-supported port forward. No external hosted preview is created. For a static production build:

```sh
npm run build
npm run preview
```

No API keys or backend are required. Fonts and paper artwork are local; runtime rendering makes no external requests.

## Interact

- **Hold the front cover and drag left** to open. Stickers are part of the cover and are raycastable too.
- **Drag right to close**, including reversing within the same gesture.
- **Release anywhere to pause** at exactly the current opening angle. Moving off the cover continues the captured drag.
- Once open, hold the inside left page / outer binding edge to close it again.
- Mouse, pen, and touch use the same pointer controller. Pointer cancellation and window blur end the gesture without changing the held angle.
- For keyboard access, focus the opening meter and press Arrow Right/Up to open, Left/Down to close; Home closes and End opens. Clicking the meter only focuses it.
- The background can orbit/zoom the camera only when fully open. Cover dragging takes priority and locks camera controls.
- Landmark raycasting and story cards activate above 94% opening when no drag is active.
- Close the book to change chapters. Abu Dhabi is the main scene; Dubai is a simpler folding study. The other five chapters remain future content.

Chapter switching deliberately exchanges the **flat chapter insert while closed**. The former automatic page-turn animation has been removed: it could independently collapse landmarks while the book angle stayed open. A separate manual chapter-leaf mechanism is future work; this revision prioritizes the requested cover-driven system and preserves chapter navigation.

## One source of motion

`bookOpenProgress` lives in `App.jsx` and is initialized to zero. It changes only through pointer displacement or explicit keyboard adjustment. All book and mechanism transforms are pure functions of that value. There are no independent landmark animation clocks or transform scales.

```text
src/
  App.jsx                         Shared progress, editorial UI, chapters, accessible stories
  book/
    BookController.jsx            Raycast start, pointer capture, release/cancellation
    Book.jsx                      Book assembly; moving/fixed pages; chapter mounts
    BookCover.jsx                 Thick matte hardcover and edge liner
    CoverStickers.jsx             Seven extruded, irregular die-cut illustrated stickers
    BookPages.jsx                 Layered cardstock, paper grain, gutter seams
    BookSpine.jsx                 Spine hinge derived from opening angle
    AbuDhabiChapter.jsx           Reusable foldable model registry and placements
    Scene.jsx                     Lighting, demand rendering, restrained camera
    materials.js                  Local deterministic paper/printed cover textures
  mechanisms/
    kinematics.js                 Pure fixed-length fold and hinge calculations
    PopUpMechanism.jsx            V-fold, four-bar parallel fold, tube and panel primitives
  landmarks/
    FoldableLandmark.jsx          Mosque, towers, mangroves and Dubai folding study
    Paper.jsx                     Shared rough cardstock materials and solids
  data/chapters.js                 Content, page sides, placements, model IDs
  hooks/usePreferences.js         Device motion and WebGL support
```

### Constrained V-fold

Two rigid triangular paper wings share a spine-origin-to-ridge edge. Their two base creases remain in the moving and fixed page planes. The creases make 30° with the binding and each wing's fixed internal angle is 60°. `solveVFold` computes the ridge as the intersection of the two fixed-angle constraints and the fixed-length sphere.

At closure the ridge lies flat along +X between the pages; as the pages separate it rises into 3D. Both wings retain **all five edge lengths**, including at 35%, 50%, 60%, and 85%. The visible supporting V-folds are mounted at the binding. A 0.16-unit closed-page cavity accommodates the folded cardstock. Fixed-width accordion glue bridges connect the V-fold creases to the offset moving leaf, preserving both tab lengths across the spine gap. A unit test validates the constraints across 1,001 opening positions. These are kinematic paper wings, not vertically scaled triangles.

### Landmark mechanisms

- **Mosque:** cut-paper arched facades and minarets rotate around scored base hinges. Two equal-height wall hinges form a four-bar parallel fold carrying a roof that stays parallel to the page. Layered onion-shaped dome lamellae fold flat and fan into volume. This is an intentionally simpler cut-and-fold architectural construction, not the former solid lathe-domed model.
- **Towers:** each tower is a four-panel tube. Its cross-section changes from a flat parallelogram to a rectangle through fixed-length side hinges. The whole panel assembly also rotates about a page-mounted base crease. Tower panels keep their full dimensions throughout.
- **Mangroves:** tree trunks and canopy lamellae rotate from page-flat positions and fan around shared scored hinges. The water is a thin overlapping shore stack whose small crease angles track the same progress.
- **Hardcover:** the front leaf rotates by `π × (progress − 1)`. Cover clearance and the split spine are derived from that same angle. The exterior sticker group is a rigid child of the front cover.

The two binding V-folds are exact constrained mechanisms. The landmark models are simplified articulated paper studies driven by the book angle; they are **not a full material, contact, or fabrication simulation**. This project does not claim a physically buildable linkage network for every architectural detail. Further production paper engineering should explicitly connect and collision-test any added folds rather than hide them behind a vertical reveal. No original reference video was supplied with this revision, so no frame-for-frame matching is claimed.

## Cover artwork

The outside front cover reads **THE SEVEN EMIRATES** and **A Sustainability Adventure**. It carries seven matte, raised paper stickers: UAE flag, Burj Khalifa, Grand Mosque, Ras Al Khaimah mountains, mangrove, Earth, and EXPLORE UAE stamp. Each sticker has irregular extruded edges, a local printed texture, thickness, and contact shadows. They remain on the exterior throughout the fold. No remote images or floating decoration are used.

## Add chapters / production Blender GLBs

Chapter scene records specify `model`, `side` (`left` or `right`), and page-local `position`. Register the corresponding folding component in `AbuDhabiChapter.jsx`, then enable its chapter data. Navigation automatically includes available chapters.

**Do not replace a folding landmark with one rigid GLB and scale it into view.** The previous static GLB adapter was removed because it could not fold mechanically.

For production Blender assets:

1. Model actual thin cardstock panels (roughly 0.008–0.02 scene units), separated at scored folds. Use roughness 1, metalness 0, desaturated paper colors, and real exposed edges. Omit a ground plane and glossy architectural materials.
2. Use page-local X/Z as the base plane and +Y as height after glTF export. Put each panel's origin exactly on its physical fold line. Apply object scale/rotation before assigning hinge parents.
3. Match the existing footprints: left mosque about 3.1 × 2.35 units; right tower assembly about 1.65 × 3; mangrove shore about 2.4 × 1.3. A page is about 4.3 × 5.5 units. All flat panels must fit the pages and cover envelope at progress zero.
4. Export a named hinge hierarchy, e.g. `Mosque_Base`, `Mosque_FrontCrease`, `Dome_Petal_01`, `Tower_01_Face_A` through `_D`, and `Tree_01_TrunkFold`. Keep pivots and material assignments in the GLB.
5. Load using Drei `useGLTF('/models/abu-dhabi.glb')`; clone the hierarchy, enable shadows, and bind named hinge nodes to the same `bookOpenProgress` calculations. Keep the existing page-side group and selection wrapper.
6. Alternatively, author an `Unfold` animation in Blender. Use `useAnimations` to pause its action and **scrub** `action.time = progress × clip.duration` / `mixer.update(0)` for both opening and reversal. Never play the clip on an independent timer. Use linear angle keys or bake a constrained kinematic solution; avoid interpolated scale tracks.
7. Inspect closed, 10%, 35%, 50%, 60%, 85%, and open poses. Check fixed edge lengths, connection points, thickness clearance, and cover/page collision. A visual GLB animation alone does not prove paper manufacturability.
8. Target 10–25k triangles per landmark with shared materials and packed 1K textures. Start with standard self-contained GLB; add local Draco/KTX decoders only if necessary.

No production GLB or original reference video is included.

## Device support

Demand rendering stops when the book is idle. Geometry for rigid panels is retained while only transforms update; the constrained V-fold geometry updates with its computed vertices. Desktop DPR is capped at 1.65. Lighter rendering uses DPR 1, smaller shadow maps, and no soft-shadow shader. Four-core/low-memory devices select it by default when browser hints are available.

There is no autonomous camera drift or motion to complete. Reduced-motion preferences preserve direct manual control. WebGL failure/context loss switches to a static paper edition, retaining chapter navigation and stories. Dialog focus and all stories remain keyboard accessible.

## Validation

```sh
npm test                  # Kinematics plus actual Chromium interaction tests
npm run test:mechanics    # Fixed-length and reversibility checks only
```

Playwright uses `/usr/bin/chromium` when present. Otherwise run `npx playwright install chromium` or set `CHROMIUM_PATH` to an installed Chromium. Tests run real WebGL with software rendering in CI and dispatch native Chromium touch events for mobile coverage.

Coverage includes no autoplay, no click opening, raycast drag starts, pointer capture outside the cover, partial poses, pause/release, reversal in one gesture, complete closure, repeatability, keyboard control, mobile/touch input, reduced motion, selection gating, closed-book chapter changes, and the no-WebGL fallback. Screenshots at closed/35/50/60/85/100% and mobile poses are saved under `artifacts/`.

This remains a standalone prototype, with no Tomorrow's Earth Expo integration.
