import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import type { Screen } from "../types"; // adjust path if needed

type HomeScreenProps = {
  user: { firstName: string; lastName: string; avatar?: string };
  onNavigate: (screen: Screen, data?: any) => void;
};

type Category = "storybooks" | "comics" | "academics";

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<Category>("storybooks");

  const categories = [
    { id: "storybooks", name: "Storybooks", icon: "📖", color: "bg-blue-500" },
    { id: "comics", name: "Comics", icon: "🎨", color: "bg-yellow-500" },
    { id: "academics", name: "Academics", icon: "📘", color: "bg-green-500" },
  ];

  const books: Record<
    Category,
    { id: number; title: string; author: string; description: string; cover: string; difficulty: string }[]
  > = {
    storybooks: [
      { id: 1, title: "The Magic Forest", author: "Emma Stone", description: "A wonderful adventure in an enchanted forest", cover: "🌳", difficulty: "Easy" },
      { id: 2, title: "Space Explorers", author: "John Cosmos", description: "Journey to the stars with brave astronauts", cover: "🚀", difficulty: "Medium" },
      { id: 3, title: "Ocean Friends", author: "Marina Blue", description: "Meet amazing sea creatures underwater", cover: "🐠", difficulty: "Easy" },
      { id: 4, title: "Dragon Tales", author: "Fire Writer", description: "Friendly dragons and their magical adventures", cover: "🐉", difficulty: "Medium" },
    ],
    comics: [
      { id: 5, title: "Super Kids", author: "Hero Comics", description: "Children with superpowers save the day", cover: "🦸", difficulty: "Easy" },
      { id: 6, title: "Animal Heroes", author: "Zoo Stories", description: "Animals working together to solve problems", cover: "🦁", difficulty: "Easy" },
      { id: 7, title: "Time Travel Fun", author: "Clock Comics", description: "Adventures through different time periods", cover: "⏰", difficulty: "Medium" },
    ],
    academics: [
      { id: 8, title: "Math Magic", author: "Number Wizard", description: "Make math fun with magical equations", cover: "🔢", difficulty: "Medium" },
      { id: 9, title: "Science Lab", author: "Dr. Experiment", description: "Discover amazing scientific facts", cover: "🧪", difficulty: "Hard" },
      { id: 10, title: "History Heroes", author: "Time Scholar", description: "Learn about famous people from the past", cover: "🏛️", difficulty: "Medium" },
    ],
  };

  const currentBooks = books[activeCategory];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-3 border-white">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.firstName} />
              ) : (
                <AvatarFallback className="bg-white text-blue-600 text-2xl">
                  {user.firstName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">Hi, {user.firstName}! 👋</h2>
              <p className="text-blue-100 text-lg">Ready for an adventure?</p>
            </div>
          </div>
          <Button
            onClick={() => onNavigate("profile")}
            variant="ghost"
            className="text-white hover:bg-white/20 p-3 rounded-full min-h-[48px] min-w-[48px]"
          >
            <span className="text-2xl">⚙️</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 py-8">
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id as Category)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-3xl font-semibold transition-all text-lg min-h-[56px] ${
                activeCategory === category.id
                  ? `${category.color} text-white shadow-xl scale-105`
                  : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 active:scale-95"
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 gap-6">
          {currentBooks.map((book) => (
            <Card
              key={book.id}
              className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102 border-2 border-gray-100 active:scale-98"
            >
              <div className="flex items-start space-x-5">
                <div className="w-20 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                  {book.cover}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-xl">{book.title}</h3>
                    <Badge
                      className={`text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(book.difficulty)}`}
                    >
                      {book.difficulty}
                    </Badge>
                  </div>
                  <p className="text-base text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-base text-gray-500 mb-4 leading-relaxed">{book.description}</p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => onNavigate("bookDetails", book)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl text-base font-semibold shadow-lg min-h-[48px] active:scale-95"
                    >
                      Read
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl text-base min-h-[48px] active:scale-95"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
