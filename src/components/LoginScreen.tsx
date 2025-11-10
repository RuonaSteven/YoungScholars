import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import  Swal from "sweetalert2";
import { showAlert } from "../utils/alertTheme";

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onBack: () => void;
}


export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedUser = localStorage.getItem("youngScholarsUser");

    if (!savedUser) {
    Swal.fire({
      title: "No Account Found",
      text: "Please sign up first before logging in.",
      icon: "warning",
      confirmButtonText: "Okay",
      confirmButtonColor: "#7c3aed",
    });

    const userData = JSON.parse(savedUser);
 if (email === userData.email && password === userData.password) {
    Swal.fire({
      title: "Login Successful 🎉",
      text: "Welcome back to Young Scholars!",
      icon: "success",
      confirmButtonText: "Continue",
      confirmButtonColor: "#7c3aed",
    }).then(() => onLoginSuccess(userData));
  } else {
    Swal.fire({
      title: "Invalid Login",
      text: "Your email or password is incorrect.",
      icon: "error",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#7c3aed",
    });
  }
};
  };

  return (
    <div className="min-h-screen flex items-center justify-center `bg-gradient-to-b from-indigo-50 to-blue-100 p-6">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl bg-white/90">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm">Login to continue to Young Scholars</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              type="email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 pr-10"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full py-3 mt-4 `bg-gradient-to-r` from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 active:scale-95 transition"
          >
            Login
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full py-3 mt-3 rounded-xl"
          >
            Back
          </Button>
        </form>
      </Card>
    </div>
  );
};
