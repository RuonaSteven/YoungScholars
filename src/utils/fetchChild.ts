// src/utils/fetchChild.ts
import type { Child } from "../types";

/**
 * Fetch child data from backend API
 */
export async function fetchChild(childId: number): Promise<Child> {
  try {
    const response = await fetch(`https://your-backend.com/api/children/${childId}`);
    if (!response.ok) throw new Error("Failed to fetch child data");
    const data: Child = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
