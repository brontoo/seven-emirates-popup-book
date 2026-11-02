import { adjacentAvailableChapter } from "../book/pageTurn";
import { chapters } from "../data/chapters";
import { STAGES } from "../chapters/abuDhabi/mechanics";
export default function MechanismInspector({
  progress,
  onProgress,
  debug,
  setDebug,
  report,
  chapter,
  onChapter,
  turn,
  onTurn,
  onReset,
}) {
  return (
    <aside
      className="mechanism-inspector"
      aria-label="Development mechanism inspector"
    >
      <header>
        <strong>Paper mechanics</strong>
        <span>DEVELOPMENT ONLY</span>
      </header>
      <label>
        Active chapter
        <select
          aria-label="Inspector active chapter"
          value={chapter}
          onChange={(e) => onChapter(Number(e.target.value))}
        >
          {chapters.map(
            (c, i) =>
              c.available && (
                <option key={c.id} value={i}>
                  {c.index} · {c.title}
                </option>
              ),
          )}
        </select>
      </label>
      <label>
        Inner page turn <output>{Math.round(turn.progress * 100)}%</output>
        <input
          aria-label="Inspector page turn"
          disabled={progress < 0.98}
          type="range"
          min="0"
          max="1"
          step=".01"
          value={turn.progress}
          onChange={(e) => onTurn(Number(e.target.value))}
        />
      </label>
      <p className="inspector-route">
        {chapters[turn.from].title} →{" "}
        {
          chapters[
            turn.from === turn.to
              ? adjacentAvailableChapter(chapter, chapters)
              : turn.to
          ].title
        }
      </p>
      <label>
        Build stage
        <select
          value={debug.stage}
          onChange={(e) => setDebug((s) => ({ ...s, stage: e.target.value }))}
        >
          {STAGES.map(([id, label]) => (
            <option key={id} value={id}>
              {chapter === 1 ? label.replace("Mosque", "Museum") : label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Opening <output>{Math.round(progress * 100)}%</output>
        <input
          aria-label="Inspector book opening"
          disabled={turn.active}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => onProgress(Number(e.target.value))}
        />
      </label>
      {["hinges", "axes", "attachments"].map((key, i) => (
        <label className="inspector-toggle" key={key}>
          <input
            type="checkbox"
            checked={!!debug[key]}
            onChange={(e) =>
              setDebug((s) => ({ ...s, [key]: e.target.checked }))
            }
          />
          {["Hinge points", "Fold axes", "Attachment points"][i]}
        </label>
      ))}
      <button onClick={onReset}>Reset to closed</button>
      {report && (
        <div className="inspector-report" role="status">
          <span>
            {report.assemblies} assemblies · {report.vertices} sampled vertices
          </span>
          <strong>
            {report.coverViolations === 0 && report.pageViolations === 0
              ? "Within page / cover envelope"
              : `${report.coverViolations} cover / ${report.pageViolations} page violations`}
          </strong>
          <small>
            Geometric envelope check; not full sheet-to-sheet contact
            simulation.
          </small>
          <details>
            <summary>Assembly diagnostics</summary>
            <pre data-audit>{JSON.stringify(report, null, 2)}</pre>
          </details>
        </div>
      )}
    </aside>
  );
}
