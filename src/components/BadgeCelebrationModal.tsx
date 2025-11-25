import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import type { Badge } from "../types";

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
  childName: string;
  currentIndex?: number;
  total?: number;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({
  isOpen,
  onClose,
  badge,
  childName,
  currentIndex,
  total,
}) => {
  useEffect(() => {
    if (isOpen && badge) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, badge]);

  if (!isOpen || !badge) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm text-center animate-bounce-in">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full" 
          style={{ backgroundColor: badge.color }}
          >
          <span className="text-4xl">{badge.icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-purple-700 mt-4">
          {badge.title}
        </h2>
        <p className="text-gray-600 mt-2">{badge.description}</p>
        <p className="text-gray-500 text-sm mt-1 italic">
          Congrats {childName}! 🎉
        </p>

        {total && (
          <p className="text-xs text-gray-400 mt-3">
            Badge {(currentIndex ?? 0) + 1} of {total}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};
