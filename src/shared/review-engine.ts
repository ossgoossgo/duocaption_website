import type { SentenceCard } from "./card-types";
import { segmentText } from "@content/providers/word-segmenter";

export function sortForReview(cards: SentenceCard[]): SentenceCard[] {
  return [...cards].sort((a, b) => {
    if (a.streak !== b.streak) return a.streak - b.streak;
    if (a.wrongCount !== b.wrongCount) return b.wrongCount - a.wrongCount;
    const aTime = a.lastReviewAt || "0";
    const bTime = b.lastReviewAt || "0";
    return aTime.localeCompare(bTime);
  });
}

export function markCorrect(card: SentenceCard): SentenceCard {
  return {
    ...card,
    correctCount: card.correctCount + 1,
    streak: card.streak + 1,
    lastReviewAt: new Date().toISOString(),
  };
}

export function markWrong(card: SentenceCard): SentenceCard {
  return {
    ...card,
    wrongCount: card.wrongCount + 1,
    streak: 0,
    lastReviewAt: new Date().toISOString(),
  };
}

export interface ClozeResult {
  segments: string[];
  blankIndex: number;
  correctAnswer: string;
  options: string[];
}

export function generateClozeOptions(
  card: SentenceCard,
  allCards: SentenceCard[],
  lang: string,
): ClozeResult | null {
  const segments = segmentText(card.original, lang);
  const words = segments.filter((s) => s.isWordLike);

  if (words.length < 2) return null;

  const blankWord = words[Math.floor(Math.random() * words.length)];
  const blankIndex = segments.findIndex(
    (s) => s.isWordLike && s.word === blankWord.word,
  );

  const candidates = new Set<string>();

  for (const w of words) {
    if (w.word !== blankWord.word) candidates.add(w.word);
  }

  for (const other of allCards) {
    if (other.id === card.id) continue;
    const otherSegments = segmentText(other.original, lang);
    for (const s of otherSegments) {
      if (s.isWordLike && s.word !== blankWord.word) candidates.add(s.word);
    }
    if (candidates.size >= 10) break;
  }

  const distractors = [...candidates].slice(0, 3);

  while (distractors.length < 3) {
    distractors.push("___");
  }

  const options = [blankWord.word, ...distractors].sort(
    () => Math.random() - 0.5,
  );

  return {
    segments: segments.map((s) => s.word),
    blankIndex,
    correctAnswer: blankWord.word,
    options,
  };
}

export interface ReviewStats {
  totalCards: number;
  streakGroups: {
    new: number;
    learning: number;
    familiar: number;
    mastered: number;
  };
  totalCorrect: number;
  totalWrong: number;
}

export function calculateStats(cards: SentenceCard[]): ReviewStats {
  const stats: ReviewStats = {
    totalCards: cards.length,
    streakGroups: { new: 0, learning: 0, familiar: 0, mastered: 0 },
    totalCorrect: 0,
    totalWrong: 0,
  };

  for (const card of cards) {
    if (card.streak === 0) stats.streakGroups.new++;
    else if (card.streak <= 2) stats.streakGroups.learning++;
    else if (card.streak <= 4) stats.streakGroups.familiar++;
    else stats.streakGroups.mastered++;

    stats.totalCorrect += card.correctCount;
    stats.totalWrong += card.wrongCount;
  }

  return stats;
}
