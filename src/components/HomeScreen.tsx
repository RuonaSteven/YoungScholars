// // src/components/HomeProfileScreen.tsx
// import React, { useEffect } from "react";
// import { Button } from "./ui/button";
// import { Card, CardContent } from "./ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import type { Child, Book, Screen } from "../types";
// import { ArrowLeft, BookOpen, Clock, Trophy } from "lucide-react";
// import { getNextReadingLevel } from "../utils/readingLevel";

// interface HomeScreenProps {
//   child: Child;
//   books: Book[];
//   onNavigate: (screen: Screen, data?: any) => void;
//   onRead: (book: Book) => void;
//   onSettings: () => void;
//   onBack?: () => void;
// }

// export const HomeScreen: React.FC<HomeScreenProps> = ({
//   child,
//   books,
//   onNavigate,
//   onRead,
//   onSettings,
//   onBack,
// }) => {
//   useEffect(() => {
//     // scroll to top when screen mounts
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // Level-up side effect (safe)
//   useEffect(() => {
//     const booksRead = child.booksRead ?? 0;
//     const currentLevel = child.readingLevel ?? "Beginner";
//     if (booksRead >= 5) {
//       const newLevel = getNextReadingLevel(currentLevel);
//       if (newLevel !== currentLevel) {
//         // NOTE: mutating prop directly is usually not ideal; instead persist outside (App) or use callback.
//         // For MVP quick feedback we still show an alert. Persisting should be done by the parent (App).
//         alert(`🎉 Congrats ${child.nickName ?? child.firstName}! You've reached ${newLevel} level!`);
//       }
//     }
//   }, [child]);

//   // Find current book by id (child.currentBook is a string id)
//   const currentBook = child.currentBook ? books.find((b) => b.id === child.currentBook) : null;

//   const categories = [
//     { id: "storybooks", name: "Storybooks", icon: "📖", screen: "storybooks" },
//     { id: "comics", name: "Comics", icon: "🎨", screen: "comics" },
//     { id: "academics", name: "Academics", icon: "📘", screen: "academics" },
//   ];

//   return (
//     <div className="min-h-screen bg-amber-20 pb-12">
//       {/* Header */}
//     <header className="relative bg-linear-to-r from-purple-500 to-purple-700  text-white px-6 pt-5 pb-4 rounded-b-3xl shadow-lg flex items-center justify-between">
//   {onBack && (
//     <Button
//       onClick={onBack}
//       variant="ghost"
//       className="absolute left-4 top-2 flex items-center text-white text-sm font-bold hover:text-purple-700 transition"
//     >
//       <ArrowLeft size={20} className="mr-1" />
//       Back
//     </Button>
//   )}

//         <div className="flex items-center space-x-4 mt-8">
//           <Avatar className="relative w-14 h-14 border-4 border-white rounded-full shadow-lg bg-purple-100 flex items-center justify-center overflow-hidden">
//             {child.avatar && child.avatar.trim() !== "" ? (
//               <AvatarImage
//                 src={child.avatar}
//                 alt={child.nickName || child.firstName}
//                 className="object-cover w-full h-full"
//                 onError={(e) => ((e.currentTarget.style.display = 'none'))}
//               />
//             ) : (
//               <AvatarFallback className="absolute inset-0 flex items-center justify-center bg-white text-purple-700 text-10xl font-bold">
//                 {(child.nickName || child.firstName)?.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             )}
//           </Avatar>

//         <div className="flex flex-wrap items-center gap-4 w-full">
//             <h2 className="text-2xl font-bold">
//               Hi, {child.nickName ?? child.firstName}! 👋
//             <p className="text-blue-100 text-sm">
//               What would you like to read today?
//             </p>
//             </h2>
//           </div>
//           <div className="ml-auto flex items-center">
//             <p className="text-blue-100 text-sm mr-2">
//               Reading Level:{" "}
//               <span className="bg-purple-600 text-white font-semibold text-sm px-1 py- rounded-full shadow-sm backdrop-blur-sm">
//                 {child.readingLevel ?? "Beginner"}
//               </span>
//             </p>
//           </div>

//         </div>

        

//         <Button onClick={onSettings} variant="ghost" 
//         className="absolute right-4 top-2 text-white text-2xl hover:text-white transition">
//           ⚙️
//         </Button>
//       </header>

//       {/* Stats Row */}
//       <div className="flex justify-around mt-6 px-6">
//         <Card className="flex-1 mx-4 p-2 rounded-2xl shadow bg-white flex flex-col items-center h-32">
//           <BookOpen size={40} className="text-purple-600 mb-1" />
//           <span className="font-bold text-lg text-purple-700">{child.booksRead ?? 0}</span>
//           <p className="text-gray-500 text-sm">Books</p>
//         </Card>

