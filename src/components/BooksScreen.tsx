import React from "react";
import type { Screen } from "../types";

interface BooksScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
}

export const BooksScreen: React.FC<BooksScreenProps> = ({ onNavigate, onBack }) => {
  const categories = [
    { name: "StoryBooks", label: "📖 Storybooks" },
    { name: "Comics", label: "📚 Comics" },
    { name: "Academic", label: "🔬 Academic" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-r from-purple-500 to-purple-700 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Choose a Category</h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onNavigate("books", { category: category.name })}
            className="bg-white text-purple-700 rounded-2xl py-4 text-lg font-semibold shadow hover:scale-105 transition-all duration-200"
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
