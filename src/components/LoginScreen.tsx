import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { showAlert } from "../utils/alertTheme";

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onBack: () => void;
  goToOnboarding: () => void;
  onSignup?: () => void;     
  onForgotPassword?: () => void;       
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBack,
  goToOnboarding,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      return showAlert(
        "Missing Fields",
        "Please enter both email and password.",
        "warning"
      );
    }
    if (!email.includes("@")) {
      return showAlert(
        "Invalid Email",
        "Please enter a valid email address.",
        "error"
      );
    }

    try {
      setLoading(true);

      // Placeholder for backend login
      // Replace with fetch/axios/useMutation later
      const savedUserString = localStorage.getItem("youngScholarsUser");
      if (!savedUserString) {
        return Swal.fire({
          title: "No Account Found",
          text: "Please sign up first before logging in.",
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#7c3aed",
        });
      }

      const savedUser = JSON.parse(savedUserString);

      if (email === savedUser.email && password === savedUser.password) {
        Swal.fire({
          title: "Login Successful 🎉",
          text: `Welcome back, ${savedUser.firstName || "User"}!`,
          icon: "success",
          confirmButtonText: "Continue",
          confirmButtonColor: "#7c3aed",
        }).then(() => onLoginSuccess(savedUser));
      } else {
        showAlert("Invalid Login", "Email or password is incorrect.", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Login Error", "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showAlert(
      "Forgot Password",
      "Password reset requires a backend system (e.g., Supabase). This is a placeholder.",
      "info"
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-purple-600 p-4 overflow-y-auto">
      <Card className="w-full max-w-md flex flex-col p-8 shadow-lg rounded-2xl bg-white/90">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-purple-800">Welcome Back 👋</h2>
          <p className="text-purple-800 text-sm">Login to continue to Young Scholars</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2"
            />
          </div>

          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="mt-2 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p
            className="text-sm text-purple-600 text-right cursor-pointer"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>

          <Button
            type="submit"
            variant="gradient"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-3xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            type="button"
            variant="gradient"
            onClick={onBack}
            className="w-full py-3 mt-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-3xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition"
          >
            Back
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={goToOnboarding}
            className="text-purple-600 font-semibold underline"
          >
            Signup
          </button>
        </p>
      </Card>
    </div>
  );
};
