import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePageTurnController } from "./book/PageTurnController";
import { pageTurnPose } from "./book/pageTurn";
import { chapters, landmarks } from "./data/chapters";
import { supportsWebGL, useMedia } from "./hooks/usePreferences";
const MechanismInspector = import.meta.env.DEV
  ? lazy(() => import("./dev/MechanismInspector"))
  : null;
const Scene = lazy(() => import("./book/Scene"));
export function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    replay: (
      <>
        <path d="M4 11a8 8 0 1 1 2 7M4 4v7h7" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    book: (
      <>
        <path d="M12 6v15M12 6C8 3 4 4 2 5v14c3-1 6-1 10 2 4-3 7-3 10-2V5c-3-1-6-1-10 1Z" />
        <path d="M5 8c2-.2 3 0 4 1m6 0c1-1 2-1.2 4-1" />
      </>
    ),
    settings: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="3" />
        <circle cx="15" cy="17" r="3" />
      </>
    ),
    expand: (
      <>
        <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      </>
    ),
    mouse: (
      <>
        <rect x="7" y="2" width="10" height="16" rx="5" />
        <path d="M12 5v4m-3 12 3 2 3-2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function LandmarkSketch({ type }) {
  return (
    <svg
      className="landmark-sketch"
      viewBox="0 0 120 76"
      fill="none"
      aria-hidden="true"
    >
      {type === "museum" ? (
        <g stroke="currentColor" strokeWidth="1.1">
          <ellipse cx="60" cy="36" rx="43" ry="24" />
          <ellipse cx="60" cy="36" rx="27" ry="12" />
          <path d="M20 61h80l8 8H12l8-8m14-35 7-7m43 34 6-7" />
        </g>
      ) : type === "metro" ? (
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M8 50q46-18 104 8M8 55q46-18 104 8M22 50v19m30-24v24m30-20v20m24-10v10" />
          <path d="M39 40V26h35l8 18H39Zm5-10h6v8h-6m10-8h7v8h-7m11-8h7l3 8H65" />
        </g>
      ) : type === "burj-khalifa" ? (
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M20 69h80M46 68V47h5V30h4V17h4L61 3l2 14h3v13h4v17h5v21M61 18v48m-9-20h18m-14-15h10" />
        </g>
      ) : type === "mosque" ? (
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M10 65h101M19 64V33h4v31m74 0V33h4v31M17 33l4-9 4 9m70 0 4-9 4 9M33 64V43h54v21M47 43v-4c-8-10 9-17 13-25 4 8 21 15 13 25v4M60 14V8M45 43h30M33 51h54M52 64V54q8-13 16 0v10M39 64v-8m42 8v-8" />
          <path d="M14 65V42h15v23m62 0V42h15v23M30 42q-10-19-17 0m94 0q-10-19-17 0" />
        </g>
      ) : type === "towers" || type === "burj" || type === "emirates-towers" ? (
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M12 67h97M22 66V31l15-6v41M44 66V12l16-4-3 58M65 66V24l17-7-4 49M87 66V36l12-4-3 34M26 33v29M49 17v45M70 28v34M36 43l-13 3m35-17-14 3m37 6-15 4m-9 5-13 3" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.1">
          <path d="M10 62q20-8 42 0t57-2M18 68q17-5 37 0t46-1M36 57V33m0 12L25 34m11 5 10-11M73 58V31m0 13-11-12m11 6 12-9" />
          <path d="M36 38C6 41 15 18 24 21c-4-15 18-16 20-5 18-7 23 16 6 18-5 10-12 7-14 4Zm37-3C48 37 51 16 63 20c-2-15 18-14 20-4 18-2 20 17 7 18-5 6-11 6-17 1Z" />
        </g>
      )}
    </svg>
  );
}
function Fallback({ chapter }) {
  return (
    <div
      className="fallback-scene"
      role="img"
      aria-label="Static paper book illustration. Explore the landmarks using the cards below."
    >
      <div className="fallback-book">
        <div>
          {chapters[chapter].landmarks.map((id) => (
            <LandmarkSketch key={id} type={id} />
          ))}
        </div>
      </div>
      <p>
        Paper edition{" "}
        <span>
          3D is unavailable on this device. Explore the stories below.
        </span>
      </p>
    </div>
  );
}
function Modal({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="modal-close icon-button"
        aria-label="Close dialog"
        onClick={onClose}
      >
        <Icon name="close" />
      </button>
      <span className="eyebrow">THE SEVEN EMIRATES</span>
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
export default function App() {
  const systemReduced = useMedia("(prefers-reduced-motion: reduce)");
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(
    () =>
      (navigator.hardwareConcurrency || 8) <= 4 ||
      (navigator.deviceMemory || 8) <= 4,
  );
  const [webgl, setWebgl] = useState(supportsWebGL);
  const [sceneReady, setSceneReady] = useState(false);
  const [debug, setDebug] = useState(() => ({
    enabled:
      import.meta.env.DEV &&
      new URLSearchParams(location.search).has("inspect"),
    stage:
      import.meta.env.DEV &&
      new URLSearchParams(location.search).has("inspect") &&
      "abcde".includes(new URLSearchParams(location.search).get("stage"))
        ? new URLSearchParams(location.search).get("stage") || "e"
        : "e",
    hinges: false,
    axes: false,
    attachments: false,
  }));
  const [report, setReport] = useState(null);
  const onReport = useCallback((value) => setReport(value), []);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const [chapter, setChapter] = useState(0),
    [selected, setSelected] = useState(null);
  const [bookOpenProgress, setBookOpenProgress] = useState(0),
    [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(null);
  const clearSelection = useCallback(() => setSelected(null), []);
  const pagination = usePageTurnController({
    chapter,
    onChapter: setChapter,
    reduced: reduced || systemReduced,
    onStart: clearSelection,
  });
  const turn = pagination.turn;
  const presentedChapter = pageTurnPose(turn, chapter).chapter;
  const active = chapters[presentedChapter];
  const available = chapters
    .map((c, i) => (c.available ? i : null))
    .filter((i) => i !== null);
  const prev = available.filter((i) => i < chapter).at(-1),
    next = available.find((i) => i > chapter);
  const closed = bookOpenProgress < 0.001,
    fullyOpen = bookOpenProgress > 0.98;
  const canInteract =
    !webgl || (bookOpenProgress > 0.94 && !dragging && !turn.active);
  const canChangeChapter = !webgl || (fullyOpen && !dragging && !turn.active);
  const onFailure = useCallback(() => {
    setWebgl(false);
    setDragging(false);
    pagination.cancel();
  }, [pagination.cancel]);
  const onProgress = useCallback((value) => {
    setBookOpenProgress(value);
    if (value < 0.94) setSelected(null);
  }, []);
  const select = useCallback(
    (id) => {
      if (canInteract) setSelected(id);
    },
    [canInteract],
  );
  function changeChapter(target) {
    if (!canChangeChapter || target === undefined) return;
    setSelected(null);
    if (!webgl) {
      setChapter(target);
      return;
    }
    pagination.request(target);
  }
  function openingKey(event) {
    if (turn.active) return;
    const changes = {
      ArrowRight: 0.05,
      ArrowUp: 0.05,
      ArrowLeft: -0.05,
      ArrowDown: -0.05,
      PageUp: 0.1,
      PageDown: -0.1,
    };
    if (event.key in changes) {
      event.preventDefault();
      onProgress(
        Math.max(0, Math.min(1, bookOpenProgress + changes[event.key])),
      );
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      onProgress(event.key === "Home" ? 0 : 1);
    }
  }
  useEffect(() => {
    document.body.style.cursor = "auto";
  }, [selected, chapter]);
  const info = selected ? landmarks[selected] : null;
  return (
    <>
      <a className="skip-link" href="#landmarks">
        Skip to the landmarks
      </a>
      <header className="site-header">
        <a className="brand" href="#" aria-label="The Seven Emirates home">
          <span className="brand-symbol">
            <Icon name="book" size={29} />
          </span>
          <span>
            THE SEVEN
            <br />
            <strong>EMIRATES</strong>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button onClick={() => setModal("chapters")}>
            The collection <span className="tiny-count">07</span>
          </button>
          <button onClick={() => setModal("about")}>
            Behind the folds{" "}
            <span className="nav-arrow">
              <Icon name="arrow" size={13} />
            </span>
          </button>
        </nav>
        <div className="header-edition">
          <svg
            className="small-star"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g stroke="currentColor" strokeWidth="1.1">
              <path d="M12 1v22M1 12h22M4 4l16 16M4 20 20 4" />
            </g>
          </svg>{" "}
          A STORY IN PAPER
        </div>
      </header>
      {import.meta.env.DEV && debug.enabled && (
        <Suspense fallback={null}>
          <MechanismInspector
            chapter={presentedChapter}
            onChapter={pagination.choose}
            turn={turn}
            onTurn={pagination.scrub}
            onReset={() => {
              pagination.cancel();
              setBookOpenProgress(0);
              setSelected(null);
            }}
            progress={bookOpenProgress}
            onProgress={onProgress}
            debug={debug}
            setDebug={setDebug}
            report={report}
          />
        </Suspense>
      )}
      <main>
        <section
          className="experience reference-scene"
          aria-label="Interactive pop-up book"
          data-book-progress={bookOpenProgress.toFixed(4)}
          data-scene-ready={sceneReady}
          data-dragging={dragging}
          data-chapter-id={active.id}
          data-page-turn-progress={turn.progress.toFixed(4)}
          data-page-turn-state={turn.active ? "turning" : "idle"}
        >
          <div className="scene-wrap">
            {webgl ? (
              <SceneBoundary onFailure={onFailure}>
                <Suspense
                  fallback={
                    <div className="scene-loading">Preparing the paper…</div>
                  }
                >
                  <Scene
                    progress={bookOpenProgress}
                    chapter={chapter}
                    dragging={dragging}
                    onDragging={setDragging}
                    onProgress={onProgress}
                    onSelect={select}
                    reduced={reduced || systemReduced}
                    lowPower={lowPower}
                    onContextLost={onFailure}
                    onSceneReady={onSceneReady}
                    debug={debug}
                    onReport={onReport}
                    turn={turn}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              <Fallback chapter={chapter} />
            )}
            {webgl && !sceneReady && (
              <div className="scene-loading" role="status">
                Preparing the paper…
              </div>
            )}
          </div>
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="gold-line" /> SEVEN EMIRATES. COUNTLESS STORIES.
            </div>
            <h1>
              A nation,
              <br />
              <em>unfolding.</em>
            </h1>
            <p>
              A journey through the Emirates,
              <br />
              one paper world at a time.
            </p>
          </div>
          <div className="chapter-marker">
            <span className="eyebrow">CHAPTER</span>
            <div>
              <span>{active.index}</span>
              <i>/ 07</i>
            </div>
            <span className="marker-line" />
            <span className="arabic" lang="ar">
              {active.arabic}
            </span>
          </div>
          <div className="scene-note">
            <span className="status-dot" />
            <span aria-live="polite">
              {!webgl
                ? "THE PAPER EDITION"
                : turn.active
                  ? `TURNING TO ${chapters[turn.to].title.toUpperCase()}`
                  : selected
                    ? landmarks[selected].label.toUpperCase()
                    : closed
                      ? "DRAG THE FRONT COVER LEFT TO OPEN"
                      : fullyOpen
                        ? "DRAG THE LEFT PAGE RIGHT TO CLOSE"
                        : "YOUR HAND. EVERY FOLD."}
            </span>
            {selected && <a href="#landmarks">Read the story ↓</a>}
          </div>
          {webgl && (
            <div className="opening-control">
              <div
                role="slider"
                aria-label="Book opening"
                aria-disabled={turn.active}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(bookOpenProgress * 100)}
                aria-valuetext={`${Math.round(bookOpenProgress * 100)} percent open. Drag the cover, or use arrow keys here.`}
                tabIndex={0}
                onKeyDown={openingKey}
              >
                <span className="opening-track">
                  <i style={{ width: `${bookOpenProgress * 100}%` }} />
                </span>
                <span>
                  {Math.round(bookOpenProgress * 100)}
                  <small>% OPEN</small>
                </span>
              </div>
            </div>
          )}
          <div className="scene-tools">
            <button
              className="icon-button"
              aria-label="Experience settings"
              title="Experience settings"
              onClick={() => setModal("settings")}
            >
              <Icon name="settings" />
            </button>
          </div>
          <div className="chapter-bar">
            <div className="chapter-identity">
              <span className="chapter-number">{active.index}</span>
              <div>
                <span className="eyebrow">
                  {active.index === "01"
                    ? "THE FIRST CHAPTER"
                    : `CHAPTER ${active.index}`}
                </span>
                <h2>
                  {active.title}
                  <span className="chapter-subtitle">{active.subtitle}</span>
                </h2>
              </div>
            </div>
            <div className="chapter-navigation">
              <button
                className="round-button prev"
                aria-label="Previous chapter"
                disabled={!canChangeChapter || prev === undefined}
                onClick={() => changeChapter(prev)}
              >
                <Icon name="arrow" />
              </button>
              <span>
                {active.index}
                <i> / 07</i>
              </span>
              <button
                className="round-button"
                aria-label="Next chapter"
                disabled={!canChangeChapter || next === undefined}
                onClick={() => changeChapter(next)}
              >
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>
        <section
          className="details"
          id="landmarks"
          aria-labelledby="details-heading"
        >
          <div className="details-heading">
            <div>
              <div className="eyebrow">
                SMALL DETAILS. EXTRAORDINARY STORIES.
              </div>
              <h2 id="details-heading">A closer look at {active.title}.</h2>
            </div>
            <p>
              <Icon name="mouse" size={18} />{" "}
              {canInteract
                ? "Select a landmark to discover its story"
                : "Unfold the book to explore its landmarks"}
            </p>
          </div>
          <div
            className={`landmark-grid ${active.landmarks.length === 4 ? "four-landmarks" : ""}`}
          >
            {active.landmarks.map((id) => {
              const item = landmarks[id];
              return (
                <button
                  key={id}
                  className={`landmark-card ${selected === id ? "selected" : ""}`}
                  onClick={() => select(id)}
                  disabled={!canInteract}
                  aria-pressed={selected === id}
                >
                  <div className="sketch-box">
                    <LandmarkSketch type={id} />
                  </div>
                  <div className="landmark-card-copy">
                    <span className="eyebrow">{item.category}</span>
                    <h3>{item.short}</h3>
                    <span className="card-prompt">
                      {!canInteract
                        ? "Waiting between the pages"
                        : selected === id
                          ? "You’re exploring this story"
                          : "Discover the story"}{" "}
                      <Icon name="arrow" size={15} />
                    </span>
                  </div>
                  <span className="card-index">{item.number}</span>
                </button>
              );
            })}
          </div>
          {info && (
            <article className="landmark-story" aria-live="polite">
              <span className="story-number">{info.number}</span>
              <div>
                <span className="eyebrow">{info.category}</span>
                <h3>{info.label}</h3>
                <p>{info.description}</p>
                <span className="story-fact">{info.fact}</span>
              </div>
              <button
                className="icon-button"
                aria-label="Close landmark story"
                onClick={() => setSelected(null)}
              >
                <Icon name="close" />
              </button>
            </article>
          )}
          <div className="paper-note">
            <span>DESIGNED TO SPARK CURIOSITY.</span>
            <p>Seven places. One remarkable home.</p>
            <span>EXPLORE AT YOUR OWN PACE.</span>
          </div>
        </section>
      </main>
      <footer>
        <a className="footer-brand" href="#">
          The Seven Emirates<span>A story in paper.</span>
        </a>
        <span>AN INTERACTIVE PAPER EXPLORATION</span>
        <span>PROTOTYPE · VOLUME 01</span>
      </footer>
      {modal === "chapters" && (
        <Modal title="Seven Emirates. One book." onClose={() => setModal(null)}>
          <p className="modal-intro">
            Explore Abu Dhabi and turn the page to Dubai. Five more Emirates are
            waiting to be crafted.
          </p>
          <div className="chapter-list">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                disabled={
                  !c.available || (!canChangeChapter && i !== presentedChapter)
                }
                onClick={() => {
                  setModal(null);
                  if (i !== presentedChapter) changeChapter(i);
                }}
              >
                <span>{c.index}</span>
                <strong>{c.title}</strong>
                <small>
                  {i === presentedChapter
                    ? "CURRENT CHAPTER"
                    : c.study
                      ? "PAPER STUDY"
                      : c.available
                        ? "EXPLORE"
                        : "COMING LATER"}
                </small>
                {c.available && <Icon name="arrow" size={17} />}
              </button>
            ))}
          </div>
        </Modal>
      )}
      {modal === "about" && (
        <Modal
          title="A little paper. A whole world."
          onClose={() => setModal(null)}
        >
          <div className="about-illustration">
            <Icon name="book" size={65} />
          </div>
          <p>
            Inspired by the quiet magic of a handcrafted pop-up book, this
            exploration brings the Emirates to life through folded geometry,
            layered cardstock, and soft light.
          </p>
          <p>
            Hold the front cover and drag left to open. Drag back to close.
            Release anywhere to hold that angle. Once fully open, drag the
            background to look around and scroll or pinch to move closer. Select
            a miniature landmark, or its story card below, to learn more.
          </p>
          <p className="muted">
            This standalone prototype uses procedural paper models. Every paper
            hinge follows your hand. Abu Dhabi and Dubai share the same book.
            When fully open, use Next or Previous to turn the inner page.
          </p>
        </Modal>
      )}
      {modal === "settings" && (
        <Modal
          title="Make yourself comfortable."
          onClose={() => setModal(null)}
        >
          <p className="modal-intro">
            A few thoughtful adjustments for your device and the way you like to
            explore.
          </p>
          <label className="setting-row">
            <span>
              <strong>Reduced motion</strong>
              <small>
                {systemReduced
                  ? "Enabled by your device preference."
                  : "Keep the experience still. Paper always follows your hand."}
              </small>
            </span>
            <input
              type="checkbox"
              checked={systemReduced || reduced}
              disabled={systemReduced}
              onChange={(e) => setReduced(e.target.checked)}
            />
          </label>
          <label className="setting-row">
            <span>
              <strong>Lighter rendering</strong>
              <small>
                Lower resolution and simpler shadows for smaller devices.
              </small>
            </span>
            <input
              type="checkbox"
              checked={lowPower}
              onChange={(e) => setLowPower(e.target.checked)}
            />
          </label>
          <p className="muted">
            Drag the cover to open · Reverse to close · Release to pause
            <br />
            Focus the opening meter and use arrow keys. Home closes; End opens.
          </p>
        </Modal>
      )}
    </>
  );
}
