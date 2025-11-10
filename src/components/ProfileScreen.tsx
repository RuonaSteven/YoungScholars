// import React from "react";
// import { ArrowLeft, Trophy, BookOpen, Clock } from "lucide-react";
// import type { Screen, Parent, Child } from "../types";
// import { getNextReadingLevel } from "../utils/readingLevel";

// interface ProfileScreenProps {
//   child: Child | null;
//   parent: Parent | null;
//   onLogin: (user: Parent) => void;
//   onNavigate: (screen: Screen, data?: any) => void;
//   onBack: () => void;
//   onLogout: () => void;
// }

// export const ProfileScreen: React.FC<ProfileScreenProps> = ({
//   child,
//   parent,
//   onLogin,
//   onNavigate,
//   onBack,
//   onLogout,
// }) => {
//   return (
//     <div className="min-h-screen bg-purple-50 py-8 px-4">
//       {/* Back Button */}
//       <button
//         onClick={onBack}
//         className="text-purple-600 font-semibold flex items-center gap-2 mb-4"
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       {/* Header */}
//       {child ? (
//         <div className="flex flex-col items-center mb-8">
//           <img
//             src={child.avatar || "https://cdn-icons-png.flaticon.com/512/706/706830.png"}
//             alt="Profile"
//             className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-md"
//           />
//           <h2 className="text-3xl font-bold text-purple-700 mt-3">
//             {child.nickName || `${child.firstName} ${child.lastName}`}
//           </h2>
//           <p className="text-gray-600">Class: {child.age || "N/A"}</p>
//           <p className="text-gray-400 text-sm">
//             Young Scholar since {child.joinedDate || "2025"}
//           </p>
//         </div>
//       ) : (
//         <p className="text-gray-600 text-center mb-8">No child profile available.</p>
//       )}

//       {/* Child Info */}
//       {child && (
//         <div className="bg-white p-5 rounded-2xl shadow mb-6">
//           <p className="text-gray-700 mb-2">First Name: {child.firstName}</p>
//           <p className="text-gray-700 mb-2">Last Name: {child.lastName}</p>
//           <p className="text-gray-700 mb-2">Nickname: {child.nickName}</p>
//           <p className="text-gray-700 mb-2">Age/Class: {child.age}</p>
//           <p className="text-gray-700 mb-2">Books Read: {child.booksRead ?? 0}</p>
//           <p className="text-gray-700 mb-2">
//             Favorite Book: {child.favoriteBooks || "None yet"}
//           </p>
//           <p className="text-gray-700 mb-4">
//             Reading Level: {child.readingLevel || "Beginner"}
//             <p>Next Level: {getNextReadingLevel(child.readingLevel)}</p>
//           </p>

//           <button
//             onClick={() => onNavigate("reading")}
//             className="w-full py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow hover:from-purple-600 hover:to-purple-700"
//           >
//             Continue Reading
//           </button>
//         </div>
//       )}

//       {/* Parent Settings */}
//       {parent && (
//         <div className="bg-purple-100 p-4 rounded-xl text-center mb-8">
//           <p className="text-gray-700 mb-3">
//             Managed by <strong>{parent.firstName} {parent.lastName}</strong>
//           </p>
//           <button
//             onClick={() => onNavigate("settings", parent)}
//             className="text-purple-700 font-semibold hover:underline"
//           >
//             Go to Parent Settings →
//           </button>
//         </div>
//       )}

//       {/* Stats Section */}
//       {child && (
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
//             <BookOpen size={28} className="text-purple-600 mb-1" />
//             <span className="font-bold text-xl text-purple-700">
//               {child.booksRead ?? 0}
//             </span>
//             <p className="text-gray-500 text-sm">Books</p>
//           </div>
//           <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
//             <Clock size={28} className="text-purple-600 mb-1" />
//             <span className="font-bold text-xl text-purple-700">
//               {child.totalReadingTime || "0h 0m"}
//             </span>
//             <p className="text-gray-500 text-sm">Time</p>
//           </div>
//           <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
//             <Trophy size={28} className="text-purple-600 mb-1" />
//             <span className="font-bold text-xl text-purple-700">
//               {child.streakDays ?? 0}d
//             </span>
//             <p className="text-gray-500 text-sm">Streak</p>
//           </div>
//         </div>
//       )}

