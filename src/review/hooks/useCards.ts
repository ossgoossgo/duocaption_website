import { useState, useEffect, useCallback } from "react";
import type { SentenceCard } from "@shared/card-types";

function sendMessage<T>(message: Record<string, unknown>): Promise<T> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: T) => resolve(response));
  });
}

export function useCards() {
  const [cards, setCards] = useState<SentenceCard[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await sendMessage<SentenceCard[]>({ type: "GET_CARDS" });
    setCards(result ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const updateCard = useCallback(async (card: SentenceCard) => {
    await sendMessage({ type: "UPDATE_CARD", payload: card });
    setCards(prev => prev.map(c => c.id === card.id ? card : c));
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    await sendMessage({ type: "DELETE_CARD", payload: { id } });
    setCards(prev => prev.filter(c => c.id !== id));
  }, []);

  return { cards, loading, reload, updateCard, deleteCard };
}

/** 從卡片列表提取節目資訊 */
export interface ShowInfo {
  showName: string;
  langPair: string;
  total: number;
  due: number;
  cards: SentenceCard[];
  lastReview: string;
  accent: string;
}

const SHOW_COLORS = ["#7c4b8f", "#d94a4a", "#7c6f5c", "#c66", "#c4302b", "#3c5a6e", "#4a7c8f", "#8f7c4b"];

/** 計算「待複習」：根據 streak 決定間隔，超過間隔的就是待複習 */
function isDue(card: SentenceCard): boolean {
  if (!card.lastReviewAt) return true; // 從沒複習過
  const intervals = [0, 1, 3, 7, 14, 30]; // streak 0~5+ 對應天數
  const intervalDays = intervals[Math.min(card.streak, intervals.length - 1)];
  const lastReview = new Date(card.lastReviewAt).getTime();
  const now = Date.now();
  return now - lastReview > intervalDays * 24 * 60 * 60 * 1000;
}

function formatRelativeDate(isoStr: string): string {
  if (!isoStr) return "從未";
  const diff = Date.now() - new Date(isoStr).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 週前`;
  return `${Math.floor(days / 30)} 個月前`;
}

export function groupByShow(cards: SentenceCard[]): ShowInfo[] {
  const map = new Map<string, SentenceCard[]>();
  for (const c of cards) {
    const key = c.showName || "未知節目";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }

  return [...map.entries()].map(([showName, showCards], i) => {
    const langPairs = new Set(showCards.map(c => `${c.originalLang} → ${c.translationLang}`));
    const dueCount = showCards.filter(isDue).length;
    const lastReviewDates = showCards.map(c => c.lastReviewAt).filter(Boolean).sort();
    const lastReview = lastReviewDates.length > 0 ? formatRelativeDate(lastReviewDates[lastReviewDates.length - 1]) : "從未";

    return {
      showName,
      langPair: [...langPairs][0] || "",
      total: showCards.length,
      due: dueCount,
      cards: showCards,
      lastReview,
      accent: SHOW_COLORS[i % SHOW_COLORS.length],
    };
  });
}

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}:${String(remMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export { isDue, formatRelativeDate };
