import React, { useEffect, useState, useMemo } from "react";
import { Trophy, Loader2 } from "lucide-react";
import type { Child, Screen } from "../types";
import { BottomNavScreen } from "./BottomNav";
import { getLeaderboard } from "../api/getLeaderboard";

interface LeaderboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onNavigate }) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard from backend
  useEffect(() => {
    (async () => {
      try {
        const data = await getLeaderboard();
        setChildren(data);
      } catch (err) {
        setError("Unable to load leaderboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Memoize sorting
  const sorted = useMemo(
    () =>
      [...children].sort(
        (a, b) => (b.booksRead ?? 0) - (a.booksRead ?? 0)
      ),
    [children]
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading leaderboard…</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 text-center px-4">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl shadow"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-b-3xl shadow-md text-center">
        <Trophy size={40} className="mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-purple-100 text-sm">Top readers this week</p>
      </header>

      {/* Top 3 */}
      <section className="flex justify-around items-end mt-8 px-4">
        {sorted.slice(0, 3).map((user, index) => (
          <div key={user.id} className="flex flex-col items-center animate-fade-in">
            <div
              className={`relative w-20 h-20 rounded-full shadow-lg border-4 overflow-hidden
              ${index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-300" : "border-amber-700"}`}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.firstName}'s avatar`} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 text-gray-500 font-bold w-full h-full">
                  {user.firstName.charAt(0)}
                </div>
              )}

              <span className="absolute -top-3 -right-3 text-2xl">
                {user.latestBadge?.icon ?? "🏅"}
              </span>
            </div>

            <p className="mt-2 font-semibold">{user.firstName}</p>
            <p className="text-sm text-gray-500">{user.booksRead ?? 0} pts</p>
          </div>
        ))}
      </section>

      {/* List */}
      <section className="mt-10 px-6 mb-20">
        {sorted.slice(3).map((user, index) => (
          <div
            key={user.id}
            className="flex items-center bg-white rounded-2xl shadow mb-3 p-3 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <span className="text-xl font-bold text-purple-600 w-6 text-center">
              {index + 4}
            </span>

            <div className="w-12 h-12 rounded-full overflow-hidden ml-3">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.firstName}'s avatar`} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 text-gray-500 font-bold w-full h-full">
                  {user.firstName.charAt(0)}
                </div>
              )}
            </div>

            <div className="ml-4 flex-1">
              <p className="font-semibold">{user.firstName}</p>
              <p className="text-sm text-gray-500">{user.booksRead ?? 0} pts</p>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Navigation */}
      <BottomNavScreen currentScreen="leaderboard" onNavigate={onNavigate} />
    </div>
  );
};