//       {/* Reading Progress */}
//       {child && (
//         <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow mb-8 mx-auto">
//           <h3 className="text-lg font-semibold text-purple-700 mb-3">
//             Reading Progress
//           </h3>
//           <div className="w-full bg-purple-100 h-3 rounded-full overflow-hidden">
//             <div
//               className="bg-purple-600 h-3 transition-all"
//               style={{ width: `${child.overallProgress ?? 0}%` }}
//             ></div>
//           </div>
//           <p className="text-sm text-gray-600 mt-2">
//             {child.overallProgress ?? 0}% complete

//           </p>
//           {child.progress && Object.entries(child.progress).map(([bookId, percent]) => (
//             <p key={bookId} className="text-gray-600">
//             Book {bookId}: {percent}%
//             </p>
//         ))}


//         </div>
//       )}

//       {/* Current Book */}
//       {child?.currentBook && (
//         <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow mb-8 mx-auto">
//           <h3 className="text-lg font-semibold text-purple-700 mb-2">
//             Current Book
//           </h3>
//           <p className="text-gray-600 mb-4">{child.currentBook}</p>
//           <button
//             onClick={() => onNavigate("reading")}
//             className="w-full py-3 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow"
//           >
//             Continue Reading
//           </button>
//         </div>
//       )}

//       {/* Favorite Books */}
//      {child?.favoriteBooks && child.favoriteBooks.length > 0 && (
//       <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow mb-8 mx-auto">
//       <h3 className="text-lg font-semibold text-purple-700 mb-3">
//       Favorite Books
//       </h3>
//       <ul className="space-y-2">
//       {child.favoriteBooks.map((book, i) => (
//         <li
//           key={i}
//           className="bg-purple-50 px-4 py-2 rounded-xl text-gray-700 font-medium"
//         >
//           {book}
//         </li>
//       ))}
//       </ul>
//       </div>
//       )}


//       {/* Badges */}
//       {child?.badges && child.badges.length > 0 && (
//         <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow mb-10 mx-auto">
//           <h3 className="text-lg font-semibold text-purple-700 mb-3">Badges</h3>
//           <div className="flex flex-wrap gap-3">
//             {child.badges.map((badge, i) => (
//               <span
//                 key={i}
//                 className="bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full text-sm"
//               >
//                 {badge}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React from "react";
import { Home, Book, Trophy, User, Star } from "lucide-react";

export const ProfileScreen: React.FC = () => {
  const child = {
    firstName: "Christiana",
    avatar: "/avatars/girl.png",
    level: "Level 3 Reader",
    booksRead: 18,
    minutesRead: 1260,
    streak: 7,
    badges: [
      { name: "Bookworm", icon: "📚", color: "bg-yellow-100 text-yellow-700" },
      { name: "Early Bird", icon: "🌅", color: "bg-blue-100 text-blue-700" },
      { name: "Streak Master", icon: "🔥", color: "bg-red-100 text-red-700" },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-linear-to-r from-purple-500 to-purple-700 text-white p-6 rounded-b-3xl shadow-md flex flex-col items-center">
        <img
          src={child.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-3"
        />
        <h1 className="text-2xl font-bold">{child.firstName}</h1>
        <p className="text-purple-100 text-sm">{child.level}</p>
        <button className="mt-3 px-4 py-2 bg-white text-purple-600 rounded-xl font-semibold shadow hover:scale-105 transition">
          Edit Profile
        </button>
      </header>

      {/* Reading Stats */}
      <section className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-3">Reading Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-2xl font-bold text-purple-600">
              {child.booksRead}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Books Read</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-2xl font-bold text-purple-600">
              {child.minutesRead}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Minutes</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-2xl font-bold text-purple-600">
              {child.streak}🔥
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Day Streak</p>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="px-6 mt-8 mb-20">
        <h2 className="text-xl font-semibold mb-3">Badges & Achievements</h2>
        <div className="grid grid-cols-3 gap-4">
          {child.badges.map((badge) => (
            <div
              key={badge.name}
              className={`rounded-2xl p-4 shadow flex flex-col items-center ${badge.color}`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="text-sm font-semibold mt-2">{badge.name}</p>
            </div>
          ))}
        </div>
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
        <button className="flex flex-col items-center">
          <Trophy size={24} />
          <span className="text-xs mt-1">Leaderboard</span>
        </button>
        <button className="flex flex-col items-center text-purple-600">
          <User size={24} />
          <span className="text-xs mt-1 font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

