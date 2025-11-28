import type { Book } from "../types";

interface FetchBooksOptions {
  age?: string; // e.g., "3-4"
  readingLevel?: string; // e.g., "Read-along", "Guided-reading", "Independent-reading"
}

export async function fetchBooks({ age, readingLevel }: FetchBooksOptions = {}): Promise<Book[]> {
  // If you have a backend API:
  const params = new URLSearchParams();
  if (age) params.append("age", age);
  if (readingLevel) params.append("readingLevel", readingLevel);
  // Mock API example
  return new Promise((resolve) => {
    setTimeout(() => {
      const allBooks: Book[] = [
        { id: "1", title: "The Magic Forest", author: "Emma Stone", description: "A wonderful adventure", coverImage: "", content:"", level: "Read-along", ageRange: [3, 4] },
        { id: "2", title: "Space Explorers", author: "John Cosmos", description: "Journey to the stars", coverImage: "", content:"", level: "Guided-reading", ageRange: [5, 6] },
        { id: "3", title: "Ocean Friends", author: "Marina Blue", description: "Meet amazing sea creatures", coverImage: "", content:"", level: "Read-along", ageRange: [3, 4] },
        { id: "4", title: "Dragon Tales", author: "Fire Writer", description: "Friendly dragons", coverImage: "", content:"", level: "Guided-reading", ageRange: [5, 6] },
        { id: "5", title: "Jungle Quest", author: "Tola Ade", description: "Explore the jungle", coverImage: "", content:"", level: "Independent-reading", ageRange: [7, 8] },
      ];

      let filtered = allBooks;
      if (age && age !== "all") {
        const [min, max] = age.split("-").map(Number);
        filtered = filtered.filter(book => book.ageRange[0] === min && book.ageRange[1] === max);
      }
      if (readingLevel && readingLevel !== "all") {
        filtered = filtered.filter(book => book.level === readingLevel);
      }

      resolve(filtered);
    }, 500);
  });

  // If real API:
  // const response = await fetch(`https://your-backend.com/api/books?${params.toString()}`);
  // if (!response.ok) throw new Error("Failed to fetch books");
  // return response.json();
}
