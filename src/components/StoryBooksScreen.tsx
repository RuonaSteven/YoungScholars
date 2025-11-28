// src/components/StoryBooksScreen.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "../utils/fetchBooks";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { ArrowLeft } from "lucide-react";
import { BottomNavScreen } from "./BottomNav";
import type { Screen, Book, ReadingLevel } from "../types";

interface StoryBooksScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

// Reading level color helper
const getLevelColor = (level: ReadingLevel | "all") => {
  switch (level) {
    case "Read-along":
      return "bg-green-100 text-green-700";
    case "Guided-reading":
      return "bg-yellow-100 text-yellow-700";
    case "Independent-reading":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const StoryBooksScreen: React.FC<StoryBooksScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  // ---- Filters ----
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const handleDownload = (book: Book) => {
  // TODO: save the book to localStorage / IndexedDB
  console.log("Downloading book:", book.title);
};
  const ageGroups = ["all", "3-4", "5-6", "7-8"];
  const readingLevels: (ReadingLevel | "all")[] = [
    "all",
    "Read-along",
    "Guided-reading",
    "Independent-reading",
  ];

  // ---- Fetch books ----
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery<Book[]>({
    queryKey: ["books", selectedAge, selectedLevel],
    queryFn: () =>
      fetchBooks({
        age: selectedAge === "all" ? undefined : selectedAge,
        readingLevel: selectedLevel === "all" ? undefined : selectedLevel,
      }),
    staleTime: 1000 * 60 * 5,
  });

  // ---- Loading / Error ----
  if (isLoading)
    return <p className="p-6 text-lg text-gray-700">Loading books…</p>;

  if (error)
    return (
      <p className="p-6 text-red-500 text-lg">
        Failed to load books. Please try again.
      </p>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-yellow-50 pb-12">
      {/* Header */}
      <header className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-6 py-8 rounded-b-3xl shadow-lg relative">
        <Button
          onClick={onBack}
          variant="ghost"
          className="absolute left-4 top-3 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95"
        >
          <ArrowLeft className="w-7 h-7" />
          Back
        </Button>

        <h2 className="text-4xl font-bold mt-6">Storybooks</h2>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-8 px-6">
        {/* Age Filter */}
        <Select onValueChange={setSelectedAge} defaultValue="all">
          <SelectTrigger className="w-full sm:w-40 border-purple-300">
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((age) => (
              <SelectItem key={age} value={age}>
                {age === "all" ? "All Ages" : `Ages ${age}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reading Level Filter */}
        <Select onValueChange={setSelectedLevel} defaultValue="all">
          <SelectTrigger className="w-full sm:w-40 border-purple-300">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            {readingLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level === "all" ? "All Levels" : level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {books.map((book) => (
          <Card
            key={book.id}
            className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102 border-2 border-gray-100 active:scale-98"
          >
            <div className="flex items-start space-x-5">
              <div className="w-20 h-24 rounded-2xl overflow-hidden shadow-md bg-gray-200">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    📖
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-xl">
                    {book.title}
                  </h3>

                  <Badge
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getLevelColor(
                      book.level
                    )}`}
                  >
                    {book.level}
                  </Badge>
                </div>

                <p className="text-base text-gray-600 mb-2">
                  by {book.author}
                </p>

                <p className="text-base text-gray-500 mb-4 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => onNavigate("bookDetails", { book })}
                    className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl text-base font-semibold shadow-lg min-h-12 active:scale-95"
                  >
                    Read
                  </Button>

                  <Button
                   onClick={() => handleDownload(book)}
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

      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No books found for this selection.
        </p>
      )}
    <BottomNavScreen currentScreen="storybooks" onNavigate={onNavigate} />

    </div>
  );
};
