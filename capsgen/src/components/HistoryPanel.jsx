import { memo } from "react";

function HistoryPanel({ results }) {
  return (
    <section className="panelCard glassPanel h-100">
      <div className="panelInner">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="sectionTitle mb-0">Recent Generations</h2>
            <p className="sectionText mb-0">Latest 5 generated titles in this bento workspace.</p>
          </div>
          {/* <span className="badge text-bg-light panelBadge">{results.length}</span> */}
        </div>

        {results.length === 0 ? (
          <p className="sectionText mb-0">Each generated batch is stored locally for quick review.</p>
        ) : (
          <ol className="historyList mb-0">
            {results.slice(0, 5).map((result) => (
              <li key={result.id}>
                <span className="historyTitle">{result.title}</span>
                <span className="historyMeta">{result.meta.outputType.name}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export default memo(HistoryPanel);
