import React from "react";
import { Trophy } from "lucide-react";
import type { Child, Screen, } from "../types";
import { BottomNavScreen } from "./BottomNav";

interface LeaderboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

// Helper: sort children by booksRead descending
const sortLeaderboard = (children: Child[]) =>
  [...children].sort((a, b) => (b.booksRead ?? 0) - (a.booksRead ?? 0));

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onNavigate }) => {
  // Dummy leaderboard data
  const leaderboard: Child[] = [
   {
        id: 1,
        firstName: "Christiana",
        lastName: "Okafor",
        age: 10,
        parentId: 1,
        avatar: "/avatars/girl.png",
        booksRead: 1450,
        nickName: "Christiana",
        streakDays: 0,
        totalReadingTime: 0,
        readingLevel: "Read-along",
        favoriteBooks: [],
        latestBadge: { 
          id: "1", 
          title: "Gold", 
          description: "Gold Badge", 
          icon: "🏆", 
          color: "#FFD700", 
          condition: (child) => true 
        }
},

 {
        id: 2,
        firstName: "Daniel",
        lastName: "James",
        age: 9,
        parentId: 2,
        avatar: "/avatars/boy1.png",
        booksRead: 1390,
        nickName: "Daniel",
        streakDays: 0,
        totalReadingTime: 0,
        readingLevel: "Independent-reading",
        favoriteBooks: [],
        latestBadge: { 
          id: "1", 
          title: "Gold", 
          description: "Gold Badge", 
          icon: "🏆", 
          color: "#FFD700", 
          condition: (child) => true 
        }
},

 {
        id: 3,
        firstName: "Aisha",
        lastName: "Buhari",
        age: 5,
        parentId: 1,
        avatar: "/avatars/girl.png",
        booksRead: 1930,
        nickName: "Aisha",
        streakDays: 0,
        totalReadingTime: 0,
        readingLevel: "Independent-reading",
        favoriteBooks: [],
        latestBadge: { 
          id: "1", 
          title: "Gold", 
          description: "Gold Badge", 
          icon: "🏆", 
          color: "#FFD700", 
          condition: (child) => true 
        }
},

 {
        id: 4,
        firstName: "Emeka",
        lastName: "Okafor",
        age: 10,
        parentId: 1,
        avatar: "/avatars/boy2.png",
        booksRead: 1450,
        nickName: "Emeka",
        streakDays: 0,
        totalReadingTime: 0,
        readingLevel: "Guided-reading",
        favoriteBooks: [],
        latestBadge: { 
          id: "1", 
          title: "Gold", 
          description: "Gold Badge", 
          icon: "🏆", 
          color: "#FFD700", 
          condition: (child) => true 
        }
      }
    ];

  const sortedLeaderboard = sortLeaderboard(leaderboard);

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
        {sortedLeaderboard.slice(0, 3).map((user, index) => (
          <div key={user.nickName || user.firstName} className="flex flex-col items-center">
            <div
              className={`relative w-20 h-20 rounded-full shadow-lg border-4 overflow-hidden ${
                index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-300" : "border-amber-700"
              }`}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 text-gray-500 font-bold w-full h-full">
                  {user.firstName.charAt(0)}
                </div>
              )}
              <span className="absolute -top-3 -right-3 text-2xl">{user.latestBadge?.icon ?? "🏅"}</span>
            </div>
            <p className="mt-2 font-semibold">{user.firstName}</p>
            <p className="text-sm text-gray-500">{user.booksRead ?? 0} pts</p>
          </div>
        ))}
      </section>

      {/* Remaining Leaderboard */}
      <section className="mt-10 px-6 mb-20">
        {sortedLeaderboard.slice(3).map((user, index) => (
          <div key={user.nickName || user.firstName} className="flex items-center bg-white rounded-2xl shadow mb-3 p-3">
            <span className="text-xl font-bold text-purple-600 w-6 text-center">{index + 4}</span>
            <div className="w-12 h-12 rounded-full overflow-hidden ml-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
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
