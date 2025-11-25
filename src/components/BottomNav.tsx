import React from "react";
import { Home, Book as BookIcon, Trophy, User } from "lucide-react";
import type { Screen } from "../types";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;

}

export const BottomNavScreen: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, }) => (
  <nav className="fixed bottom-0 left-0 w-full shadow-lg bg-white border-t border-purple-100 py-3 flex justify-around text-gray-600 z-50">
    <button
      onClick={() => onNavigate("home")}
      className={`flex flex-col items-center ${
        currentScreen === "home" ? "text-purple-600" : "text-gray-500"
      }`}
    >
      <Home size={24} />
      <span className="text-xs mt-1 font-semibold">Home</span>
    </button>

    <button
      onClick={() => onNavigate("storybooks")}
      className={`flex flex-col items-center ${
        currentScreen === "storybooks" ? "text-purple-600" : "text-gray-500"
      }`}
    >
      <BookIcon size={24} />
      <span className="text-xs mt-1 font-semibold">Books</span>
    </button>

    <button
      onClick={() => onNavigate("leaderboard")}
      className={`flex flex-col items-center ${
        currentScreen === "leaderboard" ? "text-purple-600" : "text-gray-500"
      }`}
    >
      <Trophy size={24} />
      <span className="text-xs mt-1 font-semibold">Leaderboard</span>
    </button>

    <button
      onClick={() => onNavigate("profile")}
      className={`flex flex-col items-center ${
        currentScreen === "profile" ? "text-purple-600" : "text-gray-500"
      }`}
    >
      <User size={24} />
      <span className="text-xs mt-1 font-semibold">Profile</span>
    </button>
  </nav>
);
