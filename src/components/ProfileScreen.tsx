import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowLeft, LogOut, Trophy, Clock, BookOpen } from "lucide-react";

export const ProfileScreen = ({ user, onLogout, onBack }: any) => {
  const badges = [
    { id: 1, name: "First Book", icon: "📚", earned: true, description: "Read your first book" },
    { id: 2, name: "Speed Reader", icon: "⚡", earned: true, description: "Read 3 books in one week" },
    { id: 3, name: "Explorer", icon: "🗺️", earned: true, description: "Read books from 3 different categories" },
    { id: 4, name: "Night Owl", icon: "🦉", earned: false, description: "Read for 1 hour after 8 PM" },
    { id: 5, name: "Bookworm", icon: "🐛", earned: false, description: "Read 10 books total" },
    { id: 6, name: "Scholar", icon: "🎓", earned: false, description: "Complete 5 academic books" },
  ];

  const completedBooks = [
    { id: 1, title: "The Magic Forest", cover: "🌳", completedDate: "2 days ago" },
    { id: 2, title: "Space Explorers", cover: "🚀", completedDate: "1 week ago" },
    { id: 3, title: "Ocean Friends", cover: "🐠", completedDate: "2 weeks ago" },
    { id: 4, title: "Super Kids", cover: "🦸", completedDate: "3 weeks ago" },
  ];

  const stats = {
    booksRead: completedBooks.length,
    readingTime: "12 hours",
    favoriteCategory: "Storybooks",
    currentStreak: "5 days",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-3 rounded-full min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="w-12" />
        </div>

        {/* User Info */}
        <div className="text-center">
          <Avatar className="w-24 h-24 border-4 border-white mx-auto mb-4">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-white text-purple-600 text-4xl">{user?.name?.charAt(0) || "YS"}</AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-3xl font-bold mb-2">{user?.name || "Young Reader"}</h2>
          <p className="text-purple-100 text-lg">Reading Explorer</p>
        </div>
      </div>

      {/* Rest of profile content here (stats, badges, books) ... */}
    </div>
  );
};
