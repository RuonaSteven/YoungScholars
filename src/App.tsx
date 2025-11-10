import React, { useEffect, useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { HomeScreen } from "./components/HomeScreen";
import { BookDetailsScreen } from "./components/BookDetailsScreen";
import { ReadingScreen } from "./components/ReadingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { ChildSelectScreen } from "./components/ChildSelectScreen";
import { StoryBooksScreen } from "./components/StoryBooksScreen";
import { BottomNavScreen } from "./components/BottomNav";
import { AcademicsScreen } from "./components/AcademicBooksScreen";
import type { Book, Parent, Child, ChildWithUI, Screen } from "./types";
import { Button } from "./components/ui/button";
import { showAlert } from "./utils/alertTheme";
import { SettingsScreen } from "./components/SettingsScreen";
import { BooksScreen } from "./components/BooksScreen";

// ------------------ TYPES ------------------

// ------------------ MAIN APP ------------------
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [user, setUser] = useState<Parent | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [message, setMessage] = useState("");
  const [selectedChild, setSelectedChild] = useState<ChildWithUI | null>(null);
  const [books, setBooks] = useState<Book[]>([]); // empty array initially

  // ------------------ DATA FETCHING ------------------
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
    }, []);


  // ------------------ SCREEN NAVIGATION ------------------
  const navigate = (screen: Screen, data: Book | null = null) => {
    setCurrentScreen(screen);
    if (data && (screen === "bookDetails" || screen === "reading")) {
      setSelectedBook(data);
    }
  };

  

  // ------------------ ONBOARDING COMPLETE ------------------
const handleOnboardingComplete = (parentData: Parent, childrenData: Child[]) => {
  setUser(parentData);
  localStorage.setItem("youngScholarsParent", JSON.stringify(parentData));
  localStorage.setItem("youngScholarsChildren", JSON.stringify(childrenData));
  showAlert("Welcome!", "Your account is ready! 🎉", "success");
  setCurrentScreen("home");
};

const storedChildren = localStorage.getItem("youngScholarsChildren");
const childrenFromStorage: ChildWithUI[] = storedChildren
  ? JSON.parse(storedChildren).map((c: any) => ({
      ...c,
      name: `${c.firstName} ${c.lastName}`, // auto-generate name
    }))
  : [];


const activeChild =
  childrenFromStorage.length === 1
    ? childrenFromStorage[0]
    : childrenFromStorage.find(
        (c) =>
          c.id ===
          JSON.parse(localStorage.getItem("youngScholarsActiveChild") || "{}")
            .id
      );
  const storedParent = localStorage.getItem("youngScholarsParent");
const parentFromStorage = storedParent ? JSON.parse(storedParent) : null;


  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("welcome");
  };

  // ------------------ BACKEND TEST ------------------
  useEffect(() => {
    // fetch("http://localhost:5000/api/message")
    //   .then((res) => res.json())
    //   .then((data) => setMessage(data.message))
    //   .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
  const storedChildren = localStorage.getItem("youngScholarsChildren");
  const activeChildStored = localStorage.getItem("youngScholarsActiveChild");

  if (storedChildren) {
    const children: ChildWithUI[] = JSON.parse(storedChildren).map((c: any) => ({
      ...c,
      name: `${c.firstName} ${c.lastName}`,
    }));

    if (activeChildStored) {
      setSelectedChild(JSON.parse(activeChildStored));
    } else {
      setSelectedChild(children[0]);
    }
  }
}, []);


  // ------------------ SCREEN RENDERING ------------------
  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onLogin={() => navigate("login")}
            onNavigate={navigate}
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
            onComplete={(parentData, childrenData) => {
        setUser(parentData);
        localStorage.setItem("youngScholarsParent", JSON.stringify(parentData));
        localStorage.setItem("youngScholarsChildren", JSON.stringify(childrenData));
        // showAlert("Welcome!", `Hello, your YoungScholars account is ready! 🎉`, "success");

        setCurrentScreen("childSelect");
            }}
            onBack={() => setCurrentScreen("welcome")}

          />
        );

      case "childSelect": 
      return (
        <ChildSelectScreen parent={user!} 
        childrenData={selectedChild ? [selectedChild] : []} 
        onSelectChild={(child) => { 
          localStorage.setItem("youngScholarsActiveChild", JSON.stringify(child)); 
          navigate("home"); 
        }} 
        onBack={() => navigate("onboarding")} />
      );

      case "home": 
      return user && selectedChild ? ( 
      <HomeScreen child={selectedChild} 
      books={books} 
      onRead={setSelectedBook} 
      onNavigate={navigate} 
      onSettings={() => navigate("settings")} 
      onBack={() => navigate("childSelect")} /> 
    ) : ( 
    <WelcomeScreen onLogin={() => navigate("login")} onNavigate={navigate} /> );


      case "bookDetails":
        return (
          <BookDetailsScreen
            book={selectedBook}
            onNavigate={navigate}
            onBack={() => setCurrentScreen("home")}
          />
        );

     case "books":
        return <BooksScreen 
        onNavigate={navigate}
        onBack={() => navigate("home")} />;

      case "reading":
        return selectedBook ? (
          <ReadingScreen book={selectedBook} onBack={() => navigate("home")} />
        ) : (
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <p className="text-xl font-semibold mb-4 text-gray-700">
              Please select a book to start reading.
            </p>
            <Button onClick={() => navigate("home")}>View Available Books</Button>
          </div>
        );

      case "profile":
        return (
          <ProfileScreen
            child={selectedChild || null}
            parent={user || null}
            onLogin={setUser}
            onNavigate={navigate}
            onLogout={handleLogout}
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "storybooks":
        return (
          <StoryBooksScreen
            onBack={() => setCurrentScreen("books")}
            onNavigate={navigate}
          />
        );

      case "academicbooks":
        return (
          <AcademicsScreen
            onBack={() => setCurrentScreen("books")}
            onNavigate={navigate}
          />
        );

        case 'settings':
      return (<SettingsScreen onBack={() => setCurrentScreen('profile')} />);

      default:
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen("login")}
            onNavigate={navigate}
          />
        )
  }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-blue-100 via-yellow-50 to-green-100 overflow-x-hidden">
      <div className="min-h-screen w-full bg-white pb-10">
        {renderScreen()}

        {/* Optional Backend Test Output */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Backend Connection:</h3>
          <p>{message}</p>
        </div>
        <div className="pb-20 flex flex-col w-full"/> {/* Spacer for bottom nav */}
        {["home", "books", "profile", "leaderboard"].includes(currentScreen) && (
        <BottomNavScreen currentScreen={currentScreen} onNavigate={navigate} />
        )}

      </div>
    </div>
  );
}
