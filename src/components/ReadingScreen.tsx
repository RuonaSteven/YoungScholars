import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { Book, Child } from "../types";
import { ArrowLeft, Type, Bookmark, Sun, Moon, Volume2, VolumeX, Plus, Minus } from "lucide-react";
import { getNextReadingLevel } from "../utils/readingLevel";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalPages = book.pages?.length || 1;
  const progress = (currentPage / totalPages) * 100;
  const saveKey = `youngscholars_progress_${book.id}`;

  const splitSentences = (text: string): string[] => text.split(/(?<=[.!?])\s+/);
  const pages = book.pages ?? [];
  const page = pages[currentPage - 1];
  const pageText = page?.text ?? "";
  const sentences = splitSentences(pageText);

  // Load progress
  useEffect(() => {
    const raw = localStorage.getItem(saveKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.currentPage) setCurrentPage(parsed.currentPage);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
      } catch {}
    }
    return () => stopReading();

  }, [book.id]);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(saveKey, JSON.stringify({ currentPage, quizAnswers }));
    } catch {}
  }, [currentPage, quizAnswers]);

  // Fetch quiz on last page
  useEffect(() => {
    if (currentPage === totalPages) {
      fetch(`/api/quiz/${book.id}`)
        .then(res => res.json())
        .then((data: QuizQuestion[]) => setQuizQuestions(data))
        .catch(() => {});
    }
  }, [currentPage, totalPages, book.id]);
  
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- TEXT TO SPEECH ---
  const startReading = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported on this device.");
      return;
    }
    stopReading();

    synthRef.current = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.rate = speechRate;
    utterance.lang = "en-US";

    utterance.onboundary = (event) => {
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

    const handleBookComplete = () => {
      const activeChild =
        JSON.parse(localStorage.getItem("youngScholarsActiveChild") || "null");

      if (!activeChild) return;

      // Increment books read
      activeChild.booksRead = (activeChild.booksRead || 0) + 1;

      // Level up if eligible
      const newLevel = getNextReadingLevel(activeChild.readingLevel || "Beginner");
      if (newLevel !== activeChild.readingLevel) {
        activeChild.readingLevel = newLevel;
        alert(`🎉 Amazing, ${activeChild.firstName}! You are now at the ${newLevel} level!`);
      }

      // Save updated child data
      localStorage.setItem("youngScholarsActiveChild", JSON.stringify(activeChild));
    };


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

          <Button onClick={() => setIsBookmarked(!isBookmarked)} variant="ghost">
            <Bookmark className={isBookmarked ? "fill-blue-500 text-blue-500" : ""} />
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
            <Button onClick={() => {
                    if (currentPage === totalPages) {
                      handleBookComplete();
                    } else {
                      nextPage();
                    }
                  }}
                  disabled={currentPage === totalPages && quizQuestions.length > 0}
                    >
                  {currentPage === totalPages ? "Finish Book" : "Next"}
              </Button>
          </div>
              {currentPage === totalPages && renderQuiz()}
                        </div>
                      </div>

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
