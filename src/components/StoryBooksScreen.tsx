import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { ArrowLeft } from "lucide-react";
import type { Screen, Book } from "../types";

interface StoryBooksScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

export const StoryBooksScreen: React.FC<StoryBooksScreenProps> = ({ onBack, onNavigate }) => {
  // --------------------
  // Sample Books (with age + difficulty)
  // --------------------
  const books = [
    { id: 1, title: "The Magic Forest", author: "Emma Stone", description: "A wonderful adventure in an enchanted forest", cover: "🌳", difficulty: "Easy", ageRange: [3, 4] },
    { id: 2, title: "Space Explorers", author: "John Cosmos", description: "Journey to the stars with brave astronauts", cover: "🚀", difficulty: "Medium", ageRange: [5, 6] },
    { id: 3, title: "Ocean Friends", author: "Marina Blue", description: "Meet amazing sea creatures underwater", cover: "🐠", difficulty: "Easy", ageRange: [3, 4] },
    { id: 4, title: "Dragon Tales", author: "Fire Writer", description: "Friendly dragons and their magical adventures", cover: "🐉", difficulty: "Medium", ageRange: [5, 6] },
    { id: 5, title: "Jungle Quest", author: "Tola Ade", description: "Explore the wild jungle with friends", cover: "🦁", difficulty: "Hard", ageRange: [7, 8] },
  ];

  // --------------------
  // State for filters
  // --------------------
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // --------------------
  // Helpers
  // --------------------
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const ageGroups = ["all", "3-4", "5-6", "7-8"];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  // --------------------
  // Filtered Books
  // --------------------
  const filteredBooks = books.filter((book) => {
    const matchesAge =
      selectedAge === "all" ||
      (book.ageRange[0] === Number(selectedAge.split("-")[0]) &&
        book.ageRange[1] === Number(selectedAge.split("-")[1]));
    const matchesDifficulty = selectedDifficulty === "all" || book.difficulty === selectedDifficulty;
    return matchesAge && matchesDifficulty;
  });

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --------------------
  // UI
  // --------------------
  // UI
  // --------------------
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-yellow-50 pb-12">
       <header className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-6 py-8 rounded-b-3xl shadow-lg relative">
      <Button
        onClick={onBack}
        variant="ghost"
        className="absolute left-4 top-3 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95"
      >
        <ArrowLeft className="w-7 h-7" />
         Back
      </Button>
        <h2 className="text-4xl font-bold white mt-6">Storybooks</h2>

      
    </header>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-8">
        <Select onValueChange={setSelectedAge}>
          <SelectTrigger className="w-full sm:w-40 border-purple-300">
            <SelectValue placeholder="Select Age" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((age) => (
              <SelectItem key={age} value={age}>
                {age === "all" ? "All Ages" : `Ages ${age}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-40 border-purple-300">
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {diff === "all" ? "All Levels" : diff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102 border-2 border-gray-100 active:scale-98"
          >
            <div className="flex items-start space-x-5">
              <div className="w-20 h-24 bg-linear-to-br from-blue-200 to-purple-200 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                {book.cover}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-xl">{book.title}</h3>
                  <Badge className={`text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(book.difficulty)}`}>
                    {book.difficulty}
                  </Badge>
                </div>
                <p className="text-base text-gray-600 mb-2">by {book.author}</p>
                <p className="text-base text-gray-500 mb-4 leading-relaxed">{book.description}</p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => onNavigate("bookDetails", { book })}
                    className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl text-base font-semibold shadow-lg min-h-12 active:scale-95"
                  >
                    Read
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl text-base min-h-12 active:scale-95"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">No books found for this selection.</p>
      )}
    </div>
  );
};
