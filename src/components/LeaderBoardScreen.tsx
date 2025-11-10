import React from "react";
import { Home, Book, Trophy, User } from "lucide-react";

export const LeaderboardScreen: React.FC = () => {
  const leaderboard = [
    {
      rank: 1,
      name: "Christiana",
      avatar: "/avatars/girl.png",
      points: 1450,
      badge: "🥇",
    },
    {
      rank: 2,
      name: "Daniel",
      avatar: "/avatars/boy1.png",
      points: 1320,
      badge: "🥈",
    },
    {
      rank: 3,
      name: "Aisha",
      avatar: "/avatars/girl2.png",
      points: 1210,
      badge: "🥉",
    },
    {
      rank: 4,
      name: "Emeka",
      avatar: "/avatars/boy2.png",
      points: 990,
    },
    {
      rank: 5,
      name: "Zainab",
      avatar: "/avatars/girl3.png",
      points: 870,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-linear-to-r from-purple-500 to-purple-700 text-white p-6 rounded-b-3xl shadow-md text-center">
        <Trophy size={40} className="mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-purple-100 text-sm">Top readers this week</p>
      </header>

      {/* Top 3 Readers */}
      <section className="flex justify-around items-end mt-8 px-4">
        {leaderboard.slice(0, 3).map((user) => (
          <div key={user.rank} className="flex flex-col items-center">
            <div
              className={`relative w-20 h-20 rounded-full shadow-lg border-4 ${
                user.rank === 1
                  ? "border-yellow-400"
                  : user.rank === 2
                  ? "border-gray-300"
                  : "border-amber-700"
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -top-3 -right-3 text-2xl">
                {user.badge}
              </span>
            </div>
            <p className="mt-2 font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.points} pts</p>
          </div>
        ))}
      </section>

      {/* Leaderboard List */}
      <section className="mt-10 px-6 mb-20">
        {leaderboard.slice(3).map((user) => (
          <div
            key={user.rank}
            className="flex items-center bg-white rounded-2xl shadow mb-3 p-3"
          >
            <span className="text-xl font-bold text-purple-600 w-6 text-center">
              {user.rank}
            </span>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full ml-3 object-cover"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.points} pts</p>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 flex justify-around text-gray-600">
        <button className="flex flex-col items-center">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <Book size={24} />
          <span className="text-xs mt-1">Books</span>
        </button>
        <button className="flex flex-col items-center text-purple-600">
          <Trophy size={24} />
          <span className="text-xs mt-1 font-semibold">Leaderboard</span>
        </button>
        <button className="flex flex-col items-center">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};
