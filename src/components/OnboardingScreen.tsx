import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { Parent, Child } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { showAlert } from "../utils/alertTheme";

interface OnboardingScreenProps {
  onComplete: (parentData: Parent, childrenData: Child[]) => void;
  onBack?: () => void;
}

const AVATARS = [
  "/assets/avatars/avatar1.png",
  "/assets/avatars/avatar2.png",
  "/assets/avatars/avatar3.png",
  "/assets/avatars/avatar4.png",
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<"parent" | "children">("parent");

  // Parent info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Children info
  const [children, setChildren] = useState<Child[]>([]);
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childNickname, setChildNickname] = useState("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [childAvatar, setChildAvatar] = useState<string>(AVATARS[0]);

  // For avatar upload (after child is added)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedChildIdRef = useRef<number | null>(null);

  const handleAvatarClick = (childId: number) => {
    selectedChildIdRef.current = childId;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedChildIdRef.current === null) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setChildren(prevChildren =>
        prevChildren.map(child =>
          child.id === selectedChildIdRef.current
            ? { ...child, avatar: reader.result as string }
            : child
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const addChild = () => {
    if (!childFirstName || !childLastName || !childNickname || !childAge) {
      return showAlert("Missing Fields", "All child fields are required.", "warning");
    }

    const newChild: Child = {
      id: Date.now(),
      firstName: childFirstName,
      lastName: childLastName,
      nickName: childNickname,
      age: Number(childAge),
      parentId: 0, // will be updated after parent creation
      avatar: childAvatar,
      progress: {},
    };

    setChildren(prev => [...prev, newChild]);
    setChildFirstName("");
    setChildLastName("");
    setChildNickname("");
    setChildAge("");
    setChildAvatar(AVATARS[0]);
  };

  const removeChild = (id: number) => {
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  const passwordIsValid = (password: string) => {
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return strongPasswordPattern.test(password);
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return showAlert("Missing Fields", "All parent fields are required.", "warning");
    }

    if (password !== confirmPassword) {
      return showAlert("Password Mismatch", "Passwords do not match.", "error");
    }

    if (email.indexOf("@") === -1) {
      return showAlert("Invalid Email", "Please enter a valid email address.", "error");
    }

    if (!passwordIsValid(password)) {
      return showAlert(
        "Weak Password",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        "error"
      );
    }

    setStep("children");
  };

  const handleFinish = async () => {
    if (children.length === 0) {
      return showAlert("No Children", "Please add at least one child.", "warning");
    }

    const parentId = Date.now();
    const parentData: Parent = {
      id: parentId,
      firstName,
      lastName,
      email,
      passwordHash: password, // hash in real app
      childrenIds: children.map(c => c.id),
      purchasedBooks: [],
    };

    const updatedChildren = children.map(c => ({ ...c, parentId }));

    localStorage.setItem("youngScholarsParent", JSON.stringify(parentData));
    localStorage.setItem("youngScholarsChildren", JSON.stringify(updatedChildren));

    await showAlert(
      "Welcome to YoungScholars! 🎓",
      // "Your account and child(s) profiles have been created successfully!",
      // "success"
      "Your YoungScholars account is ready! 🎉", "success"
    );

    onComplete(parentData, updatedChildren);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-gray-50 to-white p-6 text-center">
      <div className="min-h-screen flex flex-col items-center justify-start px-8 py-10 bg-linear-to-b from-purple-200/30 to-purple-700 text-center">
        <div className="mb-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
            <ImageWithFallback
              src="/assets/YoungScholarlogo.jpg"
              alt="App Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">YoungScholars</h1>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {step === "parent" ? "Create Parent Account" : "Add Children"}
          </h2>
          <p className="text-gray-700">{step === "parent" ? "Step 1 of 2" : "Step 2 of 2"}</p>
        </div>

        <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl bg-white/90 border-2 border-purple-500">
          {step === "parent" && (
            <form id="Onboarding Form" onSubmit={handleParentSubmit} className="space-y-5">
              <Input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                  {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button type="button" className="absolute right-3 top-2 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {!showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button type="submit" className="w-full py-3 mt-1 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition">
                Continue
              </Button>

              <Button type="button" onClick={onBack ?? (() => setStep("parent"))} className="w-full py-3 mt-1 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition">
                Back
              </Button>
            </form>
          )}

          {step === "children" && (
            <div className="space-y-4">
              <Input placeholder="First Name" value={childFirstName} onChange={e => setChildFirstName(e.target.value)} />
              <Input placeholder="Last Name" value={childLastName} onChange={e => setChildLastName(e.target.value)} />
              <Input placeholder="Nickname" value={childNickname} onChange={e => setChildNickname(e.target.value)} />
              <Input placeholder="Age" type="number" value={childAge} onChange={e => setChildAge(Number(e.target.value))} />

              <Label>Choose Avatar</Label>
              <div className="flex space-x-2 mb-3">
                {AVATARS.map(avatar => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt="avatar"
                    className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                      childAvatar === avatar ? "border-purple-600" : "border-transparent"
                    }`}
                    onClick={() => setChildAvatar(avatar)}
                  />
                ))}
              </div>

              <Button type="button" onClick={addChild} className="w-full py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition">
                Add Child
              </Button>

              {children.length > 0 && (
                <ul className="text-left text-gray-700 space-y-2">
                  {children.map(c => (
                    <li key={c.id} className="flex justify-between items-center bg-purple-50 p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 cursor-pointer hover:opacity-80"
                          onClick={() => handleAvatarClick(c.id)}
                        >
                          <img src={c.avatar} alt={c.firstName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold">{c.firstName} {c.lastName}</p>
                          <p className="text-sm text-gray-500">{c.nickName} ({c.age} yrs)</p>
                        </div>
                      </div>

                      <Button type="button" onClick={() => removeChild(c.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded-xl">
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Hidden input for avatar uploads */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <Button type="button" onClick={handleFinish} className="w-full py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition">
                Finish
              </Button>

              <Button type="button" onClick={() => setStep("parent")} className="w-full py-3 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 transition">
                Back
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
