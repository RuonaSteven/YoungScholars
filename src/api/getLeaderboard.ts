// api/getLeaderboard.ts
import type { Child } from "../types";

export async function getLeaderboard(): Promise<Child[]> {
  // Replace below with your real API call

  const res = await fetch("/api/leaderboard"); // Django, Node, Supabase, anything
  if (!res.ok) throw new Error("Failed to load leaderboard");

  const data: Child[] = await res.json();
  return data;
}
