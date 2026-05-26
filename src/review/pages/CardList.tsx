import { useState } from "react";
import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import { Chip } from "../components/Chip";
import { EditModal } from "../components/EditModal";
import { DeleteModal } from "../components/DeleteModal";
import { Toast } from "../components/Toast";
import { useCardsContext } from "../App";
import { groupByShow, isDue, formatTimestamp, formatRelativeDate } from "../hooks/useCards";
import { t } from "@shared/i18n";
import * as Icon from "../icons";
import type { Route } from "../App";

interface CardListProps {
  onNavigate: (route: Route, show?: string) => void;
  selectedShow?: string;
}

export function CardList({ onNavigate, selectedShow }: CardListProps) {
  const P = usePalette();
  const { cards, deleteCard } = useCardsContext();
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const shows = groupByShow(cards);
  const show = shows.find(s => s.showName === selectedShow) || shows[0];
  const showCards = show?.cards || [];
  const dueCount = showCards.filter(isDue).length;
  const totalCorrect = showCards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = showCards.reduce((sum, c) => sum + c.wrongCount, 0);
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  if (!show) {
    return (
      <div style={{ width: "100%", height: "100%", background: P.bg, display: "flex", overflow: "hidden" }}>
        <Sidebar active="shows" onNavigate={onNavigate} />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: P.textMute }}>
          找不到節目
        </main>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="shows" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "20px 36px 28px", overflowY: "auto" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: P.textMute, display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span onClick={() => onNavigate("shows")} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18, color: P.blue, fontWeight: P.w.semibold }}>←</span> {t("review.cards.breadcrumb")}
          </span>
          <span>/</span>
          <strong style={{ color: P.text, fontWeight: P.w.medium }}>{show.showName}</strong>
        </div>

        {/* Show banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          padding: "18px 22px", background: P.panel,
          border: `1px solid ${P.border}`, borderRadius: 12, marginBottom: 16,
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: P.w.semibold, color: P.text }}>{show.showName}</h2>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <Chip tone="mute">{show.langPair}</Chip>
              <Chip tone="mute">{show.total} 張</Chip>
              {dueCount > 0 && <Chip tone="red">{dueCount} 待複習</Chip>}
              <Chip tone="green">{accuracy}% 正確</Chip>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {dueCount > 0 && (
              <button onClick={() => onNavigate("review", show.showName)} style={{
                padding: "10px 16px", borderRadius: 8, border: `1px solid ${P.border}`,
                background: P.panel, fontSize: 13, fontWeight: P.w.medium, cursor: "pointer",
                color: P.textSoft,
              }}>{t("review.cards.dueOnly")} ({dueCount})</button>
            )}
            <button className="dc-btn" onClick={() => onNavigate("review", show.showName)} style={{
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: P.text, color: P.bg, fontSize: 13, fontWeight: P.w.semibold, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>{t("review.cards.startReview")} {show.total} <Icon.Arrow size={14} /></button>
          </div>
        </div>

        {/* Card grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {showCards.map(c => (
            <div key={c.id} className="dc-card-hover" style={{
              background: P.panel, border: `1px solid ${P.border}`, borderRadius: 10,
              padding: "14px 16px",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <button style={{
                  width: 30, height: 30, borderRadius: 8, border: "none",
                  background: P.panelTint, color: P.blue, cursor: "pointer",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon.Speaker size={15} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: P.w.medium, color: P.text, lineHeight: 1.4 }}>
                    "{c.original}"
                  </div>
                  <div style={{ fontSize: 13, color: P.textSoft, marginTop: 4, lineHeight: 1.4 }}>
                    {c.translation}
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex", alignItems: "center", gap: 8, paddingTop: 8,
                borderTop: `1px solid ${P.borderSoft}`,
                fontSize: 12,
              }}>
                <span className="dc-netflix-btn" style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 8px", borderRadius: 6,
                  background: P.panelTint, border: `1px solid ${P.borderSoft}`,
                  cursor: "pointer", color: P.textSoft,
                }}>
                  <Icon.Netflix size={12} /> {c.seasonEpisode} {formatTimestamp(c.timestamp)} ▶
                </span>
                <span style={{ color: P.textMute }}>{t("review.card.reviewDate")}：{formatRelativeDate(c.lastReviewAt)}</span>
                <span style={{
                  marginLeft: "auto", fontWeight: P.w.medium, fontSize: 12,
                  color: c.streak >= 6 ? P.red : c.streak >= 3 ? P.orange : P.textSoft,
                }}>{t("review.card.streakCount")} {c.streak}</span>
                <span className="dc-icon-btn" onClick={(e) => { e.stopPropagation(); setModal("edit"); }} style={{ padding: 4, color: P.textSoft, cursor: "pointer" }}>
                  <Icon.Edit size={14} />
                </span>
                <span className="dc-icon-btn" onClick={(e) => { e.stopPropagation(); setModal("delete"); }} style={{ padding: 4, color: P.textSoft, cursor: "pointer" }}>
                  <Icon.Trash size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal === "edit" && <EditModal onClose={() => setModal(null)} onSave={() => { setModal(null); setToast(t("review.edit.saved")); }} />}
      {modal === "delete" && <DeleteModal onClose={() => setModal(null)} onConfirm={() => { setModal(null); setToast(t("review.delete.deleted")); }} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
