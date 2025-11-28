import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Heart, Download, Play } from "lucide-react";
import type { Book, ChildWithUI, Screen } from "../types";

interface BookDetailsScreenProps {
  book: Book | null;
  onNavigate: (screen: Screen, data?: { book?: Book; child?: ChildWithUI }) => void;
  onBack: () => void;
}

export const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({
  book,
  onNavigate,
  onBack,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Book not found</p>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-500 to-white px-6 py-8 pb-16">
      {/* Header */}
      <header className="relative bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <Button
          onClick={onBack}
          variant="ghost"
          className="absolute left-4 top-3 flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Book Details</h1>
      </header>

      <div className="px-6 py-8">
        {/* Book Cover + Info */}
        <Card className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100">
          <div className="text-center mb-8">
            {/* COVER IMAGE */}
            <div className="w-40 h-48 rounded-3xl overflow-hidden shadow-xl mx-auto mb-6 bg-gray-200">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  📚
                </div>
              )}
            </div>

            {/* Title + Favorite */}
            <div className="flex items-center justify-center space-x-3 mb-3">
              <h2 className="font-bold text-gray-800 text-3xl">{book.title}</h2>

              <Button
                onClick={() => setIsFavorited(!isFavorited)}
                variant="ghost"
                className="p-2 rounded-full hover:bg-pink-100"
              >
                <Heart
                  className={`w-7 h-7 transition-colors ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </Button>
            </div>

            <p className="text-gray-600 mb-3 text-lg">by {book.author}</p>

            {/* Reading Level */}
            <div className="flex justify-center gap-3 mt-3">
              <Badge className="px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                Level: {book.level}
              </Badge>

              <Badge className="px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                Ages {book.ageRange[0]} - {book.ageRange[1]}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 text-2xl">
              About this book
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {book.description}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-3xl p-6 mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📖</div>
                <div className="text-base text-gray-600 font-medium">25 Pages</div>
              </div>
              <div>
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-base text-gray-600 font-medium">15 mins</div>
              </div>
              <div>
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-base text-gray-600 font-medium">4.8 Rating</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => onNavigate("reading", { book })}
              className="w-full py-6 bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-3xl shadow-xl font-semibold text-xl active:scale-95"
            >
              <Play className="w-6 h-6 mr-3" />
              Read Now
            </Button>

            <Button
              variant="outline"
              className="w-full py-6 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 rounded-3xl shadow-lg font-semibold text-xl active:scale-95"
            >
              <Download className="w-6 h-6 mr-3" />
              Download for Offline
            </Button>
          </div>
        </Card>

        {/* Similar Books */}
        <Card className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-2xl">
            You might also like
          </h3>

          <div className="flex space-x-6 overflow-x-auto pb-2">
            {[101, 102, 103].map((id) => (
              <div key={id} className="shrink-0 text-center">
                <div className="w-20 h-24 bg-linear-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3">
                  📘
                </div>
                <p className="text-sm text-gray-600 w-20 font-medium">
                  Sample Book {id}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
