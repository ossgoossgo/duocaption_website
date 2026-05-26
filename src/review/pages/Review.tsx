import { useState, useEffect, useCallback } from "react";
import { usePalette } from "../theme";
import { Chip } from "../components/Chip";
import { useCardsContext } from "../App";
import { groupByShow, formatTimestamp, formatRelativeDate, isDue } from "../hooks/useCards";
import { sortForReview, markCorrect, markWrong } from "@shared/review-engine";
import { speak } from "@shared/speech";
import { useVoicePreferences } from "../hooks/useSettings";
import { t } from "@shared/i18n";
import * as Icon from "../icons";
import type { Route } from "../App";

interface ReviewProps {
  onNavigate: (route: Route, show?: string) => void;
  selectedShow?: string;
}

export function Review({ onNavigate, selectedShow }: ReviewProps) {
  const P = usePalette();
  const { cards, updateCard } = useCardsContext();
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(() => localStorage.getItem("dc-auto-play") !== "false");
  const voicePrefs = useVoicePreferences();

  // 取得該劇的卡片並排序
  const shows = groupByShow(cards);
  const show = shows.find(s => s.showName === selectedShow);
  const sorted = sortForReview(show?.cards || cards);
  const total = sorted.length;
  const c = sorted[index];

  const speakOriginal = useCallback(() => {
    if (c) speak(c.original, c.originalLang, voicePrefs);
  }, [c, voicePrefs]);
  const progress = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

  const handleGot = useCallback(async () => {
    if (c) await updateCard(markCorrect(c));
    if (index + 1 >= total) onNavigate("done");
    else setIndex(index + 1);
  }, [index, total, c, updateCard, onNavigate]);

  const handleAgain = useCallback(async () => {
    if (c) await updateCard(markWrong(c));
    if (index + 1 >= total) onNavigate("done");
    else setIndex(index + 1);
  }, [index, total, c, updateCard, onNavigate]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => {
      const next = !prev;
      localStorage.setItem("dc-auto-play", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if (e.code === "ArrowRight" || e.code === "Period" || e.code === "KeyX" || e.code === "KeyF" || e.code === "KeyK") handleGot();
      else if (e.code === "ArrowLeft" || e.code === "Comma" || e.code === "KeyZ" || e.code === "KeyD" || e.code === "KeyJ") handleAgain();
      else if (e.code === "Space") { e.preventDefault(); speakOriginal(); }
      else if (e.code === "Delete" || e.code === "Backspace") { /* TODO: delete */ }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleGot, handleAgain, speakOriginal]);

  // 自動播放
  useEffect(() => {
    if (autoPlay && c) speakOriginal();
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: P.textMute }}>沒有卡片</div>;
  }

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <header style={{
        height: 56, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${P.border}`, background: P.panel,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span onClick={() => onNavigate("cards", selectedShow)} style={{
            padding: "5px 10px", border: `1px solid ${P.border}`, borderRadius: 6,
            fontSize: 12, color: P.textSoft, cursor: "pointer",
          }}>{"✕ " + t("review.session.end")}</span>
          <img src="/logo.png" alt="DuoCaption" style={{ height: 18, width: "auto" }} />
          <span style={{ fontSize: 13, color: P.textSoft }}>
            {c.showName} · 第 {index + 1} 張 · <span style={{ color: P.blue, fontWeight: P.w.medium }}>{t("review.session.bilingual")}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: P.textSoft, fontFamily: P.fontMono }}>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <div style={{ width: 240, height: 6, borderRadius: 3, background: P.borderSoft, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: P.blue, borderRadius: 3, transition: "width 0.3s ease" }} />
          </div>
          <span>{t("review.session.progress")} {progress}%</span>
        </div>
      </header>

      <main style={{
        flex: 1, padding: 32,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: P.bg,
      }}>
        <div style={{
          width: "100%", maxWidth: 880, background: P.panel,
          border: `1px solid ${P.border}`, borderRadius: 16, boxShadow: P.shadowLg,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 24px", borderBottom: `1px solid ${P.borderSoft}`,
            background: P.panelTint,
          }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Chip tone="blue">{c.originalLang} → {c.translationLang}</Chip>
              <Chip tone="mute">{c.showName} · {c.seasonEpisode}</Chip>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 8px", borderRadius: 6,
                background: P.panelTint, border: `1px solid ${P.borderSoft}`,
                cursor: "pointer", color: P.textSoft, fontSize: 12,
              }}>
                <Icon.Netflix size={12} /> {c.seasonEpisode} {formatTimestamp(c.timestamp)} ▶
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: P.textMute }}>
              <span>{t("review.card.reviewDate")}：{formatRelativeDate(c.lastReviewAt)}</span>
              <span style={{
                fontWeight: P.w.semibold,
                color: c.streak >= 6 ? P.red : c.streak >= 3 ? P.orange : P.textSoft,
              }}>{t("review.card.streakCount")} {c.streak}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>
            <div style={{ padding: "36px 36px 32px", borderRight: `1px solid ${P.borderSoft}`, background: P.panel }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, letterSpacing: 1, fontWeight: P.w.semibold }}>ORIGINAL · {c.originalLang.toUpperCase()}</span>
                <button onClick={speakOriginal} style={{
                  width: 30, height: 30, borderRadius: "50%", border: `1px solid ${P.border}`,
                  background: P.panel, color: P.blue, cursor: "pointer",
                  display: "grid", placeItems: "center",
                }}>
                  <Icon.Speaker size={14} />
                </button>
              </div>
              <div style={{ fontSize: 28, fontWeight: P.w.medium, lineHeight: 1.3, color: P.text, letterSpacing: -0.3 }}>
                "{c.original}"
              </div>
            </div>

            <div style={{ padding: "36px 36px 32px", background: P.panelTint }}>
              <div style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, letterSpacing: 1, fontWeight: P.w.semibold, marginBottom: 18 }}>
                TRANSLATION · {c.translationLang.toUpperCase()}
              </div>
              <div style={{ fontSize: 24, fontWeight: P.w.medium, lineHeight: 1.45, color: P.text }}>
                {c.translation}
              </div>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "16px 24px", borderTop: `1px solid ${P.borderSoft}`,
          }}>
            <label onClick={toggleAutoPlay} style={{
              fontSize: 12, color: P.textMute,
              display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none",
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1.5px solid ${autoPlay ? P.blue : P.border}`,
                background: autoPlay ? P.blue : "transparent",
                display: "grid", placeItems: "center",
              }}>
                {autoPlay && <Icon.Check size={12} style={{ color: "#fff" }} />}
              </span>
              {t("review.session.autoPlay")}
            </label>
            <span style={{ marginLeft: "auto", fontSize: 12, color: P.textMute }}>
              {t("review.session.hintKeys")}
            </span>
            <button className="dc-btn" onClick={handleAgain} style={{
              padding: "11px 20px", borderRadius: 8, border: `1px solid ${P.border}`,
              background: P.panel, color: P.text, fontSize: 14, fontWeight: P.w.medium, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <Icon.Again size={14} /> {t("review.session.again")} <span style={{ fontFamily: P.fontMono, fontSize: 12, color: P.textMute }}>←</span>
            </button>
            <button onClick={speakOriginal} style={{
              width: 42, height: 42, borderRadius: "50%", border: `1px solid ${P.border}`,
              background: P.panel, color: P.blue, cursor: "pointer",
              display: "grid", placeItems: "center",
            }}>
              <Icon.Speaker size={18} />
            </button>
            <button className="dc-btn-primary" onClick={handleGot} style={{
              padding: "11px 26px", borderRadius: 8, border: "none",
              background: P.blue, color: "#fff", fontSize: 14, fontWeight: P.w.semibold, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: `0 4px 10px -4px ${P.blueGlow}`,
            }}>
              <Icon.Check size={15} /> {t("review.session.got")} <span style={{ fontFamily: P.fontMono, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
