import { describe, expect, it } from "vitest";
import {
  filterTitlesByGenreAndDevice,
  getUniqueGenres,
  pickRandomWithoutImmediateRepeats,
} from "./titleGenerator";

const sample = [
  { title: "A", genre: "Health", devices: ["mobile app", "iot sensor"] },
  { title: "B", genre: "Health", devices: ["web app"] },
  { title: "C", genre: "Retail", devices: ["barcode scanner"] },
];

describe("filterTitlesByGenreAndDevice", () => {
  it("filters by genre only", () => {
    const results = filterTitlesByGenreAndDevice(sample, "Health", "");
    expect(results).toHaveLength(2);
  });

  it("filters by genre and device query", () => {
    const results = filterTitlesByGenreAndDevice(sample, "Health", "mobile");
    expect(results).toEqual([sample[0]]);
  });

  it("matches device query case-insensitively", () => {
    const results = filterTitlesByGenreAndDevice(sample, "", "BARCODE");
    expect(results).toEqual([sample[2]]);
  });
});

describe("pickRandomWithoutImmediateRepeats", () => {
  it("returns null item on empty list", () => {
    const result = pickRandomWithoutImmediateRepeats([], []);
    expect(result.item).toBeNull();
    expect(result.nextUsedIndices).toEqual([]);
  });

  it("avoids used indices before reset", () => {
    const list = ["first", "second", "third"];
    const result = pickRandomWithoutImmediateRepeats(list, [0, 1], () => 0);
    expect(result.item).toBe("third");
    expect(result.nextUsedIndices).toEqual([0, 1, 2]);
  });

  it("resets used indices when pool is exhausted", () => {
    const list = ["first", "second"];
    const result = pickRandomWithoutImmediateRepeats(list, [0, 1], () => 0);
    expect(result.item).toBe("first");
    expect(result.nextUsedIndices).toEqual([0]);
  });
});

describe("getUniqueGenres", () => {
  it("returns sorted unique genres", () => {
    const results = getUniqueGenres(sample);
    expect(results).toEqual(["Health", "Retail"]);
  });
});
