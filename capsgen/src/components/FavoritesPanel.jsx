import { memo } from "react";

function FavoritesPanel({ results, onSwapToken, onToggleFavorite }) {
  return (
    <section className="panelCard glassPanel h-100">
      <div className="panelInner">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="sectionTitle mb-0">Bookmarked Titles</h2>
          <span className="badge text-bg-light panelBadge">{results.length}</span>
        </div>

        {results.length === 0 ? (
          <p className="sectionText mb-0">Saved titles will stay here across refreshes.</p>
        ) : (
          <div className="list-group listGroupFlush">
            {results.map((result) => (
              <div key={result.id} className="list-group-item favoriteItem">
                <button
                  type="button"
                  className="favoriteTitleButton"
                  onClick={() => onSwapToken(result.id, "technology")}
                >
                  {result.title}
                </button>
                <div className="d-flex justify-content-between align-items-center gap-2 mt-2">
                  <small className="text-secondary">{result.meta.domain.name}</small>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none p-0"
                    onClick={() => onToggleFavorite(result)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(FavoritesPanel);
