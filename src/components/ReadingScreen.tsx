// src/components/ReadingScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { Book, ChildWithUI, Badge, QuizQuestion } from "../types";
import {
  ArrowLeft,
  Type,
  Bookmark,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Plus,
  Minus,
} from "lucide-react";

import { getNextReadingLevel } from "../utils/readingLevel";
import { BadgeCelebrationModal } from "./BadgeCelebrationModal";
import { updateChildBadges } from "../utils/badges";
import { showAlert } from "../utils/alertTheme";
import { fetchQuiz } from "../utils/fetchQuiz";
import { useQuery } from "@tanstack/react-query";

interface ReadingScreenProps {
  book: Book;
  child: ChildWithUI;
  onBack: () => void;
  onBookComplete: (updatedChild: ChildWithUI) => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({
  book,
  child,
  onBack,
  onBookComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalPages = book.pages?.length || 1;
  const pages = book.pages ?? [];

  if (!pages.length) return <p>No pages available for this book.</p>;

  const saveKey = `youngscholars_progress_${book.id}`;
  const progress = (currentPage / totalPages) * 100;
  const pageText = pages[currentPage - 1].text ?? "";
  const sentences = pageText.split(/(?<=[.!?])\s+/);

  // Load saved progress
  useEffect(() => {
    const raw = localStorage.getItem(saveKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.currentPage) setCurrentPage(parsed.currentPage);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
      } catch {}
    }
  }, [book.id]);

  // Save progress
  useEffect(() => {
    localStorage.setItem(saveKey, JSON.stringify({ currentPage, quizAnswers }));
  }, [currentPage, quizAnswers]);

  // Fetch quiz from backend (only for last page)
  const { data = [], isLoading: quizLoading, error: quizError } = useQuery({
    queryKey: ["quiz", book.id],
    queryFn: () => fetchQuiz(book.id).then((qs) =>
      qs.map((q: any) => ({ ...q, answerIndex: q.answer_index }))
    ),
    enabled: currentPage === totalPages,
    staleTime: 1000 * 60 * 10,
  });

  const quizQuestions: QuizQuestion[] = data;

