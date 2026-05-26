import { useState, useEffect, useCallback } from "react";
import { usePalette } from "../theme";
import { useCardsContext } from "../App";
import { groupByShow, formatTimestamp, formatRelativeDate } from "../hooks/useCards";
import { sortForReview, markCorrect, markWrong } from "@shared/review-engine";
import { speak } from "@shared/speech";
import { useVoicePreferences } from "../hooks/useSettings";
import { t } from "@shared/i18n";
import * as Icon from "../icons";
import type { Route } from "../App";

interface RandomReviewProps {
  onNavigate: (route: Route) => void;
}

export function RandomReview({ onNavigate }: RandomReviewProps) {
  const P = usePalette();
  const { cards, updateCard } = useCardsContext();
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(() => localStorage.getItem("dc-auto-play") !== "false");
  const voicePrefs = useVoicePreferences();

  const sorted = sortForReview(cards);
  const total = sorted.length;
  const c = sorted[index];
  const done = index + 1;
  const isEmpty = total === 0;

  const shows = groupByShow(cards);

  const speakOriginal = useCallback(() => {
    if (c) speak(c.original, c.originalLang, voicePrefs);
  }, [c, voicePrefs]);

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

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "radial-gradient(1200px 600px at 50% -10%, #ECF0FA 0%, #F4F6FA 100%)",
      color: P.text, fontFamily: P.font, fontWeight: P.w.regular,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {isEmpty ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 60, textAlign: "center",
        }}>
          <Icon.Shuffle size={48} style={{ color: P.borderSoft, marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: P.w.semibold, color: P.text, marginBottom: 6 }}>{t("review.random.emptyTitle")}</div>
          <div style={{ fontSize: 14, color: P.textSoft, lineHeight: 1.7, maxWidth: 400, marginBottom: 22 }}>
            {t("review.random.emptyDesc")}
          </div>
          <button onClick={() => onNavigate("home")} style={{
            padding: "12px 20px", borderRadius: 10, border: `1px solid ${P.border}`,
            background: P.panel, color: P.textSoft, fontSize: 14, fontWeight: P.w.medium, cursor: "pointer",
          }}>{t("review.random.backHome")}</button>
        </div>
      ) : <>
      <header style={{
        height: 60, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span onClick={() => onNavigate("home")} style={{
            padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: P.w.medium,
            color: P.textSoft, cursor: "pointer",
            border: `1px solid ${P.border}`, background: P.panel,
          }}>{"✕ " + t("review.session.endShuffle")}</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: P.textSoft }}>
            <Icon.Shuffle size={14} /> {t("review.session.randomMode")}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: P.fontMono, fontSize: 12, color: P.textSoft }}>
          <span>{t("review.session.done")} <strong style={{ color: P.text, fontWeight: P.w.semibold }}>{done}</strong> · {t("review.session.remaining")} {total - done}</span>
          <div style={{ width: 140, height: 4, borderRadius: 2, background: P.borderSoft, overflow: "hidden" }}>
            <div style={{ width: `${(done / total) * 100}%`, height: "100%", background: P.blue, transition: "width 0.3s ease" }} />
          </div>
        </div>
      </header>

      <main style={{
        flex: 1, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 32px 80px",
      }}>
        {[3, 2, 1].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: "min(720px, 70%)", height: 380,
            top: `calc(50% + ${i * 8}px)`, left: "50%",
            transform: `translate(-50%, calc(-50% + ${i * 4}px)) rotate(${i * 0.6}deg)`,
            background: P.panel, border: `1px solid ${P.border}`,
            borderRadius: 18, opacity: 1 - i * 0.15,
            boxShadow: P.shadowLg, zIndex: 1,
          }} />
        ))}

        {c && (
          <div style={{
            position: "relative", zIndex: 5,
            width: "min(720px, 70%)", minHeight: 380,
            background: P.panel, border: `1px solid ${P.border}`,
            borderRadius: 18, boxShadow: P.shadowLg,
            padding: "28px 34px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: P.w.medium, color: P.text }}>{c.showName}</div>
                  <div style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono }}>{c.seasonEpisode} · {formatTimestamp(c.timestamp)}</div>
                </div>
              </div>
              <span style={{
                fontSize: 12, color: P.textSoft, fontFamily: P.fontMono,
                display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px",
                border: `1px solid ${P.border}`, borderRadius: 6, cursor: "pointer",
              }}>
                <Icon.Netflix size={12} /> {c.seasonEpisode} {formatTimestamp(c.timestamp)} ▶
              </span>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, letterSpacing: 1, fontWeight: P.w.semibold, marginBottom: 12 }}>{c.originalLang.toUpperCase()} · ORIGINAL</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <button onClick={speakOriginal} style={{
                  width: 36, height: 36, borderRadius: "50%", border: `1px solid ${P.border}`,
                  background: P.panel, color: P.blue, cursor: "pointer", flexShrink: 0,
                  display: "grid", placeItems: "center", marginTop: 4,
                }}>
                  <Icon.Speaker size={16} />
                </button>
                <div style={{ fontSize: 28, fontWeight: P.w.medium, lineHeight: 1.3, color: P.text, letterSpacing: -0.3, flex: 1 }}>
                  "{c.original}"
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: P.borderSoft, margin: "6px 0 18px" }} />

            <div>
              <div style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, letterSpacing: 1, fontWeight: P.w.semibold, marginBottom: 12 }}>{c.translationLang.toUpperCase()} · TRANSLATION</div>
              <div style={{ paddingLeft: 50, fontSize: 22, fontWeight: P.w.medium, lineHeight: 1.5, color: P.textSoft }}>
                {c.translation}
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: 16, fontSize: 12, color: P.textMute }}>
              {t("review.card.reviewDate")}：{formatRelativeDate(c.lastReviewAt)} · <span style={{
                fontWeight: P.w.medium,
                color: c.streak >= 6 ? P.red : c.streak >= 3 ? P.orange : P.textSoft,
              }}>{t("review.card.streakCount")} {c.streak}</span>
            </div>
          </div>
        )}

        <div style={{
          position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 10, alignItems: "center", zIndex: 10,
          padding: 8, background: P.panel, border: `1px solid ${P.border}`,
          borderRadius: 999, boxShadow: P.shadowLg,
        }}>
          <button style={{
            padding: "10px 14px", borderRadius: 999, border: "none",
            background: "transparent", color: P.red, fontSize: 13, fontWeight: P.w.medium, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Trash size={14} /> 刪
          </button>
          <span style={{ width: 1, height: 22, background: P.borderSoft }} />
          <button className="dc-btn" onClick={handleAgain} style={{
            padding: "10px 16px", borderRadius: 999, border: `1px solid ${P.border}`,
            background: P.panel, color: P.text, fontSize: 13, fontWeight: P.w.medium, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
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
            padding: "10px 22px", borderRadius: 999, border: "none",
            background: P.blue, color: "#fff", fontSize: 14, fontWeight: P.w.semibold, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            boxShadow: `0 6px 16px -6px ${P.blueGlow}`,
          }}>
            <Icon.Check size={15} /> {t("review.session.got")} <span style={{ fontFamily: P.fontMono, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>→</span>
          </button>
        </div>

        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          fontSize: 12, color: P.textMute, zIndex: 10, whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span>{t("review.session.hintKeys")}</span>
          <label onClick={toggleAutoPlay} style={{
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
        </div>
      </main>
      </>}
    </div>
  );
}
