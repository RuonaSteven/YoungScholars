import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, Parent } from "../types";
import { OnboardingScreen } from "./OnboardingScreen";
import { LoginScreen } from "./LoginScreen";
import { ChildSelectScreen } from "./ChildSelectScreen";
import Swal from "sweetalert2";


type WelcomeScreenProps = {
  onLogin: (user: Parent) => void;
  onNavigate: (screen: Screen, data?: any) => void;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onNavigate }) => {
  const [screen, setScreen] = useState<"welcome" | "onboarding" | "login" | "home" | "childSelect">("welcome");
  const [user, setUser] = useState<Parent | null>(null);

  const handleSignUp = () => onNavigate("onboarding");
  const handleLogin = () => onNavigate("login");

  useEffect(() => {
    const saved = localStorage.getItem("youngScholarsParent");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={(parentData) => {
          const parentWithId = { ...parentData, id: Date.now() };
          setUser(parentWithId);
          localStorage.setItem("youngScholarsParent", JSON.stringify(parentWithId));
          setScreen("childSelect");
          Swal.fire({
            title: "🎉 Welcome!",
            text: `Welcome, ${parentData.email}!`,
            icon: "success",
            confirmButtonText: "Continue",
          });

        }}
        onBack={() => setScreen("welcome")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={(parentData) => {
          setUser(parentData);
          setScreen("childSelect");
        } }
        onBack={() => setScreen("welcome")} onSignup={function (): void {
          throw new Error("Function not implemented.");
        } } onForgotPassword={function (): void {
          throw new Error("Function not implemented.");
        } } goToOnboarding={function (): void {
          throw new Error("Function not implemented.");
        } }      />
    );
  }

  if (screen === "home" && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h1>
        <Button
          onClick={() => {
            localStorage.removeItem("youngScholarsParent");
            setUser(null);
            setScreen("welcome");
          }}
        >
          Log Out
        </Button>
      </div>
    );
  }

  // Default welcome screen
  return (
    <div className="min-h-screen flex flex-col mx-auto items-center justify-center px-8 py-12 bg-white-50 text-center">
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
          variant="gradient"
          onClick={handleSignUp}
          className="w-full py-6 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white rounded-3xl shadow-xl text-xl font-semibold min-h-14"
        >
         
          Sign Up
        </Button>

        <Button
          onClick={handleLogin}
          variant="gradient"
          className="w-full py-6 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white rounded-3xl shadow-xl text-xl font-semibold min-h-14"
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
