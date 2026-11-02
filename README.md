# The Seven Emirates — Abu Dhabi in paper

A standalone, procedural React / Three.js / React Three Fiber / Drei reconstruction of the supplied Abu Dhabi paper-book reference. The mosque is centered in the foreground, with five muted blue folded towers and a stepped skyline behind it. Palms, sage paper gardens, and a pale blue coastal edge frame the cream pages. All landmarks are real thin 3D cardstock geometry; the reference image is **not** a runtime texture, billboard, or background.

No Blender assets, generated replacement images, API keys, backend, missions, or other Emirates are required or integrated. The seven-chapter data contract is retained; only Abu Dhabi is available in this edition.

## Run

Use Node.js 22.12+ and npm (validated with Node 24.19).

```sh
npm ci
npm run dev
```

The dev server listens on all interfaces, normally port 5173. Use a reachable local host address or your environment's port forwarding. No public hosted preview is created automatically.

```sh
npm run build
npm run preview
```

Fonts, paper grain, sticker printing, geometry, and material colors are local. No network requests are needed by the running application.

## Interaction

The book starts completely closed. Hold the cover and drag left to open; reverse to close. Releasing preserves the exact current angle. There is no autoplay, click-to-open action, spring completion, timed landmark reveal, or animated scaling.

Mouse, pen, and finger dragging share a raycast-started pointer controller. Pointer capture continues off the cover; cancellation and window blur release the gesture without changing the angle. When open, grab the inside left page or its gold fore-edge grip to close.

Keyboard access: focus the opening meter; Right/Up opens, Left/Down closes, Home closes fully, End opens fully. Clicking the meter only focuses it. Landmark selection activates above 94% opening when no drag is active. Story cards provide the same selection without requiring 3D picking. Once fully open, drag the background to orbit slightly and scroll/pinch to zoom.

The matte green hardcover retains seven raised UAE travel stickers. All seven remain rigid children of the outside front cover.

## Development-only mechanism inspector

With `npm run dev`, append `?inspect` to the local application URL. The inspector provides:

- A continuous `bookOpenProgress` slider and reset-to-closed button.
- Hinge-point, fold-axis, and attachment-point overlays.
- Independent build stages: A façade prototype, B mosque, C towers/skyline, D landscape, E complete refinement.
- A current-pose geometry audit and per-assembly diagnostics.

Use `?inspect&stage=a` to start with the isolated façade. The inspector is compiled out of the production build. In production, `?inspect` / `?stage=a` do not expose it or change the complete chapter.

The inspector's geometry audit transforms actual mesh vertices, including each instanced dome rib, into book coordinates. It checks both page half-spaces at intermediate angles and the finite closed-cover envelope. It also reports projected cover-grip coordinates for repeatable native-pointer tests. These are diagnostics, not an alternative student interaction.

**Limits:** the audit checks cover containment and page penetration, not arbitrary sheet-to-sheet contact or fabrication manufacturability. Passing it is not a claim that the whole diorama can be cut from one production paper net.

## Architecture

```text
src/
  App.jsx                         Editorial shell, shared opening value, accessible stories
  book/
    BookController.jsx            Pointer capture and direct drag control
    Book.jsx                      Moving cover/page, fixed page, chapter mounts
    BookCover.jsx                 Hardcover and raised sticker group
    BookPages.jsx                 Layered cream stock, gutter seams, paper grain
    BookSpine.jsx                 Below-page cloth binding and finite thickness
    CoverStickers.jsx             Seven local illustrated die-cut stickers
    AbuDhabiChapter.jsx           Reusable chapter contract and stage selection
    Scene.jsx                     Frontal camera, soft lighting, demand rendering
  chapters/abuDhabi/
    Primitives.jsx                Hinges, attachment tabs, cardstock, debug markers
    mechanics.js                  Wedge-clearance and dome-fold constraints
    Mosque.jsx                    Parallel-fold tiers, portals, minarets, radial paper domes
    Towers.jsx                    Five blue accordion blades, grey supporting skyline forms
    Landscape.jsx                 Hinged palm fronds, flat gardens, coast, stepped backdrops
  mechanisms/
    kinematics.js                 Fixed-length V-fold and finite-spine glue bridges
    PopUpMechanism.jsx            Shared rigid paper panels and fold primitives
  dev/
    MechanismInspector.jsx        Dev-only controls
    audit.js                      Actual vertex / page-plane / closed-envelope checks
  data/chapters.js                 Chapter/story data; future chapters remain unavailable
```

All deployed transforms derive from the same `bookOpenProgress`. Runtime geometry is retained while rigid-panel hinge transforms change; instanced dome ribs share geometry. There are no independent landmark animation clocks.

