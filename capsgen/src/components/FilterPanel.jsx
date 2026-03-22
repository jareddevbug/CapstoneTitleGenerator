import { memo } from "react";

function FilterPanel({
  filters,
  options,
  onChange,
  onGenerate,
  onRegenerate,
  onReset,
}) {
  return (
    <section className="panelCard glassPanel sticky-xl-top h-100">
      <div className="panelInner">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h2 className="sectionTitle">Generator Controls</h2>
            <p className="sectionText mb-0">
              Narrow the domain, technology, and output type before generating.
            </p>
          </div>
          <span className="badge text-bg-light panelBadge">{filters.count} results</span>
        </div>

        <div className="compactGrid">
          <div className="controlBlock">
            <label htmlFor="domainFilter" className="form-label">
              Domain
            </label>
            <select
              id="domainFilter"
              className="form-select"
              value={filters.domainId}
              onChange={(event) => onChange("domainId", event.target.value)}
            >
              <option value="">Any domain</option>
              {options.domains.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="controlBlock">
            <label htmlFor="technologyFilter" className="form-label">
              Technology
            </label>
            <select
              id="technologyFilter"
              className="form-select"
              value={filters.technologyId}
              onChange={(event) => onChange("technologyId", event.target.value)}
            >
              <option value="">Any technology</option>
              {options.technologies.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="controlBlock">
            <label htmlFor="outputFilter" className="form-label">
              Output type
            </label>
            <select
              id="outputFilter"
              className="form-select"
              value={filters.outputTypeId}
              onChange={(event) => onChange("outputTypeId", event.target.value)}
            >
              <option value="">Any output</option>
              {options.outputTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="controlBlock">
            <label htmlFor="seedFilter" className="form-label">
              Seed
            </label>
            <input
              id="seedFilter"
              className="form-control"
              placeholder="Optional deterministic seed"
              value={filters.seed}
              onChange={(event) => onChange("seed", event.target.value)}
            />
          </div>

          <div className="controlBlock controlWide">
            <div className="d-flex justify-content-between align-items-center gap-3">
              <label htmlFor="countFilter" className="form-label mb-0">
                Number of titles
              </label>
              <span className="countPill">{filters.count}</span>
            </div>
            <input
              id="countFilter"
              type="range"
              className="form-range"
              min="3"
              max="10"
              value={filters.count}
              onChange={(event) => onChange("count", Number(event.target.value))}
            />
            <div className="filterHint">
              Keep a seed for reproducible results, or leave it blank for a fresh mix.
            </div>
          </div>
        </div>

        <div className="actionRow mt-4">
          <button type="button" className="btn btn-success btn-lg" onClick={onGenerate}>
            Generate Titles
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onRegenerate}>
            Regenerate Set
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onReset}>
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(FilterPanel);
