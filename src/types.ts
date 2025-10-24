// src/types.ts

import { ReactNode } from "react";

export type Screen = "welcome" | "home" | "bookDetails" | "profile";



// -------------------- User --------------------
export type User = {
  role: ReactNode;
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
  phone: string;
  password: string;
};

// -------------------- Screens --------------------



// -------------------- Book --------------------
export type BookPage = {
  text?: string;          // paragraph or story text
  image?: string;         // single image per page
  images?: string[];      // OR multiple images if needed
  audioUrl?: string;      // optional: for "read aloud"
  highlightWords?: string[]; // optional: words to highlight
};

export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  description?: string;
  category?: string;      // e.g. "Adventure", "Moral Stories"
  pages: BookPage[];
  // pages: PageContent[];   // 👈 an array of page objects
};