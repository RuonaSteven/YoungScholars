import type { Badge, ChildWithUI } from "../types";
import { showAlert } from "./alertTheme";


export const BADGES: Badge[] = [
 {
    id: "first-read",
    title: "First Read 📖",
    description: "Completed your first book!",
    icon: "📖",
    color: "#4ade80",
    condition: (child) => (child.booksRead ?? 0) >= 1,
  },
  {
    id: "book-worm",
    title: "Book Worm 🐛",
    description: "Read 5 books!",
    icon: "🐛",
    color: "#facc15",
    condition: (child) => (child.booksRead ?? 0) >= 5,
  },
  {
    id: "streak-starter",
    title: "Streak Starter 🔥",
    description: "Read 10 books!",
    icon: "🔥",
    color: "#f87171",
    condition: (child) => (child.booksRead ?? 0) >= 10,
  },
  {
    id: "fast-reader",
    title: "Fast Reader ⚡",
    description: "Read 15 books!",
    icon: "⚡",
    color: "#60a5fa",
    condition: (child) => (child.booksRead ?? 0) >= 15,
  },
  {
    id: "marathon-reader",
    title: "Marathon Reader 🏃‍♂️",
    description: "Read 20 books!",
    icon: "🏃‍♂️",
    color: "#c084fc",
    condition: (child) => (child.booksRead ?? 0) >= 20,
  },
  {
    id: "super-scholar",
    title: "Super Scholar 🏆",
    description: "Read 25 books!",
    icon: "🏆",
    color: "#fbbf24",
    condition: (child) => (child.booksRead ?? 0) >= 25,
  },
  {
    id: "reading-champion",
    title: "Reading Champion 🏆",
    description: "Read 30 books!",
    icon: "🏆",
    color: "#fbbf24",
    condition: (child) => (child.booksRead ?? 0) >= 30,
  },
];

// 🪄 Function to check and award new badges
export function updateChildBadges(child: ChildWithUI): { updatedChild: ChildWithUI; newBadges: Badge[] }{
  const earned = child.badges ?? [];
  const newBadges =  BADGES.filter(
    (badge) => badge.condition(child) && !earned.some((b: any) => b.id === badge.id)
  );
     
  if (newBadges.length === 0) return { updatedChild: child, newBadges: [] };
     const updatedBadges = [...earned, ...newBadges];
     const latestBadge = newBadges[newBadges.length - 1];

      const updatedChild: ChildWithUI = {
    ...child,
    badges: updatedBadges,
    latestBadge,
  };

     const children = JSON.parse(localStorage.getItem("youngScholarsChildren") || "[]");
     const updatedChildren = children.map((c: ChildWithUI) =>
      c.id === updatedChild.id ? updatedChild : c
    );
     
    
    
    localStorage.setItem("youngScholarsChildren", JSON.stringify(updatedChildren));
    localStorage.setItem("youngScholarsActiveChild", JSON.stringify(updatedChild));

    // Show celebration
    newBadges.forEach((badge) =>
      showAlert("🎉 Badge Earned!", `${badge.title} — ${badge.description}`, "success")
    );

  return { updatedChild, newBadges };
  }

//   return { updatedChild: child, newBadges: [] };
// }