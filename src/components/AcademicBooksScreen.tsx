import React from "react";
import { Button } from "./ui/button";
import type { Screen, Book } from "../types"; // adjust path

interface AcademicsScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen, data?: Book | null) => void;
}

export const AcademicsScreen: React.FC<AcademicsScreenProps> = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
    <Button onClick={onBack} variant="ghost" className="mb-4">← Back</Button>
    <h2 className="text-2xl font-bold text-gray-700">Academics</h2>
    <p className="text-gray-500 mt-2">Coming soon...</p>
  </div>
);