  // Text-to-speech
  const startReading = () => {
    if (!("speechSynthesis" in window)) {
      showAlert("Text-to-speech unavailable", "Your device doesn't support TTS.", "warning");
      return;
    }
    stopReading();

    synthRef.current = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.rate = speechRate;

    utterance.onboundary = (e) => {
      const charIndex = (e as any).charIndex || 0;
      let acc = 0;
      for (let i = 0; i < sentences.length; i++) {
        acc += sentences[i].length + 1;
        if (charIndex <= acc) {
          setCurrentSentenceIndex(i);
          break;
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSentenceIndex(0);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const pauseReading = () => {
    synthRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeReading = () => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
    } else startReading();
  };

  const stopReading = () => {
    synthRef.current?.cancel();
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
  };

  useEffect(() => stopReading, []);

  // Navigation
  const nextPage = () => {
    stopReading();
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    stopReading();
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Quiz answer
  const handleQuizAnswer = (qIndex: number, cIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: cIndex }));
  };

  const renderQuiz = () =>
    quizQuestions.length > 0 && (
      <div className="mt-10 p-6 rounded-xl bg-white shadow-lg border">
        <h3 className="text-2xl font-bold mb-4 text-center">Quick Quiz</h3>
        {quizQuestions.map((q, i) => {
          const selected = quizAnswers[i];
          const showResult = typeof selected === "number";

          return (
            <div key={q.id} className="mt-3 p-3 border rounded-lg">
              <p className="font-medium">{i + 1}. {q.question}</p>
              <div className="mt-2 grid gap-2">
                {q.choices.map((c, ci) => {
                  const isCorrect = q.answerIndex === ci;
                  const isSelected = selected === ci;

                  return (
                    <button
                      key={ci}
                      onClick={() => handleQuizAnswer(i, ci)}
                      className={`text-left p-2 rounded ${
                        isSelected ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{String.fromCharCode(65 + ci)}. {c}</span>
                        {showResult && (
                          <span className={`text-sm ${isCorrect ? "text-green-600" : isSelected ? "text-red-500" : ""}`}>
                            {isCorrect ? "✓" : isSelected ? "✕" : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );

  // Finish book
  const handleFinishBook = async () => {
  if (!child) return;

  showAlert(
    "🎉 Book Completed!",
    `Great job, ${child.firstName}! You finished "${book.title}"!`,
    "success"
  );

  // Update badges and books read
  const { updatedChild, newBadges } = updateChildBadges({
    ...child,
    booksRead: (child.booksRead ?? 0) + 1,
  });

  // Fix: Use a valid ReadingLevel default
  const newLevel = getNextReadingLevel(child.readingLevel ?? "Read-along");
  if (newLevel !== child.readingLevel) {
    updatedChild.readingLevel = newLevel;
    showAlert(
      "🌟 Level Up!",
      `${child.firstName}, you're now ${newLevel}!`,
      "success"
    );
  }

  // Save updated child locally
  localStorage.setItem("youngScholarsActiveChild", JSON.stringify(updatedChild));
  onBookComplete(updatedChild);

  // Show badge modal if any new badges
  if (newBadges.length > 0) {
    setEarnedBadges(newBadges);
    setCurrentBadgeIndex(0);
    setShowModal(true);
  }

  setIsComplete(true);
};


  const fontSizeClasses = { small: "text-lg", medium: "text-xl", large: "text-2xl" };

  // Badge auto-advance
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      if (currentBadgeIndex < earnedBadges.length - 1) {
        setCurrentBadgeIndex((i) => i + 1);
      } else {
        setShowModal(false);
        setEarnedBadges([]);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [showModal, currentBadgeIndex, earnedBadges]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-orange-50 text-gray-800"}`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white/80"} backdrop-blur-sm`}>
        <Button onClick={onBack} variant="ghost" className="absolute left-4 top-3 bg-purple-600 text-white px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition">
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={() => {
            const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
            const idx = sizes.indexOf(fontSize);
            setFontSize(sizes[(idx + 1) % sizes.length]);
          }}>
            <Type />
          </Button>

          <Button variant="ghost" onClick={isPlaying ? pauseReading : resumeReading}>
            {isPlaying ? <VolumeX /> : <Volume2 />}
          </Button>

          <Button variant="ghost" onClick={() => setSpeechRate(Math.max(0.5, speechRate - 0.1))}><Minus /></Button>
          <Button variant="ghost" onClick={() => setSpeechRate(Math.min(2, speechRate + 0.1))}><Plus /></Button>

          <Button variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>

          <Button variant="ghost" onClick={() => { setIsBookmarked(!isBookmarked); showAlert(isBookmarked ? "Bookmark removed" : "Bookmarked", `"${book.title}"`, "info"); }}>
            <Bookmark className={isBookmarked ? "fill-blue-500 text-blue-500" : ""} />
          </Button>
        </div>

        <Button onClick={handleFinishBook} disabled={isComplete}>
          {isComplete ? "Completed ✓" : "Finish Reading"}
        </Button>
      </div>

      {/* Content */}
      <div className="px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-bold text-3xl mb-3">{book.title}</h1>
          <p className="text-gray-600 mb-6">by {book.author}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.4 }}
            >
              {pages[currentPage - 1].image && (
                <img src={pages[currentPage - 1].image} alt="illustration" className="mx-auto mb-6 rounded-lg max-h-[400px]" />
              )}

              <p className={`${fontSizeClasses[fontSize]} leading-relaxed`}>
                {sentences.map((s, i) => (
                  <span key={i} className={i === currentSentenceIndex ? "bg-yellow-200 px-1 rounded" : ""}>{s} </span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            <Button onClick={prevPage} disabled={currentPage === 1}>Prev</Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              disabled={currentPage === totalPages && quizQuestions.length > 0 && Object.keys(quizAnswers).length < quizQuestions.length}
              onClick={() => { if (currentPage === totalPages) handleFinishBook(); else nextPage(); }}
            >
              {currentPage === totalPages ? "Finish Book" : "Next"}
            </Button>
          </div>

          {/* Quiz */}
          {currentPage === totalPages && renderQuiz()}
        </div>
      </div>

      {/* Badge modal */}
      <BadgeCelebrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        badge={earnedBadges[currentBadgeIndex] || null}
        childName={child.nickName || child.firstName}
        currentIndex={currentBadgeIndex}
        total={earnedBadges.length}
      />

      {/* Progress */}
      <div className="px-8 py-4 border-t bg-white/80">
        <div className="max-w-3xl mx-auto flex justify-between">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 mt-2 rounded-full" />
      </div>
    </div>
  );
};