## Mechanical and visual choices

### A — Proven façade

A single page-mounted extruded façade has a scored base crease, glue tab, explicit hinge location, and a fixed polygon. Its full-size panel rotates flat onto the page and fits the cover envelope. The inspector isolates this stage for inspection before the chapter is added.

### B — Mosque

The center-foreground mosque spans both pages as mirrored half-assemblies, preserving a narrow binding seam. Three connected façade tiers use paired equal-height wall hinges and a top roof in a four-bar parallel fold. The roof hinge position follows a constant-radius circle; both wall tops remain attached to the roof. Pointed portals and repeated arch openings are cut through actual extruded cardstock.

Minarets attach to the front tier's moving roof. Their articulated side panels share fixed crease edges; balcony tabs fold against the walls. Side pavilions carry smaller paper domes.

The supplied image shows closed, solid faceted domes. A rigid hemisphere cannot flatten between these covers. The implemented alternative uses dense radial onion-profile paper ribs, hinged around their axes. A roof-clearance constraint limits the fan angle while the rib assembly is inclined, so the lowest rib stays above the supporting roof. At full deployment the ribs fill a rounded volumetric silhouette. This is intentionally a foldable honeycomb-paper interpretation, not a claim that a solid dome was made flat.

### C — Towers and skyline

Five recognizable blue architectural blades sit behind the mosque with varied heights, sloped tops, leaning silhouettes, and scored side facets. Their side panels rotate about the actual **sloped shared edges**, not arbitrary object centers. Endpoints along each crease remain coincident and panel dimensions remain fixed. The towers are open-backed accordion façades so they can collapse; the frontal view preserves the reference's solid-looking composition without pretending to close an unrigged solid volume.

Two grey supporting forms and pastel stepped skyline silhouettes reproduce the reference's secondary background, rather than replacing the five blue towers with generic cubes.

### D — Landscape

Seven palm assemblies flank the mosque. Each trunk is scored cardstock, attached to its own page by a glue tab. Nine thin pointed fronds share the crown pivot, fold upward together, and fan radially as their trunk unfolds. The palms fold toward the back of the book to keep their closed footprints inside the covers.

Sage ground islands, garden strips, and overlapping blue coastline are thin extruded cut-paper shapes glued to their corresponding page. They stay attached during opening rather than floating into place.

### E — Clearance and appearance

Assemblies nearest the binding have less space between partially opened pages. Their standing angles are therefore limited by the geometric page wedge, rather than assuming a linear rotation is safe everywhere. Outer palms and minarets begin deploying earlier; the central architecture opens further as the pages separate. At 50% it is partly folded, at 75% nearly deployed, and at 100% complete.

The original reference is a rendered still, not a supplied fold net. The resulting system is an articulated, reversible mechanical prototype with fixed hinge geometry and measured page/cover clearance. A full force-driven sheet-material/contact simulation and production paper-net engineering remain outside this prototype.

## Validation

```sh
npm run test:mechanics
npm test
npm run test:production   # build + verify inspector/stage overrides are excluded
```

Playwright uses `/usr/bin/chromium` when available. Otherwise install Chromium with `npx playwright install chromium` or set `CHROMIUM_PATH`.

Tests cover fixed V-fold edge lengths, fixed glue-tab strip lengths, parallel folds, opening-wedge clearance, dome/roof clearance, sloped-crease endpoint coincidence, staged geometry audits, native mouse/touch capture, reverse dragging, repeatability, keyboard access, story selection gating, the student interface, and the non-WebGL fallback.

The rendered-geometry test examines stages A–D closed/half/open and the complete scene at 0%, 5%, 10%, 25%, 50%, 75%, and 100%. It saves numerical results to `artifacts/reference-rebuild/validation.json`. Clean scene captures at the requested five main poses and mobile captures are saved alongside it; the inspector capture is separate.

## Performance and reuse

- Demand rendering stops while idle; no automatic orbit, postprocessing, or timeline runs.
- Desktop DPR is capped at 1.65. Lighter mode uses DPR 1, a smaller shadow map, no soft-shadow shader, and fewer dome ribs.
- Paper profiles are cached; repeated dome lamellae use instancing.
- Four-core/low-memory devices default to lighter rendering when browser hints are available.
- A first-render readiness signal prevents interactions/tests from assuming that an empty canvas is already a usable scene.
- WebGL failure/context loss retains a static paper edition and accessible stories.
- The chapter component accepts page side, shared progress, interaction state, quality, and development stage. Future chapters can use this same contract; none are added here.

This prototype remains separate from Tomorrow's Earth Expo.