//         <Card className="flex-1 mx-1 p-4 rounded-2xl shadow bg-white flex flex-col items-center">
//           <Trophy size={28} className="text-purple-600 mb-1" />
//           <span className="font-bold text-lg text-purple-700">{child.streakDays ?? 0}d</span>
//           <p className="text-gray-500 text-sm">Streak</p>
//         </Card>

//         <Card className="flex-1 mx-1 p-4 rounded-2xl shadow bg-white flex flex-col items-center">
//           <Clock size={28} className="text-purple-600 mb-1" />
//           <span className="font-bold text-lg text-purple-700">{child.totalReadingTime ?? "0h 0m"}</span>
//           <p className="text-gray-500 text-sm">Time</p>
//         </Card>
//       </div>

//       {/* Continue Reading (lookup by id) */}
//       {currentBook ? (
//         <Card className="mx-6 mt-6 p-4 rounded-2xl shadow cursor-pointer" onClick={() => onRead(currentBook)}>
//           <CardContent className="flex items-center gap-4">
//             <img src={currentBook.coverImage} alt={currentBook.title} className="w-16 h-20 object-cover rounded-md" />
//             <div>
//               <h4 className="font-semibold">{currentBook.title}</h4>
//               <p className="text-sm text-gray-600">{currentBook.author}</p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="mx-6 mt-6 p-4 rounded-2xl">
//           <p className="text-gray-600">No current book — pick one from categories or favorites.</p>
//         </div>
//       )}

//       {/* Favorite books (child.favoriteBooks is array of book ids) */}
//       {child.favoriteBooks?.length ? (
//         <section className="px-6 mt-6">
//           <h3 className="text-xl font-semibold text-purple-700 mb-3">Favorite Books</h3>
//           <div className="flex overflow-x-auto gap-3 pb-4">
//             {child.favoriteBooks.map((bookId) => {
//               const favBook = books.find((b) => b.id === bookId);
//               if (!favBook) return null;
//               return (
//                 <Card key={favBook.id} className="min-w-[120px] cursor-pointer" onClick={() => onRead(favBook)}>
//                   <img src={favBook.coverImage} alt={favBook.title} className="w-full h-32 object-cover rounded-lg" />
//                   <p className="text-center text-sm mt-2">{favBook.title}</p>
//                 </Card>
//               );
//             })}
//           </div>
//         </section>
//       ) : null}

