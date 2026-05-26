// src/shared/card-types.ts

export interface SentenceCard {
  id: string;
  original: string;
  translation: string;
  originalLang: string;
  translationLang: string;

  showName: string;
  seasonEpisode: string;
  timestamp: number;
  netflixId: string;

  correctCount: number;
  streak: number;
  wrongCount: number;
  lastReviewAt: string;
  savedAt: string;
}

export type ReviewMode = "comprehension" | "production" | "cloze";

export interface ReviewSettings {
  mode: ReviewMode;
}

export const DEFAULT_REVIEW_SETTINGS: ReviewSettings = {
  mode: "comprehension",
};
