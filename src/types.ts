// src/types.ts

// -------------------- Screens --------------------
export type Screen = "welcome" | "home" | "bookDetails" | "profile" | "onboarding" | "login" | "reading" | "childSelect" | "settings" | "books" | "storybooks" | "bottomnav" | "academicbooks";

// -------------------- Difficulty --------------------
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

// -------------------- Reading Level --------------------  
export type ReadingLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Super Advanced' | 'Extraordinary';
export const ReadingLevels: ReadingLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Super Advanced', 'Extraordinary'];

// -------------------- Book --------------------
export type BookPage = {
  text?: string;           // paragraph or story text
  image?: string;          // single image per page
  images?: string[];       // OR multiple images if needed
  audioUrl?: string;       // optional: for "read aloud"
  highlightWords?: string[]; // optional: words to highlight
};

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  content: string;
  category: string; // e.g. "Storybook", "Comic", "Academic"
  ageRange: [number, number]; // e.g. [3, 4]
  difficulty: "Easy" | "Medium" | "Hard";

  // Optional fields
  tags?: string[];
  pages?: BookPage[];
  rating?: number;
}


// -------------------- Child (User) --------------------
export type Child = {
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
  badges?: string[];
  streakDays?: number;
  
  //Meta
  joinedDate?: string;
  totalBooksRead?: number;
  purchasedBooks?: number[]; 
  booksReadIds?: number[];  
  paymentInfo?: string;
  latestBadge?: string; // <-- e.g. "Reading Champion"
  earnedBadges?: string[]; // <-- ["Reading Champion", "Fast Reader", ...]

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