//       {/* Categories */}
//       <section className="px-6 py-10">
//         <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Adventure 🚀</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {categories.map((cat) => (
//             <Card key={cat.id} className="cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 text-center" onClick={() => onNavigate(cat.screen as Screen)}>
//               <div className="w-20 h-20 mx-auto rounded-full bg-purple-500 flex items-center justify-center text-4xl text-white shadow-md mb-4">{cat.icon}</div>
//               <h4 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h4>
//             </Card>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

  import React, { useState, useEffect } from "react";
  import { Book as BookIcon, BookOpen, Clock, Home, Trophy, User, Badge } from "lucide-react";
  import type { Child, Book, Screen, Category } from "../types";
  import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
  import { Button } from "./ui/button";
  import { Card, CardContent } from "./ui/card";
  import { getNextReadingLevel } from "../utils/readingLevel";
  import { showAlert } from "../utils/alertTheme";

  interface HomeScreenProps {
  child: Child;
  books: Book[];
  onNavigate: (screen: Screen, data?: any) => void;
  onRead: (book: Book) => void;
  onSettings: () => void;
  onBack?: () => void;
}

  export const HomeScreen: React.FC<HomeScreenProps> = ({
    child,
    books,
    onNavigate,
    onRead,
    onSettings,
    onBack,
  }) => {
    useEffect(() => {
      // scroll to top when screen mounts
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

     useEffect(() => {
    const booksRead = child.booksRead ?? 0;
    const currentLevel = child.readingLevel ?? "Beginner";
    if (booksRead >= 5) {
      const newLevel = getNextReadingLevel(currentLevel);
      if (newLevel !== currentLevel) {
       showAlert(
        "🎉 Level Up!",
        `Congrats ${child.nickName ?? child.firstName}! You've reached ${newLevel} level!`
    );

      }
    }
  }, [child]);

    

    const recommended = [
      { title: "The Magical Forest", image: "/books/magical_forest.jpg" },
      { title: "Super Kid", image: "/books/super_kid.jpg" },
      { title: "The Science Fair", image: "/books/science_fair.jpg" },
    ];

    return (
      <div className = "min-h-screen w-full flex flex-col mx-auto shadow-lg relative bg-white text-purple-700">
        {/* Greeting Section */}
            <header className="relative bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 rounded-b-3xl shadow-md mt-1 space-y-1">
              <div className="flex items-start justify-between">
                {/* Greeting row */}
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 border-2 border-white rounded-full shadow-md">
                    <AvatarImage src={child.avatar} alt={child.nickName || child.firstName} />
                    <AvatarFallback className="bg-white text-purple-700 text-lg font-bold flex items-center justify-center">
                      {(child.nickName || child.firstName)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-2xl font-bold">
                      Hi, {child.nickName ?? child.firstName}! 👋
                    </h1>
                    
              
                {/* Reading level */}
                <p className="text-white text-xs mt-4 whitespace-nowrap mb-1">
                  <span className="font-semibold">Reading Level: </span>
                  <span className="bg-white text-purple-700 font-semibold px-2 py-0.5 rounded-full text-[0.7rem] sm:text-xs">
                    {child.readingLevel ?? "Beginner"}
                  </span>
                </p>
                </div>
                </div>
              

                {/* Latest Badge */}
                <div className="flex items-center bg-purple-100 rounded-lg px-3 py-1.5 mt-1 shadow-sm">
                  <span className="text-md mr-2">🏅</span>
                  <div>
                    <p className="text-xs text-gray-500">Latest Badge</p>
                    <p className="font-semibold text-purple-700">
                      {child.latestBadge ?? "No Badge Yet"}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            


        {/* Continue Reading */}
        <section className="px-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">You’re doing great! Keep reading 🎉</h2>
          <div className="flex items-center bg-white rounded-2xl shadow p-4 max-w-md mx-auto px-4">
            <img
              src="/books/brave_lion.jpg"
              alt="The Brave Lion"
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">The Brave Lion</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-700 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">35% completed</p>
              <button className="mt-3 px-4 py-2 bg-linear-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow hover:scale-105 transition">
                Continue Reading
              </button>
            </div>
          </div>
        </section>

        {/* Recommended */}
        <section className="px-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">"Ready for your next story?"</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {recommended.map((book) => (
              <div key={book.title} className="shrink-0 w-32">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-40 rounded-xl shadow-md object-cover"
                />
                <p className="mt-2 text-center text-sm font-medium">{book.title}</p>
              </div>
            ))}
          </div>
        </section>

        
        {/* Stats / Badges */} 
        <section className="px-2 mt-6">
  <h2 className="text-xl ml-4 font-semibold">Your Stats</h2>

  {/* Stats row */}
  <div className="grid grid-cols-3 gap-3 mt-4 px-4">
    {/* Books Read */}
    <Card className="flex flex-col items-center justify-center  rounded-2xl shadow bg-white h-30 p-4">
      <BookOpen size={28} className="text-purple-700 mb-1" />
      <span className="font-bold text-sm text-purple-700">
        {child.booksRead ?? 0}
      </span>
      <p className="text-gray-500 text-xs">Books Read</p>
    </Card>

    {/* Streak */}
    <Card className="flex flex-col items-center justify-center rounded-2xl shadow bg-white h-30 p-4">
      <Trophy size={28} className="text-purple-700 mb-1" />
      <span className="font-bold text-sm text-purple-700">
        {child.streakDays ?? 0}d
      </span>
      <p className="text-gray-500 text-xs">Streak</p>
    </Card>

    {/* Reading Time */}
    <Card className="flex flex-col items-center justify-center rounded-2xl shadow bg-white h-30 p-4">
      <Clock size={28} className="text-purple-700 mb-1" />
      <span className="font-bold text-sm text-purple-700">
        {child.totalReadingTime ?? "0h 0m"}
      </span>
      <p className="text-gray-500 text-xs">Reading Time</p>
    </Card>
  </div>
</section>


  

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto shadow-lg bg-white border-t border-purple-100 py-3 flex justify-around text-gray-600">
          <button className="flex flex-col items-center text-purple-600">
            <Home size={24} />
            <span className="text-xs mt-1 font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <BookIcon size={24} />
            <span className="text-xs mt-1">Books</span>
          </button>
          <button className="flex flex-col items-center">
            <Trophy size={24} />
            <span className="text-xs mt-1">Leaderboard</span>
          </button>
          <button className="flex flex-col items-center">
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </nav>
      </div>
    );
  };
