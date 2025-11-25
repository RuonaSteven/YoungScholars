// src/components/ReadingScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { Book, ChildWithUI, Badge } from "../types";
import { ArrowLeft, Type, Bookmark, Sun, Moon, Volume2, VolumeX, Plus, Minus } from "lucide-react";
import { getNextReadingLevel } from "../utils/readingLevel";
import { BadgeCelebrationModal } from "./BadgeCelebrationModal";
import { updateChildBadges } from "../utils/badges";
import { showAlert } from "../utils/alertTheme";

interface QuizQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
}

interface ReadingScreenProps {
  book: Book;
  child: ChildWithUI;
  onBack: () => void;
  onBookComplete: (updatedChild: ChildWithUI) => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ book, child, onBack, onBookComplete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [isComplete, setIsComplete] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const totalPages = book.pages?.length || 1;
  const progress = (currentPage / totalPages) * 100;
  const saveKey = `youngscholars_progress_${book.id}`;
  const pages = book.pages ?? [];
  const page = pages[currentPage - 1];
  if (!pages.length) return <p>No pages available for this book.</p>;

  const pageText = page?.text ?? "";
  const sentences = pageText.split(/(?<=[.!?])\s+/);

  // --- Load progress ---
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

  // --- Save progress ---
  useEffect(() => {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ currentPage, quizAnswers }));
    } catch {}
  }, [currentPage, quizAnswers]);

  // --- Fetch quiz on last page (safe) ---
  useEffect(() => {
    if (currentPage === totalPages) {
      fetch(`/api/quiz/${book.id}`)
        .then(res => (res.ok ? res.json() : []))
        .then((data: QuizQuestion[]) => setQuizQuestions(data || []))
        .catch(() => setQuizQuestions([]));
    }
  }, [currentPage, totalPages, book.id]);

  // --- Scroll to top on mount ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Stop reading on unmount / page changes ---
  useEffect(() => {
    return () => stopReading();
  }, [currentPage]);

  // --- TEXT TO SPEECH ---
  const startReading = () => {
    if (!("speechSynthesis" in window)) {
      // replaced normal alert with sweet alert helper
      showAlert("Text-to-speech unavailable", "Text-to-speech is not supported on this device.", "warning");
      return;
    }
    stopReading();

    synthRef.current = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.rate = speechRate;
    utterance.lang = "en-US";

    utterance.onboundary = (event) => {
      const charIndex = (event as any).charIndex || 0;
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
    if (synthRef.current?.speaking) {
      synthRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeReading = () => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
    } else {
      startReading();
    }
  };

  const stopReading = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
  };

  // --- NAVIGATION ---
  const nextPage = () => {
    stopReading();
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    stopReading();
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // --- QUIZ ---
  const handleQuizAnswer = (qIndex: number, choiceIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: choiceIndex }));
  };

  const renderQuiz = () =>
    quizQuestions.length > 0 && (
      <div className="mt-10 p-6 rounded-xl bg-white/80 shadow-lg border">
        <h3 className="text-2xl font-bold mb-4 text-center">Quick Quiz</h3>
        {quizQuestions.map((q, i) => (
          <div key={i} className="mt-3 p-3 border rounded-lg">
            <p className="font-medium">{i + 1}. {q.question}</p>
            <div className="mt-2 grid gap-2">
              {q.choices.map((c, ci) => {
                const selected = quizAnswers[i] === ci;
                const isCorrect = q.answerIndex === ci;
                const showResult = typeof quizAnswers[i] === "number";
                return (
                  <button
                    key={ci}
                    onClick={() => handleQuizAnswer(i, ci)}
                    className={`text-left p-2 rounded ${selected ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-gray-100"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{String.fromCharCode(65 + ci)}. {c}</span>
                      {showResult && (
                        <span className={`text-sm ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                          {isCorrect ? "✓" : selected ? "✕" : ""}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );

  const fontSizeClasses = { small: "text-lg", medium: "text-xl", large: "text-2xl" };

  // --- Save completion history helper ---
  const saveCompletionHistory = (childId: number | undefined) => {
    try {
      const raw = localStorage.getItem("youngScholarsReadingHistory");
      const history = raw ? JSON.parse(raw) : [];
      history.unshift({
        bookId: book.id,
        title: book.title,
        childId,
        completedAt: new Date().toISOString(),
        pages: totalPages
      });
      // Keep last 50 entries
      localStorage.setItem("youngScholarsReadingHistory", JSON.stringify(history.slice(0, 50)));
    } catch {}
  };

  // --- Confetti helper (dynamic import) ---
  const fireConfetti = async () => {
    try {
      const confetti = await import("canvas-confetti");
      // a few bursts
      confetti.default({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => confetti.default({ particleCount: 80, spread: 90, origin: { y: 0.6 } }), 400);
      setTimeout(() => confetti.default({ particleCount: 60, spread: 110, origin: { y: 0.6 } }), 900);
    } catch (e) {
      // canvas-confetti not installed — silently continue
      // optionally you can fallback to a CSS animation or do nothing
    }
  };

  // --- HANDLE FINISHING BOOK (LEVEL + BADGES) ---
  const handleFinishBook = async () => {
    if (!child) return;

    // show sweet alert success
    showAlert(
      "🎉 Book Completed!",
      `Great job, ${child.firstName}! You finished "${book.title}"!`,
      "success"
    );

    // award badges and bump booksRead
    const { updatedChild, newBadges } = updateChildBadges({
      ...child,
      booksRead: (child.booksRead ?? 0) + 1,
    });

    // level up
    const newLevel = getNextReadingLevel(child.readingLevel || "Beginner");
    if (newLevel !== child.readingLevel) {
      updatedChild.readingLevel = newLevel;
      showAlert("🌟 Level Up!", `${child.firstName}, you are now at the ${newLevel} level!`, "success");
    }

    // store active child and history
    localStorage.setItem("youngScholarsActiveChild", JSON.stringify(updatedChild));
    saveCompletionHistory(updatedChild.id);

    // call parent handler
    onBookComplete(updatedChild);

    // show confetti + badge modal
    await fireConfetti();
    if (newBadges.length > 0) {
      setEarnedBadges(newBadges);
      setCurrentBadgeIndex(0);
      setShowModal(true);
    }

    setIsComplete(true);
  };

  // --- Restart Book (reset progress and storage) ---
  const handleRestartBook = () => {
    stopReading();
    setCurrentPage(1);
    setQuizAnswers({});
    setIsComplete(false);
    try {
      // update saved progress
      localStorage.removeItem(saveKey);
    } catch {}
    showAlert("Restarted", `You can start "${book.title}" again.`, "info");
  };

  // --- Auto advance badge modal ---
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

  const handleClose = () => {
    if (currentBadgeIndex < earnedBadges.length - 1) {
      setCurrentBadgeIndex((i) => i + 1);
    } else {
      setShowModal(false);
      setEarnedBadges([]);
    }
  };

  // small robustness for quiz fetch
  useEffect(() => {
    if (currentPage === totalPages) {
      fetch(`/api/quiz/${book.id}`)
        .then(res => (res.ok ? res.json() : []))
        .then((data: QuizQuestion[]) => setQuizQuestions(data || []))
        .catch(() => setQuizQuestions([]));
    }
  }, [currentPage, totalPages, book.id]);

  useEffect(() => stopReading, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-linear-to-b from-amber-50 to-orange-50 text-gray-800"}`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white/80"} backdrop-blur-sm`}>
        <Button onClick={onBack} variant="ghost" className="absolute left-4 top-3 flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-1 rounded-full shadow-md border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition active:scale-95">
          <ArrowLeft className="w-5 h-5"/>
          Back
        </Button>

        <div className="flex items-center space-x-3">
          <Button onClick={() => {
            const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
            const idx = sizes.indexOf(fontSize);
            setFontSize(sizes[(idx + 1) % sizes.length]);
          }} variant="ghost"><Type /></Button>

          <Button onClick={isPlaying ? pauseReading : resumeReading} variant="ghost">
            {isPlaying ? <VolumeX /> : <Volume2 />}
          </Button>

          <Button onClick={() => setSpeechRate(Math.max(0.5, speechRate - 0.1))} variant="ghost"><Minus /></Button>
          <Button onClick={() => setSpeechRate(Math.min(2, speechRate + 0.1))} variant="ghost"><Plus /></Button>

          <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="ghost">
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>

          <Button onClick={() => { setIsBookmarked(!isBookmarked); showAlert(isBookmarked ? "Removed Bookmark" : "Bookmarked", isBookmarked ? "Bookmark removed" : "This book is bookmarked", "info"); }} variant="ghost">
            <Bookmark className={isBookmarked ? "fill-blue-500 text-blue-500" : ""} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleRestartBook} variant="default" className="hidden sm:inline-flex">Restart Book</Button>
          <Button
            variant="default"
            onClick={handleFinishBook}
            disabled={isComplete}
          >
            {isComplete ? "Completed ✅" : "Finish Reading"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bold text-3xl mb-3">{book.title}</h1>
          <p className="text-gray-600 mb-6">by {book.author}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                const offset = info.offset.x;
                const velocity = info.velocity.x;
                if (offset < -100 || velocity < -500) nextPage();
                if (offset > 100 || velocity > 500) prevPage();
              }}
            >
              {page.image && (
                <img src={page.image} alt="illustration" className="mx-auto mb-6 rounded-lg max-h-[400px]" />
              )}
              <p className={`${fontSizeClasses[fontSize]} leading-relaxed`}>
                {sentences.map((s, idx) => (
                  <span key={idx} className={idx === currentSentenceIndex ? "bg-yellow-200 px-1 rounded" : ""}>
                    {s}{" "}
                  </span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              onClick={() => {
                if (currentPage === totalPages) handleFinishBook();
                else nextPage();
              }}
              disabled={
                currentPage === totalPages &&
                quizQuestions.length > 0 &&
                Object.keys(quizAnswers).length < quizQuestions.length
              }
            >
              {currentPage === totalPages ? "Finish Book" : "Next"}
            </Button>
          </div>

          {currentPage === totalPages && renderQuiz()}
        </div>
      </div>

      <BadgeCelebrationModal
        isOpen={showModal}
        onClose={handleClose}
        badge={earnedBadges[currentBadgeIndex] || null}
        childName={`${child.nickName || child.firstName} ${child.lastName}`}
        currentIndex={currentBadgeIndex}
        total={earnedBadges.length}
      />

      {/* Progress */}
      <div className="px-8 py-6 border-t bg-white/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 mt-2 rounded-full" />
      </div>
    </div>
  );
};
