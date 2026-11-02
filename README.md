# The Seven Emirates — a story in paper

A single interactive, procedural pop-up book with two implemented spreads:

1. **Abu Dhabi** — Grand Mosque, Etihad Towers, palms, gardens, and coast.
2. **Dubai** — Museum of the Future, Burj Khalifa, Emirates Towers, supporting skyline, and elevated Metro.

The remaining five Emirates are unavailable placeholders. No missions or Tomorrow's Earth Expo integration are added. Both chapters share the same book proportions, cream pages, matte cardstock palette, restrained frontal camera, lighting, quality settings, and pointer interaction.

The supplied chapter images are visual references only. Neither complete image is used as a runtime plane, billboard, background, or landmark texture. All architecture and vegetation are actual thin 3D geometry. No external models or generated replacement images are required.

## Run

Node.js 22.12+ and npm (validated with Node 24.19):

```sh
npm ci
npm run dev
```

Vite normally listens on all interfaces on port 5173. Use a reachable local address or an environment-supported port forward. No public hosted URL is created automatically.

```sh
npm run build
npm run preview
```

There are no API keys, services, or remote runtime assets. Fonts, paper grain, sticker artwork, and geometry are local.

## Read the book

- The initial cover is **closed**. Hold it and drag left to open. Reverse to close. Release to preserve any partial angle.
- The first spread is always Abu Dhabi on initial load.
- Once fully open, use **Next chapter** to turn the inner sheet to Dubai. **Previous chapter** turns back to Abu Dhabi.
- During a page turn, the cover and landmark selection are locked. Once settled, the new spread uses the same manual cover interaction.
- Closing/reopening preserves the selected chapter for the current session. Reload starts at Abu Dhabi again.
- Drag the background to orbit slightly when fully open; scroll/pinch to zoom. Landmarks and their story cards become selectable above 94% opening, when no drag/turn is active.
- Mouse, pen, and touch use the same raycast-started pointer controller, with pointer capture and cancellation handling.
- Keyboard access: focus the opening meter, use Right/Up and Left/Down, or Home/End. Clicking the meter only focuses it. Chapter arrows and story cards are keyboard accessible.

Reduced-motion preferences shorten the requested internal page turn. They never open the cover automatically or complete a manual drag. WebGL failure retains a static paper edition with accessible chapter/story navigation.

## Real inner-page transition

`bookOpenProgress` remains the manually controlled cover state. The separate `PageTurnController` starts only after an explicit Next/Previous request on a fully open book.

A thin, double-sided paper leaf rotates 180° about the binding. The old chapter's outgoing half stays attached to the moving front of that leaf. Both old halves fold down during the first half of the transition. At the midpoint, where the assemblies are flat, the incoming chapter takes over; its corresponding half is attached to the reverse of the same leaf. It then deploys as the sheet settles. The stationary half remains attached to its own page.

The reverse transition applies the mirrored geometry, not a crossfade or an instant replacement of upright scenes. Only the chapter appropriate to the current turn phase is mounted. No inactive chapter is left floating in the book.

`pageTurnPose()` is a pure kinematic mapping from normalized turn progress to chapter, local unfolding, leaf angle, and left/right chapter transforms. Unit tests verify both directions and the shared attachment coordinates. GSAP supplies timing for the explicitly requested page turn; it does not drive cover opening or independent landmark reveals. Turns use elapsed time so slow rendering does not stretch navigation indefinitely.

## Dubai reference reconstruction

The content follows the supplied Dubai reference, while Abu Dhabi supplies the style and scale:

- **Burj Khalifa:** a central stepped silhouette and needle-like spire, made from three scored paper blades on each side of the binding. Setback bands and a thin base retain the reference's proportions.
- **Museum of the Future:** an ivory oval with a real open centre, subtle abstract score marks, and a grey folded plinth in the foreground. Parallel card rings and fixed-length spacers give it depth. Each ring has its own base crease and folds flat; the connecting strips preserve the parallel-fold geometry.
- **Emirates Towers:** two blue-grey, sharply crowned towers on the left, with cut windows, inset paper, and hinged sides.
- **Right skyline:** simplified folded architectural blades and the supporting frame silhouette seen in the reference.
- **Dubai Metro:** a curved cream card viaduct on equal-height hinged piers. Its top follows the exact constant-radius support endpoint. The small carriage uses paired folding walls and a linked paper roof.
- **Landscape:** the same page-attached sage gardens, blue coastal layers, palm geometry, and material family used by Abu Dhabi.

The museum is a layered paper ring, not a rigid solid torus. Architectural backs remain open where needed to permit flat folding. Surface scoring is an abstract papercraft treatment, not an exact tracing of the museum's inscriptions. This is a recognizable foldable interpretation of the reference, not a surveyed architectural model.

## Abu Dhabi preservation

Abu Dhabi remains Chapter 01 with its existing façade tiers, dense radial paper domes, minarets, five blue towers, stepped skyline, and coastal gardens. Geometry/material primitives have been moved to shared modules without changing the visual language.

One tower was shifted inward by 0.09 scene units to keep its flat side facet within the turning leaf. The page-turn geometry audit caught that binding clearance issue. The chapter's original cover-driven folding and staged checks remain in the test suite.

