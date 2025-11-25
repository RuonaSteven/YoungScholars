import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import type { Parent, ChildWithUI } from "../types";

interface ChildSelectScreenProps {
  parent?: Parent;
  onSelectChild: (child: ChildWithUI) => void;
  childrenData: ChildWithUI[];
  onBack: () => void;
}

export const ChildSelectScreen: React.FC<ChildSelectScreenProps> = ({
  childrenData,
  onSelectChild,
  onBack,
}) => {
  const parent: Parent | null = JSON.parse(localStorage.getItem("youngScholarsParent") || "{}");
  const [children, setChildren] = useState<ChildWithUI[]>(
    JSON.parse(localStorage.getItem("youngScholarsChildren") || "[]") || []
  );

  const childrenWithNames = children.map((child) => ({
    ...child,
    name: `${child.firstName} ${child.lastName}`,
    favoriteBook: child.favoriteBooks || [],
  }));

  const defaultAvatars = [
    "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333600.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333635.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333629.png",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChild, setNewChild] = useState<ChildWithUI>({
    id: 0,
    firstName: "",
    lastName: "",
    name: "",
    nickName: "",
    parentId: parent?.id || 0,
    avatar: "",
    age: 0,
    lastRead: "",
    favoriteBooks: [],
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeChildId, setActiveChildId] = useState<number | null>(null); // track which child is being updated

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChildId !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedChildren = children.map((child) =>
          child.id === activeChildId ? { ...child, avatar: reader.result as string } : child
        );
        setChildren(updatedChildren);
        localStorage.setItem("youngScholarsChildren", JSON.stringify(updatedChildren));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (childId: number) => {
    setActiveChildId(childId);
    fileInputRef.current?.click();
  };

  const handleAddChild = () => {
    if (!newChild.firstName || !newChild.lastName || !newChild.age || !newChild.nickName) {
      alert("Please fill in all required fields (Name, Age, Nickname).");
      return;
    }

    const childToAdd: ChildWithUI = {
      ...newChild,
      name: `${newChild.firstName} ${newChild.lastName}`,
      id: children.length + 1,
      parentId: parent?.id || 0,
      lastRead: "",
      favoriteBooks: [],
    };

    const updatedChildren = [...children, childToAdd];
    setChildren(updatedChildren);
    localStorage.setItem("youngScholarsChildren", JSON.stringify(updatedChildren));
    setIsModalOpen(false);

    setNewChild({
      id: 0,
      firstName: "",
      lastName: "",
      nickName: "",
      parentId: parent?.id || 0,
      name: "",
      age: 0,
      avatar: "",
      lastRead: "",
      favoriteBooks: [],
    });
  };

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center min-h-screen bg-linear-to-b from-purple-500 to-purple-600 p-6">
      {parent && (
        <motion.h1
          className="text-3xl font-bold text-white mb-6 mt-4 text-center"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Hi, {parent.firstName} {parent.lastName} 👋
        </motion.h1>
      )}

      <motion.p
        className="text-white mb-6 top-0 text-center font-bold text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Please choose your reader's account to continue 📚
      </motion.p>

      {/* Child cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl">
        {childrenWithNames.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card
              onClick={() => onSelectChild(child)}
              className="cursor-pointer hover:shadow-xl transition transform hover:scale-[1.02] border-purple-300 rounded-2xl bg-purple-200 h-full w-full"
            >
              <CardContent className="flex items-center gap-6 p-4 mb-6 h-full">
                {/* Avatar (clickable for update) */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 bg-white border-2 border-dashed border-purple-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    handleAvatarClick(child.id);
                  }}
                >
                  <img
                    src={child.avatar || defaultAvatars[index % defaultAvatars.length]}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <p className="text-base font-bold text-purple-600 mb-1 bg-white px-3 py-1 rounded-xl">
                    Name: {child.firstName} {child.lastName} ({child.nickName || "No nickname"})
                  </p>
                  <p className="text-base font-bold text-purple-600 mb-1 bg-white px-3 py-1 rounded-xl">
                    Age: {child.age || "N/A"}
                  </p>
                  <p className="text-base font-bold text-purple-600 mb-1 bg-white px-3 py-1 rounded-xl">
                    📖 Last Read: <span className="font-medium">{child.lastRead || "—"}</span>
                  </p>
                  <p className="text-base font-bold text-purple-600 mb-1 bg-white px-3 py-1 rounded-xl">
                    ❤️ Most Enjoyed: <span className="font-medium"> {child.favoriteBook.length > 0 ? child.favoriteBook.join(", ") : "—"}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Hidden file input for avatar update */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <Button
          variant="default"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Add New Child
        </Button>

        <Button
          variant="outline"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-xl"
          onClick={onBack}
        >
          ← Back
        </Button>
      </motion.div>

      {/* Add Child Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Child</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="First Name"
              value={newChild.firstName}
              onChange={(e) =>
                setNewChild({ ...newChild, firstName: e.target.value })
              }
            />
            <Input
              placeholder="Last Name"
              value={newChild.lastName}
              onChange={(e) =>
                setNewChild({ ...newChild, lastName: e.target.value })
              }
            />
            <Input
              placeholder="Nick Name"
              value={newChild.nickName}
              onChange={(e) =>
                setNewChild({ ...newChild, nickName: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Age"
              value={newChild.age || ""}
              onChange={(e) =>
                setNewChild({ ...newChild, age: Number(e.target.value) })
              }
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddChild}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save Child
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
