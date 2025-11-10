import React from "react";
import { Button } from "./ui/button";

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {/* Add your settings options here */}
      <Button onClick={onBack} className="mt-4">
        Back
      </Button>
    </div>
  );
};
