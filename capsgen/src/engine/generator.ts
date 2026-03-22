import { domains, outputTypes, problemTypes, technologies, templates } from "../data/index.ts";

const TOKEN_REGEX = /(\{[a-z]+\})/g;

const lookups = {
  domains: toLookup(domains),
  technologies: toLookup(technologies),
  problemTypes: toLookup(problemTypes),
  outputTypes: toLookup(outputTypes),
};

export const DEFAULT_FILTERS = {
  domainId: "",
  technologyId: "",
  outputTypeId: "",
  seed: "",
  count: 5,
};

export const FILTER_OPTIONS = {
  domains,
  technologies,
  outputTypes,
};

function toLookup(entries) {
  return Object.fromEntries(entries.map((entry) => [entry.id, entry]));
}

function clampCount(count) {
  return Math.min(10, Math.max(3, Number.isFinite(count) ? count : DEFAULT_FILTERS.count));
}

function hashSeed(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seedText = "") {
  let seed = hashSeed(seedText || `${Date.now()}`);

  return () => {
    seed += 0x6d2b79f5;
    let temp = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    temp ^= temp + Math.imul(temp ^ (temp >>> 7), 61 | temp);
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(list, random) {
  return list[Math.floor(random() * list.length)];
}

function resolveDomainOptions(domainId) {
  if (domainId && lookups.domains[domainId]) {
    return [lookups.domains[domainId]];
  }

  return domains;
}

function resolveTechnologyOptions(domain, technologyId) {
  const domainTechnologies = domain.technologyIds
    .map((id) => lookups.technologies[id])
    .filter(Boolean);

  if (technologyId && lookups.technologies[technologyId]) {
    const selected = lookups.technologies[technologyId];

    return domainTechnologies.some((entry) => entry.id === selected.id)
      ? [selected]
      : [selected, ...domainTechnologies].filter(
          (entry, index, list) => list.findIndex((item) => item.id === entry.id) === index
        );
  }

  return domainTechnologies;
}

function resolveProblemOptions(domain) {
  return domain.problemTypeIds.map((id) => lookups.problemTypes[id]).filter(Boolean);
}

function resolveOutputOptions(outputTypeId) {
  if (outputTypeId && lookups.outputTypes[outputTypeId]) {
    return [lookups.outputTypes[outputTypeId]];
  }

  return outputTypes;
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function valueForToken(token, option) {
  if (token === "technology") return option.name;
  if (token === "problem") return option.phrase;
  if (token === "output") return option.suffix;
  return option.name;
}

function buildPart(token, option, alternatives) {
  return {
    type: "token",
    token,
    label: titleCase(token),
    optionId: option.id,
    value: valueForToken(token, option),
    alternatives: alternatives.map((entry) => ({
      id: entry.id,
      value: valueForToken(token, entry),
    })),
  };
}

function normalizeParts(parts) {
  const title = parts
    .map((part) => part.value)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    parts: parts.map((part) => ({ ...part })),
  };
}

function composeParts(template, selections, alternatives) {
  const pieces = template.split(TOKEN_REGEX).filter(Boolean);

  return pieces.map((piece) => {
    if (!piece.startsWith("{")) {
      return { type: "text", value: piece };
    }

    const token = piece.replace(/[{}]/g, "");
    return buildPart(token, selections[token], alternatives[token]);
  });
}

function buildResult(index, selections, template, alternatives) {
  const { title, parts } = normalizeParts(composeParts(template, selections, alternatives));

  return {
    id: `${selections.domain.id}-${selections.technology.id}-${selections.problem.id}-${selections.output.id}-${index}`,
    title,
    template,
    parts,
    meta: {
      domain: selections.domain,
      technology: selections.technology,
      problemType: selections.problem,
      outputType: selections.output,
    },
  };
}

export function buildGenerationRequest(filters = {}) {
  const request = {
    ...DEFAULT_FILTERS,
    ...filters,
    count: clampCount(filters.count ?? DEFAULT_FILTERS.count),
  };

  const selectedDomain = request.domainId ? lookups.domains[request.domainId] : null;
  const selectedTechnology = request.technologyId
    ? lookups.technologies[request.technologyId]
    : null;
  const selectedOutput = request.outputTypeId
    ? lookups.outputTypes[request.outputTypeId]
    : null;

  return {
    ...request,
    domainLabel: selectedDomain?.name || "Any domain",
    technologyLabel: selectedTechnology?.name || "Any technology",
    outputTypeLabel: selectedOutput?.name || "Any output",
  };
}

export function generateTitles(request = buildGenerationRequest()) {
  const random = createSeededRandom(request.seed || JSON.stringify(request));
  const results = [];

  for (let index = 0; index < request.count; index += 1) {
    const domain = pickOne(resolveDomainOptions(request.domainId), random);
    const technologyOptions = resolveTechnologyOptions(domain, request.technologyId);
    const problemOptions = resolveProblemOptions(domain);
    const outputOptions = resolveOutputOptions(request.outputTypeId);
    const template = pickOne(templates, random);

    const selections = {
      domain,
      technology: pickOne(technologyOptions, random),
      problem: pickOne(problemOptions, random),
      output: pickOne(outputOptions, random),
    };

    const alternatives = {
      domain: resolveDomainOptions(""),
      technology: resolveTechnologyOptions(domain, ""),
      problem: problemOptions,
      output: resolveOutputOptions(""),
    };

    results.push(buildResult(index, selections, template, alternatives));
  }

  return results;
}

function replaceTokenInParts(parts, token, nextOption) {
  return parts.map((part) =>
    part.type === "token" && part.token === token
      ? {
          ...part,
          optionId: nextOption.id,
          value: nextOption.value,
        }
      : part
  );
}

function updateMeta(result, token, nextOptionId) {
  if (token === "technology") {
    return {
      ...result.meta,
      technology: lookups.technologies[nextOptionId],
    };
  }

  if (token === "problem") {
    return {
      ...result.meta,
      problemType: lookups.problemTypes[nextOptionId],
    };
  }

  if (token === "output") {
    return {
      ...result.meta,
      outputType: lookups.outputTypes[nextOptionId],
    };
  }

  return {
    ...result.meta,
    domain: lookups.domains[nextOptionId],
  };
}

export function swapTokenValue(result, token) {
  const tokenPart = result.parts.find((part) => part.type === "token" && part.token === token);

  if (!tokenPart || tokenPart.alternatives.length <= 1) {
    return result;
  }

  const currentIndex = tokenPart.alternatives.findIndex(
    (option) => option.id === tokenPart.optionId
  );
  const nextOption = tokenPart.alternatives[(currentIndex + 1) % tokenPart.alternatives.length];
  const nextParts = replaceTokenInParts(result.parts, token, nextOption);

  return {
    ...result,
    ...normalizeParts(nextParts),
    meta: updateMeta(result, token, nextOption.id),
  };
}

export function hydrateStoredResults(items = []) {
  return items.map((item) => ({
    ...item,
    parts: item.parts || [],
  }));
}

export function renderTemplate(template, selections) {
  return template.replace(TOKEN_REGEX, (match) => {
    const token = match.replace(/[{}]/g, "");
    return selections[token]?.name || "";
  });
}