## Development inspector

Run the dev server and append `?inspect` to its local URL. The inspector provides:

- Active chapter selection for isolated inspection.
- Independent book-opening and internal page-turn sliders.
- The current turn route, plus stage A–E selection.
- Hinge-point, actual fold-axis, and attachment-point overlays.
- Reset-to-closed, which cancels a turn and closes the cover.
- An actual rendered-geometry envelope audit and per-assembly diagnostics.

Internal turns require a fully open cover. The cover slider is disabled while a turn is active. Stage A isolates one façade; B adds the mosque or museum; C adds architecture; D adds landscape/transport; E shows the complete spread. On phones the panel scrolls within a compact height so it does not cover the book's grab points.

The inspector is compiled out of production. `?inspect` / `?stage=a` do not expose it or override the complete production chapter. The production test also verifies Next/Previous in the built application.

## Structure

```text
src/
  App.jsx                           Shared cover state, navigation, accessible stories
  book/
    Book.jsx                        One physical book and page stacks
    BookController.jsx              Raycast drag and pointer capture
    PageTurnController.jsx          Explicit chapter-turn timing and dev scrubbing
    pageTurn.js                     Pure bidirectional page/attachment mapping
    TurningPage.jsx                 Double-sided cardstock leaf
    ChapterSpread.jsx               Chapter ID → component registry
    AbuDhabiChapter.jsx             Chapter 01 assembly contract
    BookCover.jsx / CoverStickers.jsx
    BookPages.jsx / BookSpine.jsx
    Scene.jsx                       Shared camera, lighting, demand rendering
  chapters/
    shared/
      Primitives.jsx                Paper panels, crease markers, glue tabs, selection
      mechanics.js                  Standing-angle and roof-clearance constraints
      AccordionBlade.jsx            Reusable fixed-edge architectural facets
      Landscape.jsx                 Shared palms, gardens, coast, and backdrop primitive
    abuDhabi/
      Mosque.jsx / Towers.jsx       Abu Dhabi architecture
      Primitives.jsx / mechanics.js / Landscape.jsx
                                    Compatibility re-exports of shared primitives
    dubai/
      DubaiChapter.jsx              Chapter 02 assembly contract
      Museum.jsx                    Hinged ring layers and parallel-fold plinth
      Architecture.jsx              Burj Khalifa, Emirates Towers, right skyline
      Metro.jsx                     Linked track, piers, folding carriage
  mechanisms/
    kinematics.js / PopUpMechanism.jsx
  dev/
    MechanismInspector.jsx / audit.js
  data/chapters.js                   Available chapters and story data
```

A chapter accepts page side, normalized deployment, interaction state, quality, and development stage. Add a future component to `chapterRegistry` and enable its metadata entry; the same cover, turn controller, leaf, camera, navigation, and story shell are reused. No later Emirates are implemented here.

## Mechanical validation and limits

Geometry uses real hinge pivots, fixed panel dimensions, page glue tabs, and linked roof/track endpoints. No vertical scale animation or timed building appearance simulates unfolding. Near the gutter, standing angles are limited by available page-wedge clearance. Dome ribs are constrained to stay above their supporting roofs.

The development audit transforms actual mesh vertices, including instanced paper ribs, into book coordinates. It checks the two interior page half-spaces and the finite closed-cover envelope. During a turn it includes the active chapter's actual moving-page transforms. It does **not** claim arbitrary sheet-to-sheet contact detection, a force-driven material simulation, or fabrication-ready paper nets. The content exchange occurs at the fully folded midpoint of a visibly rotating leaf; progressive occlusion of every tiny flat cutout is simplified.

## Tests

```sh
npm run test:mechanics
npm test
npm run test:production
```

Playwright uses `/usr/bin/chromium` when present. Otherwise install Chromium with `npx playwright install chromium` or set `CHROMIUM_PATH`.

Tests cover fixed-length folds, sloped crease coincidence, page-turn attachment coordinates in both directions, the flat midpoint, Abu Dhabi's staged checks, Dubai at closed/partial/open poses, forward/reverse page clearance, native mouse/touch capture, repeated navigation, closing/reopening Dubai, reduced motion, selection gating, quality settings, fallback access, and production inspector exclusion.

Evidence:

- `artifacts/reference-rebuild/` — Abu Dhabi poses and geometry audit.
- `artifacts/dubai/open-*.png` — Dubai opening poses.
- `artifacts/dubai/turn-*-*.png` — both directions at intermediate leaf angles.
- `artifacts/dubai/folding-validation.json` and `page-turn-validation.json` — numerical checks.
- `artifacts/dubai/mobile.png` and `production.png` — device/build verification.

## Performance

Rendering stops while idle. Profiles and card geometry are cached; Abu Dhabi's repeated dome lamellae use instancing. Desktop DPR is capped at 1.65. Lighter mode uses DPR 1, smaller shadow maps, fewer dome ribs, and no soft-shadow shader. Four-core/low-memory devices select lighter mode by default when browser hints are available. Only the currently presented chapter is mounted. No external assets, postprocessing, autonomous camera orbit, or scene-wide fades are used.
