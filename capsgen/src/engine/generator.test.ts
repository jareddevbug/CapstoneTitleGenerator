import { describe, expect, it } from "vitest";
import {
  buildGenerationRequest,
  generateTitles,
  renderTemplate,
  swapTokenValue,
} from "./generator.ts";

describe("generateTitles", () => {
  it("generates deterministic results for the same seed", () => {
    const request = buildGenerationRequest({
      domainId: "healthcare",
      technologyId: "ai",
      outputTypeId: "system",
      seed: "demo-seed",
      count: 3,
    });

    const first = generateTitles(request).map((item) => item.title);
    const second = generateTitles(request).map((item) => item.title);

    expect(first).toEqual(second);
  });

  it("respects constrained filters", () => {
    const request = buildGenerationRequest({
      domainId: "education",
      technologyId: "web",
      outputTypeId: "platform",
      seed: "filtered",
      count: 3,
    });

    const results = generateTitles(request);

    expect(results).toHaveLength(3);
    expect(results.every((item) => item.meta.domain.id === "education")).toBe(true);
    expect(results.every((item) => item.meta.technology.id === "web")).toBe(true);
    expect(results.every((item) => item.meta.outputType.id === "platform")).toBe(true);
  });
});

describe("renderTemplate", () => {
  it("replaces tokens with values", () => {
    const output = renderTemplate("{technology} {output} for {domain}", {
      technology: { name: "AI-Powered" },
      output: { name: "Dashboard" },
      domain: { name: "Healthcare" },
      problem: { name: "Monitoring" },
    });

    expect(output).toBe("AI-Powered Dashboard for Healthcare");
  });
});

describe("swapTokenValue", () => {
  it("cycles token alternatives and updates the rendered title", () => {
    const [result] = generateTitles(
      buildGenerationRequest({
        domainId: "business",
        seed: "swap-check",
        count: 3,
      })
    );

    const updated = swapTokenValue(result, "technology");

    expect(updated.title).not.toBe(result.title);
    expect(updated.meta.technology.id).not.toBe(result.meta.technology.id);
  });
});
