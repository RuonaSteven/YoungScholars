import React from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, User } from "../types"; // adjust path if needed
import { OnboardingScreen } from "./OnboardingScreen";
import { LoginScreen } from "./LoginScreen";
import { useState, useEffect } from "react";

type WelcomeScreenProps = {
  onLogin: (user: User) => void; // ✅ simplified
  onNavigate: (screen: Screen, data?: any) => void;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onNavigate }) => {
  const [screen, setScreen] = useState<"welcome" | "onboarding" | "login" | "home">("welcome");
  const [user, setUser] = useState<User | null>(null);


   const handleSignUp = () => {
    setScreen("onboarding");
  };

  const handleLogin = () => {
    setScreen("login");
  };

  useEffect(() => {
    const saved = localStorage.getItem("youngScholarsUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
      onComplete={(userData) => {
  const userWithId = { ...userData, id: Date.now() }; // 👈 give each user a unique id
  setUser(userWithId);
  localStorage.setItem("youngScholarsUser", JSON.stringify(userWithId));
  setScreen("home");
  alert(`Welcome, ${userData.firstName}!`);
}}   
      />
    );
  }

   if (screen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={(userData) => {
          setUser(userData);
          setScreen("home");
        }}
        onBack={() => setScreen("welcome")}
      />
    );
  }
  if (screen === "home" && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
        <p className="mb-4 text-gray-600">You’re logged in as {user.role}.</p>
        <Button
          onClick={() => {
            localStorage.removeItem("youngScholarsUser");
            setUser(null);
            setScreen("welcome");
          }}
        >
          Log Out
        </Button>
      </div>
    );
  }

  // if (user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
  //       <h1 className="text-2xl font-bold mb-4">Welcome Back, {user.name}!</h1>
  //       <p className="mb-4 text-gray-600">You’re logged in as {user.role}.</p>
  //       <Button
  //         onClick={() => {
  //           localStorage.removeItem("youngScholarsUser");
  //           setUser(null);
  //         }}
  //       >
  //         Log Out
  //       </Button>
  //     </div>
  //   );
  // }


  // const handleLogin = () => {
  //   onLogin({
  //     name: "Alex",
  //     id: 0
  //   });
  //   onNavigate("home");
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12 bg-white-50 text-center">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
          <ImageWithFallback
            src="/assets/YoungScholarlogo.jpg"
            alt="App Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-3">Young Scholars</h1>
        <p className="text-2xl text-gray-600 font-medium">Read. Learn. Grow.</p>
      </div>

      {/* Background Illustration */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-xl w-full max-w-sm">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1733671805619-1a1563c006bc"
          alt="Children reading books"
          className="w-full h-60 object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-6 mb-8">
        <Button
          variant="solid"
          onClick={handleSignUp}
          className="w-full py-6 bg-gradient-to-r from-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-3xl shadow-xl text-xl font-semibold min-h-[56px] transition-all"
        >
          Sign Up
        </Button>


        <Button
          onClick={handleLogin}
          variant="solid"
          className="w-full py-6 bg-gradient-to-r from-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-3xl shadow-xl text-xl font-semibold min-h-[56px] transition-all"
        >
          Log In
        </Button>
      </div>

      {/* Fun Icons */}
      <div className="mt-auto flex space-x-6 text-4xl">
        <span className="animate-bounce">⭐</span>
        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
          📖
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
          🎨
        </span>
        <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>
          🏆
        </span>
      </div>
    </div>
  );
};


