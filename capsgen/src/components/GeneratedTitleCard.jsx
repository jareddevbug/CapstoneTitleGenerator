import { memo, useEffect, useState } from "react";

function GeneratedTitleCard({ result, isFavorite, onSwapToken, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.title);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy generated title.", error);
    }
  };

  return (
    <article className="generatedCard">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="flex-grow-1">
          <p className="resultLabel mb-2">Generated concept</p>
          <h3 className="generatedTitle mb-3">
            {result.parts.map((part, index) =>
              part.type === "text" ? (
                <span key={`${result.id}-${index}`}>{part.value}</span>
              ) : (
                <button
                  key={`${result.id}-${part.token}-${index}`}
                  type="button"
                  className="tokenButton"
                  onClick={() => onSwapToken(result.id, part.token)}
                  title={`Replace ${part.label}`}
                >
                  {part.value}
                </button>
              )
            )}
          </h3>
        </div>

        <button
          type="button"
          className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => onToggleFavorite(result)}
        >
          <i className="fa-solid fa-bookmark me-1"></i>
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>

      <div className="metaChips">
        <span className="chip">{result.meta.domain.name}</span>
        <span className="chip">{result.meta.technology.name}</span>
        <span className="chip">{result.meta.problemType.name}</span>
        <span className="chip">{result.meta.outputType.name}</span>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleCopy}>
          <i className={`me-1 fa-${copied ? "solid" : "regular"} fa-copy`}></i>
          {copied ? "Copied" : "Copy title"}
        </button>
      </div>
    </article>
  );
}

export default memo(GeneratedTitleCard);
