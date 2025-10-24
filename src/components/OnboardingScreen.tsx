import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Eye, EyeOff } from "lucide-react";
import type { User } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import  Swal  from "sweetalert2";
import { showAlert } from "../utils/alertTheme";


interface OnboardingScreenProps {
  onComplete: (userData: User) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"parent" | "guardian">("parent");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    role: "parent" as "parent" | "guardian",  
    email: "",
    phone: "",
    password: "",
  });

  // ✅ Load user info if already stored
  useEffect(() => {
    const savedUser = localStorage.getItem("youngScholarsUser");
    if (savedUser) {
      const data = JSON.parse(savedUser);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setRole(data.role || "parent");
      setPhone(data.phone || "");
      setEmail(data.email || "");
    }
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
 const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

if (!passwordRegex.test(password)) {
  setError(
    "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (!@#$%^&*)."
  );
  return;
}

    const userData = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  };
    localStorage.setItem("youngScholarsUser", JSON.stringify(userData)); // ✅ Save to localStorage
    onComplete(userData);
    showAlert(
      "Welcome to YoungScholars! 🎓",
      `<strong>${firstName}</strong>, your account has been created successfully!`,
      "success"
    );
Swal.fire({
    title: 'Welcome to YoungScholars! 🎓',
    html: `<strong>${firstName}</strong>, your account has been created successfully!`,
    icon: 'success',
     background: "#f0f4ff",
    color: "#1e293b",
    confirmButtonColor: "#7c3aed",
    confirmButtonText: "Continue",
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      confirmButton: "rounded-lg px-5 py-2 font-semibold",
    },
});

  };

  return (
    
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-b from-gray-50 to-white-50 p-6" text-center>
      
        <div className="min-h-screen flex flex-col items-center justify-start px-8 py-10 mt bg-gradient-to-b from-purple-200/30 to-indigo-500 text-center">
              {/* Logo */}
              <div className="mb-12">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                  <ImageWithFallback
                    src="/assets/YoungScholarlogo.jpg"
                    alt="App Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-3">YoungScholars</h1>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Let's get you started, Young Scholar</h2>
              </div>
      
        
        <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl bg-white/90">

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="FirstName">First Name</Label>
            <Input
              id="FirstName"
              placeholder="Enter your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="LastName">Surname</Label>
            <Input
              id="LastName"
              placeholder="Enter your Surname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <RadioGroup
              defaultValue={role}
              onValueChange={(value: "parent" | "guardian") => setRole(value)}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parent" id="parent" />
                <Label htmlFor="parent">Parent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guardian" id="guardian" />
                <Label htmlFor="guardian">Guardian</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2"
              type="tel"
            />
          </div>

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

          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 pr-10"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-600 active:scale-95 transition"
          >
            Continue
          </Button>
        </form>
      </Card>
    </div>
    </div>
  );
};
// function setUser(userData: { id: number; name: string; email: string; phone: string; password: string; role: "parent" | "guardian"; }) {
//   throw new Error("Function not implemented.");
// }

