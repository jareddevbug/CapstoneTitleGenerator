export const STORAGE_KEY = "capsgen_state_v1";

const normalize = (value) => value.trim().toLowerCase();

export function filterTitlesByGenreAndDevice(allTitles, genre, deviceQuery) {
  const normalizedDevice = normalize(deviceQuery || "");

  return allTitles.filter((entry) => {
    const genreMatch = genre ? entry.genre === genre : true;
    const deviceMatch = normalizedDevice
      ? entry.devices.some((device) => normalize(device).includes(normalizedDevice))
      : true;

    return genreMatch && deviceMatch;
  });
}

export function pickRandomWithoutImmediateRepeats(list, usedIndices = [], randomFn = Math.random) {
  if (!Array.isArray(list) || list.length === 0) {
    return { item: null, pickedIndex: null, nextUsedIndices: [] };
  }

  const validUsed = usedIndices.filter((idx) => Number.isInteger(idx) && idx >= 0 && idx < list.length);
  let available = list.map((_, idx) => idx).filter((idx) => !validUsed.includes(idx));
  let resetUsed = validUsed;

  if (available.length === 0) {
    available = list.map((_, idx) => idx);
    resetUsed = [];
  }

  const pickedIndex = available[Math.floor(randomFn() * available.length)];

  return {
    item: list[pickedIndex],
    pickedIndex,
    nextUsedIndices: [...resetUsed, pickedIndex],
  };
}

export function getUniqueGenres(allTitles) {
  return [...new Set(allTitles.map((entry) => entry.genre))].sort();
}
