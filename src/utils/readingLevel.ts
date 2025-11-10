import type { ReadingLevel } from "../types";

export const ReadingLevels: ReadingLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Super Advanced",
  "Extraordinary",
];

export function getNextReadingLevel(current?: ReadingLevel): ReadingLevel {
  const safeCurrent = current || 'Beginner';
  const index = ReadingLevels.indexOf(safeCurrent);
  return ReadingLevels[index + 1] || safeCurrent;
}

