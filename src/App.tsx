import React, { useEffect, useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { BookDetailsScreen } from "./components/BookDetailsScreen";
import { ReadingScreen } from "./components/ReadingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { LoginScreen } from "./components/LoginScreen";
import type { Book as FullBook, User, Screen } from "./types";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { Button } from "./components/ui/button";
import  Swal  from "sweetalert2";

// ------------------ TYPES ------------------
type ScreenName = "welcome" | "home" | "bookDetails" | "reading" | "profile" | "onboarding" | "login";

interface BookData {
  id: number;
  title: string;
  author: string;
}

// interface User {
//   id: number;
//   name: string;
//   email?: string;
//   avatar: string;
// }

// ------------------ MAIN APP ------------------
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("welcome");
  const [user, setUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<FullBook | null>(null);
  const [message, setMessage] = useState("");
  

  // ------------------ SCREEN NAVIGATION ------------------
  const navigate = (screen: ScreenName, data: FullBook | null = null) => {
    setCurrentScreen(screen);
    if (data && (screen === "bookDetails" || screen === "reading")) {
      setSelectedBook(data);
    }
  };

  // ------------------ LOGIN HANDLER ------------------
  const handleLogin = async (loginData: { firstName: string; lastName: string; email?: string }) => {
    const avatar = await createAvatar(adventurer, {
      seed: loginData.firstName,
      size: 128,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
    }).toDataUri();

    const newUser: User = {
      id: Date.now(),
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      email: loginData.email,
      avatar,
      role: "parent",
      phone: "",
      password: "",
    };

    setUser(newUser);
    setCurrentScreen("home");
};
  const handleOnboardingComplete = (userData: User) => {
    setUser(userData);
     localStorage.setItem("youngScholarsUser", JSON.stringify(userData));
    alert("Welcome, " + userData.firstName + "!");
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("welcome");
  };

  // ------------------ BACKEND TEST ------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  // ------------------ SCREEN RENDERING ------------------
  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen("login")}
            onNavigate={(screen: Screen) => setCurrentScreen(screen)}
          />
        );
      case "login":
        return (
          <LoginScreen
            onLoginSuccess={(userData) => {
              setUser(userData);
              setCurrentScreen("home");
            }}
            onBack={() => setCurrentScreen("welcome")}
          />
        );
      case "onboarding":
        return (
          <OnboardingScreen
            onComplete={(data) => {
              setUser(data);
              alert("Welcome, " + data.firstName + "!");
              setCurrentScreen("home");
            }}
          />
        );
      case "home":
        return user ? (
    <HomeScreen user={user} onNavigate={navigate} />
  ) : (
    <WelcomeScreen onLogin={handleLogin} onNavigate={navigate} />
  );
      case "bookDetails":
        return (
          <BookDetailsScreen
            book={selectedBook}
            onNavigate={navigate}
            onBack={() => setCurrentScreen("home")}
          />
        );
        case "reading":
  if (!selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-xl font-semibold mb-4 text-gray-700">
          Please select a book to start reading.
        </p>
        <Button onClick={() => navigate("home")}>
          View Available Books
        </Button>
      </div>
    );
  }

  return (
    <ReadingScreen
      book={selectedBook}
      onBack={() => navigate("home")}
      
    />
  );


      case "profile":
        return (
          <ProfileScreen
            user={user}
            onLogout={handleLogout}
            onBack={() => setCurrentScreen("home")}
          />
        );
        
      default:
        return <WelcomeScreen
  onLogin={handleLogin}
  onNavigate={(screen) => setCurrentScreen(screen)}
/>

    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-yellow-50 to-green-100 overflow-x-hidden">
      <div className="min-h-screen w-full bg-white">
        {renderScreen()}

        {/* Optional Backend Test Output */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Backend Connection:</h3>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

