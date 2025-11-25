import type { ReadingLevel } from "../types";

export const ReadingLevelLabels: Record<ReadingLevel, string> = {
  "Read-along": "Beginner",
  "Guided-reading": "Intermediate",
  "Independent-reading": "Advanced",
};

// Ordered array of internal levels
const ReadingLevelsArray: ReadingLevel[] = ["Read-along", "Guided-reading", "Independent-reading"];

/**
 * Returns the next internal reading level key
 */
export function getNextReadingLevel(current?: ReadingLevel): ReadingLevel {
  const safeCurrent = current || "Read-along";
  const index = ReadingLevelsArray.indexOf(safeCurrent);
  return ReadingLevelsArray[index + 1] || safeCurrent;
}

/**
 * Returns the display label of the next reading level
 */
export function getNextReadingLevelLabel(current?: ReadingLevel): string {
  const nextLevel = getNextReadingLevel(current);
  return ReadingLevelLabels[nextLevel];
}
