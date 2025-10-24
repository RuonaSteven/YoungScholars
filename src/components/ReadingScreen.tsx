import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { Book } from "../types";
import { ArrowLeft, Type, Bookmark, Sun, Moon, Volume2, VolumeX } from "lucide-react";

interface QuizQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
}

interface ReadingScreenProps {
  book: Book;
  onBack: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ book, onBack }) => {
  // ---------- STATES ----------
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});

  // ---------- TEXT-TO-SPEECH REFS ----------
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalPages = book.pages?.length || 1;
  const progress = (currentPage / totalPages) * 100;
  const saveKey = `youngscholars_progress_${book.id}`;

  // ---------- HELPER FUNCTION (moved up to avoid "used before declaration") ----------
  const splitSentences = (text: string): string[] => text.split(/(?<=[.!?])\s+/);

  // ---------- PAGE TEXT ----------
  const page = book.pages[currentPage - 1];
  const pageText = page?.text ?? "";
  const sentences = splitSentences(pageText);

  // ---------- LOAD SAVED PROGRESS ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(saveKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.currentPage) setCurrentPage(parsed.currentPage);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
      }
    } catch (e) {
      console.warn("Could not load progress", e);
    }

    return () => stopReading();
  }, [book.id]);

  // ---------- SAVE PROGRESS ----------
  useEffect(() => {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ currentPage, quizAnswers }));
    } catch (e) {
      console.warn("Could not save progress", e);
    }
  }, [currentPage, quizAnswers]);

  // ---------- FETCH QUIZ ----------
  useEffect(() => {
    if (currentPage === totalPages) {
      fetch(`/api/quiz/${book.id}`)
        .then(res => res.json())
        .then((data: QuizQuestion[]) => setQuizQuestions(data))
        .catch(err => console.error("Failed to load quiz", err));
    }
  }, [currentPage, book.id, totalPages]);

  // ---------- TEXT-TO-SPEECH ----------
  const startReading = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported on this browser.");
      return;
    }

    stopReading();

    synthRef.current = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(pageText);
    utter.lang = "en-US";

    utter.onboundary = (event) => {
      const charIndex = event.charIndex || 0;
      let acc = 0;
      for (let i = 0; i < sentences.length; i++) {
        acc += sentences[i].length + 1;
        if (charIndex <= acc) {
          setCurrentSentenceIndex(i);
          break;
        }
      }
    };

    utter.onend = () => {
      setIsPlaying(false);
      setCurrentSentenceIndex(0);
    };

    utteranceRef.current = utter;
    synthRef.current.speak(utter);
    setIsPlaying(true);
  };

  const pauseReading = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeReading = () => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
    } else {
      startReading();
    }
  };

  const stopReading = () => {
    try {
      if (synthRef.current) synthRef.current.cancel();
    } catch {}
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
  };

  // ---------- PAGE NAVIGATION ----------
  const nextPage = () => {
    stopReading();
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    stopReading();
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // ---------- QUIZ LOGIC ----------
  const handleQuizAnswer = (qIndex: number, choiceIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: choiceIndex }));
  };

  const renderQuiz = () => {
    if (!quizQuestions || quizQuestions.length === 0) return null;
    return (
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
  };

  // ---------- FONT SIZE MAP ----------
  const fontSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  };

  // ---------- RENDER ----------
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-amber-50 to-orange-50 text-gray-800"}`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white/80"} backdrop-blur-sm`}>
        <Button onClick={onBack} variant="ghost" className={`p-3 rounded-full min-h-[48px] min-w-[48px] ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
          <ArrowLeft className="w-7 h-7" />
        </Button>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
              const currentIndex = sizes.indexOf(fontSize);
              setFontSize(sizes[(currentIndex + 1) % sizes.length]);
            }}
            variant="ghost"
            className={`p-3 rounded-full ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Type className="w-7 h-7" />
          </Button>

          <Button onClick={isPlaying ? pauseReading : startReading} variant="ghost" className={`p-3 rounded-full ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
            {isPlaying ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
          </Button>

          <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="ghost" className={`p-3 rounded-full ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
            {isDarkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
          </Button>

          <Button onClick={() => setIsBookmarked(!isBookmarked)} variant="ghost" className={`p-3 rounded-full ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
            <Bookmark className={`w-7 h-7 transition-colors ${isBookmarked ? (isDarkMode ? "fill-yellow-400 text-yellow-400" : "fill-blue-500 text-blue-500") : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-3xl mb-3">{book.title}</h1>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>by {book.author}</p>
          </div>

          {/* Page Content */}
          <div className="page-content mb-12 text-center">
            {page.text && <p className={`${fontSizeClasses[fontSize]} leading-relaxed mb-6`}>{page.text}</p>}
            {page.image && <img src={page.image} alt="page illustration" className="mx-auto rounded-lg shadow-md" />}
            {page.images && page.images.map((img, idx) => (
              <img key={idx} src={img} alt={`illustration ${idx + 1}`} className="mx-auto rounded-lg shadow-md mb-4" />
            ))}
          </div>

          {/* Page Navigation */}
          <div className="flex justify-between items-center mb-12">
            <Button onClick={prevPage} disabled={currentPage === 1} className={`px-8 py-4 rounded-3xl font-semibold text-lg min-h-[56px] ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-xl active:scale-95"}`}>
              Previous
            </Button>
            <div className={`px-6 py-3 rounded-full ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white/80 text-gray-600"} font-medium shadow-lg text-lg`}>
              Page {currentPage} of {totalPages}
            </div>
            <Button onClick={nextPage} disabled={currentPage === totalPages} className={`px-8 py-4 rounded-3xl font-semibold text-lg min-h-[56px] ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-xl active:scale-95"}`}>
              Next
            </Button>
          </div>

          {/* Quiz */}
          {currentPage === totalPages && renderQuiz()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`px-8 py-6 border-t ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white/80"} backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Reading Progress</span>
            <span className={`text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>
      </div>
    </div>
  );
};
