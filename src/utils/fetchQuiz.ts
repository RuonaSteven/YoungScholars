// src/utils/fetchQuiz.ts
import type { QuizQuestion } from "../types";

/**
 * Fetch quiz questions for a given book from the backend
 * @param bookId - ID of the book
 * @returns Promise of QuizQuestion[]
 */
export const fetchQuiz = async (bookId: string): Promise<QuizQuestion[]> => {
  try {
    const res = await fetch(`/api/quiz/${bookId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch quiz: ${res.status}`);
    }

    const data = await res.json();

    // Ensure backend data matches QuizQuestion type
    const questions: QuizQuestion[] = data.map((q: any) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
      answerIndex: q.answer_index, // map backend field to frontend type
    }));

    return questions;
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return [];
  }
};
