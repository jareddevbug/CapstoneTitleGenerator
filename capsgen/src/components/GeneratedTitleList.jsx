import { memo } from "react";
import GeneratedTitleCard from "./GeneratedTitleCard.jsx";

function GeneratedTitleList({ results, favoriteIds, onSwapToken, onToggleFavorite, request }) {
  return (
    <section className="panelCard glassPanel h-100">
      <div className="panelInner panelInnerLarge">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h2 className="sectionTitle">Generated Titles</h2>
            <p className="sectionText mb-0">
              Click highlighted title fragments to rotate alternatives for that token.
            </p>
          </div>
          {/* <div className="requestMeta">
            <span>{request.domainLabel}</span>
            <span>{request.technologyLabel}</span>
            <span>{request.outputTypeLabel}</span>
          </div> */}
        </div>

        {results.length === 0 ? (
          <div className="emptyState">
            <h3>Start with a generated batch</h3>
            <p className="mb-0">
              Choose filters on the left, then create a set of capstone ideas you can copy,
              favorite, and refine.
            </p>
          </div>
        ) : (
          <div className="titleBentoList">
            {results.map((result) => (
              <GeneratedTitleCard
                key={result.id}
                result={result}
                isFavorite={favoriteIds.has(result.id)}
                onSwapToken={onSwapToken}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(GeneratedTitleList);
