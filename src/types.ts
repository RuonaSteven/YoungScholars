// src/types.ts

// -------------------- Screens --------------------
export type Screen = "welcome" | "home" | "bookDetails" | "profile" | "onboarding" | "login" | "reading" | "childSelect" | "settings" | "books" | "storybooks" | "bottomnav" | "leaderboard";

// -------------------- Difficulty --------------------


// -------------------- Reading Level --------------------  
export type ReadingLevel = "Read-along" | "Guided-reading" | "Independent-reading";

// export type Difficulty = "Easy" | "Medium" | "Hard";
// -------------------- Book --------------------
export type BookPage = {
  text?: string;           // paragraph or story text
  image?: string;          // single image per page
  images?: string[];       // OR multiple images if needed
  audioUrl?: string;       // optional: for "read aloud"
  highlightWords?: string[]; // optional: words to highlight
};

export interface Book {
  id: string;               // unique ID
  title: string;
  author: string;
  coverImage: string;
  description: string;
  content: string;
  ageRange: [number, number]; // e.g. [3, 4]
  level: ReadingLevel;

  // Optional fields
  tags?: string[];
  pages?: BookPage[];
  rating?: number;
}


// -------------------- Child (User) --------------------
export interface Child {
  id: number; 
  firstName: string;
  lastName: string;        // unique ID, e.g., UUID
  nickName: string; 
  age: number;              // display name
  avatar?: string;
  parentId: number;            
  
  // Progress Tracking
  progress?: Record<string, number>;
  overallProgress?: number; // optional: bookId -> pages read
  readingLevel?: ReadingLevel;
  booksRead?: number;
  totalReadingTime?: number;
  currentBook?: string;

  // Preferences & Achievements
  favoriteBooks?: string[];
  badges?: Badge[];         // All badges earned
  latestBadge?: Badge | null;      // Most recent badge earned
  streakDays?: number;
  
  //Meta
  joinedDate?: string;
  purchasedBooks?: number[]; 
  booksReadIds?: number[];  

         // link to parent account
};

export type ChildWithUI = Child & {
  name: string;       // full name for display
  age?: number;
  // classLevel?: string;
  lastRead?: string;
  favoriteBooks?: string[];
};

// -------------------- Parent --------------------
export type Parent = {
  id: number; 
  firstName: string;
  lastName: string;                // unique ID, e.g., UUID
  email: string;              // used for login/payment
  passwordHash: string;       // store securely (hashed)
  childrenIds: number[];      // IDs of children linked to this parent
  purchasedBooks?: number[];  // optional: book IDs purchased for offline access
};

// -------------------- Authentication --------------------
export type AuthToken = {
  token: string;              // JWT or session token
  expiresAt: string;          // ISO date string
};

export type Category = {
  name: string;
  screen: Screen;
  icon: string;
};

// 🌟 Badge type
export interface Badge {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  earnedAt?: string; // timestamp when earned
  rarity?: "common" | "rare" | "epic" | "legendary"; // optional tier system
  condition: (child: ChildWithUI) => boolean;
}

// ----------------------------
// QUIZ TYPES
// ----------------------------
export interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  answerIndex: number; // renamed from answer_index
}

export interface Quiz {
  bookId: string;
  questions: QuizQuestion[];
}

