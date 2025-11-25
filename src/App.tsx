import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoginScreen } from "./components/LoginScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ChildSelectScreen } from "./components/ChildSelectScreen";
import { BookDetailsScreen } from "./components/BookDetailsScreen";
import { ReadingScreen } from "./components/ReadingScreen"; 
import { ProfileScreen } from "./components/ProfileScreen";
import { StoryBooksScreen } from "./components/StoryBooksScreen";
import { BottomNavScreen } from "./components/BottomNav";
import { SettingsScreen } from "./components/SettingsScreen";
import { LeaderboardScreen } from "./components/LeaderBoardScreen";

import { ChildWithUI, Parent, Screen, Book } from "./types";
import { Button } from "./components/ui/button";
import { showAlert } from "./utils/alertTheme";

// Create one QueryClient for whole app
const queryClient = new QueryClient();

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [user, setUser] = useState<Parent | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildWithUI | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [childrenList, setChildrenList] = useState<ChildWithUI[]>([]);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleReadBook = (book: Book) => {
    setCurrentBook(book);
    navigate("reading");
  };

  // ---------- LOGIN ----------
  const handleLogin = (parentData: Parent) => {
    setUser(parentData);
    localStorage.setItem("youngScholarsParent", JSON.stringify(parentData));
    navigate("home");
  };

  // ---------- ONBOARDING ----------
  const handleOnboardingComplete = (parentData: Parent, childrenData: any[]) => {
    setUser(parentData);
    localStorage.setItem("youngScholarsParent", JSON.stringify(parentData));

    const formattedChildren = childrenData.map((c) => ({
      ...c,
      name: `${c.firstName} ${c.lastName}`,
    }));

    setChildrenList(formattedChildren);
    localStorage.setItem("youngScholarsChildren", JSON.stringify(formattedChildren));

    if (formattedChildren.length === 1) {
      setSelectedChild(formattedChildren[0]);
      localStorage.setItem("youngScholarsActiveChild", JSON.stringify(formattedChildren[0]));
    }

    navigate("childSelect");
  };

  // ---------- RESTORE CHILDREN ----------
  useEffect(() => {
    const savedChildren = localStorage.getItem("youngScholarsChildren");
    if (savedChildren) setChildrenList(JSON.parse(savedChildren));

    const savedChild = localStorage.getItem("youngScholarsActiveChild");
    if (savedChild) setSelectedChild(JSON.parse(savedChild));
  }, []);

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    setUser(null);
    setSelectedChild(null);
    localStorage.clear();
    navigate("welcome");
  };

  // ---------- SCREEN RENDER ----------
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
            onLoginSuccess={handleLogin}
            onBack={() => navigate("welcome")}
            goToOnboarding={() => navigate("onboarding")}
            onSignup={() => {}}
            onForgotPassword={() => {}}
          />
        );

      case "onboarding":
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            onBack={() => navigate("welcome")}
          />
        );

      case "childSelect":
        return selectedChild ? (
          <ChildSelectScreen
            parent={user!}
            childrenData={childrenList}
            onSelectChild={(child) => {
              setSelectedChild(child);
              localStorage.setItem("youngScholarsActiveChild", JSON.stringify(child));
              navigate("home");
            }}
            onBack={() => navigate("onboarding")}
          />
        ) : null;

      case "home":
        return user && selectedChild ? (
          <HomeScreen
            child={selectedChild}
            books={books}
            onRead={handleReadBook}
            onNavigate={navigate}
            onSettings={() => navigate("settings")}
          />
        ) : (
          <WelcomeScreen onLogin={() => navigate("login")} onNavigate={navigate} />
        );

      case "bookDetails":
        return currentBook ? (
          <BookDetailsScreen 
            book={currentBook}
            onNavigate={navigate}
            onBack={() => navigate("storybooks")} 
          />
        ) : null;

      case "reading":
        return selectedChild && currentBook ? (
          <ReadingScreen
            child={selectedChild}
            book={currentBook}
            onBack={() => navigate("home")}
            onBookComplete={(updatedChild: ChildWithUI) => {
              setSelectedChild(updatedChild);
              localStorage.setItem("youngScholarsActiveChild", JSON.stringify(updatedChild));
              showAlert("🎉 Well done!", `You've finished ${currentBook.title}!`);
            }}
          />
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
            onBack={() => navigate("home")}
          />
        );

      case "storybooks":
        return (
          <StoryBooksScreen
            onBack={() => navigate("home")}
            onNavigate={navigate}
          />
        );

      case "settings":
        return selectedChild ? (
          <SettingsScreen
            child={selectedChild}
            childrenList={childrenList}
            onBack={() => navigate("home")}
            onNavigate={setCurrentScreen}
          />
        ) : null;

      default:
        return <WelcomeScreen onLogin={() => navigate("login")} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white overflow-x-hidden">
      {renderScreen()}
      {["home"].includes(currentScreen) && (
        <BottomNavScreen currentScreen={currentScreen} onNavigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
