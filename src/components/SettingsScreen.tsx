// src/components/SettingsScreen.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChild } from "../utils/fetchChild";
import { Child, Screen } from "../types";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface SettingsScreenProps {
  child: Child;
  childrenList: Child[];
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  child,
  childrenList,
  onBack,
  onNavigate,
}) => {
  const [showReport, setShowReport] = useState(false);

  // Fetch child data live
  const { data, isLoading, error, refetch } = useQuery<Child>({
    queryKey: ["child", child.id],
    queryFn: () => fetchChild(child.id),
    initialData: child,
    staleTime: 1000 * 60 * 5,
  });

  // Re-fetch child data whenever `child.id` changes
  useEffect(() => {
    refetch();
  }, [child.id, refetch]);

  // Safely handle joinedDate and persist in localStorage
  const childData = useMemo(() => {
    if (!data) return child;
    if (!data.joinedDate) {
      const now = new Date().toISOString();
      localStorage.setItem(
        "youngScholarsActiveChild",
        JSON.stringify({ ...data, joinedDate: now })
      );
      return { ...data, joinedDate: now };
    }
    return data;
  }, [data, child]);

  if (isLoading) return <p className="p-6">Loading child info...</p>;
  if (error || !childData) return <p className="p-6 text-red-500">Failed to load child data.</p>;

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mt-6">Settings</h2>

      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="absolute left-4 top-3 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95 flex items-center gap-2"
      >
        <ArrowLeft className="w-7 h-7" />
        Back
      </Button>

      <div className="space-y-6 mt-6">
        {/* 🎖 Badges & Achievements */}
        <div className="bg-linear-to-br from-purple-600 to-violet-700 text-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-bold mb-3">🎖 Badges & Achievements</h2>
          {childData.badges && childData.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto">
              {childData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/20"
                >
                  <span className="text-2xl" style={{ color: badge.color }}>
                    {badge.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{badge.title}</p>
                    <p className="text-xs opacity-80">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-80">No badges earned yet. Keep reading to unlock achievements!</p>
          )}
        </div>

        {/* 🔥 Reading Streak */}
        <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-bold mb-3">🔥 Reading Streak</h2>
          <p className="text-sm mb-3 opacity-90">
            You’ve read for <span className="font-semibold text-white">{childData.streakDays ?? 0}</span> day(s) in a row!
          </p>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min((childData.streakDays ?? 0) * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* 📊 Progress & Insights */}
        <div className="bg-linear-to-br from-sky-600 to-blue-700 text-white rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-bold mb-3">📊 Reading Insights</h2>
          <ul className="text-sm space-y-2">
            <li>📚 <strong>{childData.booksRead ?? 0}</strong> books completed</li>
            <li>⏱️ Avg. reading time: <strong>{childData.totalReadingTime ?? '—'}</strong></li>
            <li>💡 Favorite category: <strong>{childData.favoriteBooks?.join(", ") ?? 'N/A'}</strong></li>
            <li>📖 Last book: <strong>{childData.currentBook ?? 'None yet'}</strong></li>
          </ul>

          <Button
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl py-2 transition"
            onClick={() => setShowReport(true)}
          >
            View Full Report
          </Button>
        </div>
      </div>

      {/* Full Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4">📋 Full Report: {childData.firstName} {childData.lastName}</h2>
            <p><strong>Nickname:</strong> {childData.nickName}</p>
            <p><strong>Age:</strong> {childData.age}</p>
            <p><strong>Joined:</strong> {new Date(childData.joinedDate!).toLocaleDateString()}</p>
            <p><strong>Books Read:</strong> {childData.booksRead ?? 0}</p>
            <p><strong>Total Reading Time:</strong> {childData.totalReadingTime ?? '—'}</p>
            <p><strong>Reading Streak:</strong> {childData.streakDays ?? 0} day(s)</p>
            <p><strong>Badges Earned:</strong> {childData.badges?.length ?? 0}</p>

            {childData.badges && childData.badges.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {childData.badges.map(b => (
                  <li key={b.id}>{b.title} ({b.earnedAt ? new Date(b.earnedAt).toLocaleDateString() : '—'})</li>
                ))}
              </ul>
            )}

            <Button
              className="mt-4 w-full bg-purple-600 text-white font-semibold rounded-xl py-2"
              onClick={() => setShowReport(false)}
            >
              Close
            </Button>

            {childrenList.length > 1 && (
              <Button
                onClick={() => onNavigate("childSelect")}
                variant="ghost"
                className="absolute left-1/2 bottom-3 transform -translate-x-1/2 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95"
              >
                Switch Child
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
