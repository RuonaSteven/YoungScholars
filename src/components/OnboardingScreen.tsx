import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { Parent, Child } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { showAlert } from "../utils/alertTheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedChildIdRef = useRef<number | null>(null);

  const queryClient = useQueryClient();

   const handleAvatarClick = (childId: number) => {
    selectedChildIdRef.current = childId;
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("https://your-backend.com/api/upload-avatar/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Avatar upload failed");

    const data = await response.json();
    return data.url; // URL of uploaded avatar
  };

  // const handleAvatarClick = (childId: number) => {
  //   selectedChildIdRef.current = childId;
  //   fileInputRef.current?.click();
  // };

  // Upload avatar to backend
  

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedChildIdRef.current === null) return;

    try {
      const uploadedUrl = await uploadAvatar(file);
      setChildren(prev =>
        prev.map(child =>
          child.id === selectedChildIdRef.current
            ? { ...child, avatar: uploadedUrl }
            : child
        )
      );
    } catch (error) {
      showAlert("Upload Error", "Failed to upload avatar. Try again.", "error");
    }
  };

  const addChild = () => {
    if (!childFirstName || !childLastName || !childNickname || childAge === "") {
      return showAlert("Missing Fields", "All child fields are required.", "warning");
    }

    if (Number(childAge) <= 0) {
      return showAlert("Invalid Age", "Please enter a valid age.", "warning");
    }

    const newChild: Child = {
      id: Date.now(),
      firstName: childFirstName,
      lastName: childLastName,
      nickName: childNickname,
      age: Number(childAge),
      parentId: 0, // updated after parent creation
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

    if (!email.includes("@")) {
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

   const createParentMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("https://your-backend.com/api/create-parent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create account");
      return res.json();
    },
    
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["parentData"] }); // refresh if needed
        showAlert("Welcome!", "Your YoungScholars account is ready!", "success");
        onComplete(data.parent, data.children);
      },
      onError: () => {
        showAlert("Error", "Failed to create account. Try again.", "error");
    },
});

  const handleFinish = async () => {
    if (children.length === 0) {
      return showAlert("No Children", "Please add at least one child.", "warning");
    }

    const parentPayload = {
      firstName,
      lastName,
      email,
      password, // backend should hash
      children: children.map(c => ({
        firstName: c.firstName,
        lastName: c.lastName,
        nickName: c.nickName,
        age: c.age,
        avatar: c.avatar,
      })),
    };
    createParentMutation.mutate(parentPayload);

    };
  


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 overflow-y-auto">
      <div className="w-full max-w-md md:max-w-lg flex flex-col items-center px-6 py-10 bg-gradient-to-b from-purple-200/30 to-purple-700 text-center rounded-3xl">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full mx-auto shadow-xl overflow-hidden mb-4">
            <ImageWithFallback
              src="/assets/YoungScholarlogo.jpg"
              alt="App Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">YoungScholars</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {step === "parent" ? "Create Parent Account" : "Add Children"}
          </h2>
          <p className="text-gray-700">{step === "parent" ? "Step 1 of 2" : "Step 2 of 2"}</p>
        </div>

        <Card className="w-full p-6 shadow-lg rounded-2xl bg-white/90 border-2 border-purple-500">
          {step === "parent" && (
            <form onSubmit={handleParentSubmit} className="space-y-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-5 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <Button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition">
                Continue
              </Button>

              {onBack && (
                <Button type="button" onClick={onBack} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition">
                  Back
                </Button>
              )}
            </form>
          )}

          {step === "children" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="childFirstName">First Name</Label>
                <Input id="childFirstName" placeholder="First Name" value={childFirstName} onChange={e => setChildFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="childLastName">Last Name</Label>
                <Input id="childLastName" placeholder="Last Name" value={childLastName} onChange={e => setChildLastName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="childNickname">Nickname</Label>
                <Input id="childNickname" placeholder="Nickname" value={childNickname} onChange={e => setChildNickname(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="childAge">Age</Label>
                <Input
                  id="childAge"
                  type="number"
                  placeholder="Age"
                  value={childAge}
                  onChange={e => setChildAge(Number(e.target.value))}
                  min={1}
                />
              </div>

              <Label>Choose Avatar</Label>
              <div className="flex space-x-3 mb-3 justify-center">
                {AVATARS.map(avatar => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt={`Avatar option ${avatar}`}
                    className={`w-12 h-12 rounded-full cursor-pointer border-2 ${childAvatar === avatar ? "border-purple-600" : "border-transparent"}`}
                    onClick={() => setChildAvatar(avatar)}
                  />
                ))}
              </div>

              <Button type="button" onClick={addChild} 
              disabled={!childFirstName || !childLastName || !childNickname || !childAge}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition">
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

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <Button type="button" onClick={handleFinish} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition">
                Finish
              </Button>

              <Button type="button" onClick={() => setStep("parent")} className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition">
                Back
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
