import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import { useCardsContext } from "../App";
import { groupByShow } from "../hooks/useCards";
import { t } from "@shared/i18n";
import * as Icon from "../icons";
import type { Route } from "../App";

interface ShowListProps {
  onNavigate: (route: Route, show?: string) => void;
}

export function ShowList({ onNavigate }: ShowListProps) {
  const P = usePalette();
  const { cards } = useCardsContext();
  const shows = groupByShow(cards);
  const isEmpty = shows.length === 0;

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="shows" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "28px 36px 28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: P.w.semibold, letterSpacing: -0.4, color: P.text }}>{t("review.shows.title")}</h1>
            <div style={{ color: P.textMute, fontSize: 13, marginTop: 4 }}>{t("review.shows.subtitle")}</div>
          </div>
        </div>

        {isEmpty ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 60, textAlign: "center",
          }}>
            <Icon.Bookmark size={48} style={{ color: P.borderSoft, marginBottom: 16 }} />
            <div style={{ fontSize: 18, fontWeight: P.w.semibold, color: P.text, marginBottom: 6 }}>{t("review.shows.emptyTitle")}</div>
            <div style={{ fontSize: 14, color: P.textSoft, lineHeight: 1.7, maxWidth: 400 }}>
              {t("review.shows.emptyDesc")}
            </div>
          </div>
        ) : (
          <div style={{
            background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(250px, 2fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr)", gap: "0 16px",
              padding: "10px 18px", borderBottom: `1px solid ${P.border}`,
              background: P.panelTint, fontSize: 12, color: P.textMute,
              fontWeight: P.w.semibold, letterSpacing: 0.3, textTransform: "uppercase",
            }}>
              <span>{t("review.shows.col.show")}</span>
              <span>{t("review.shows.col.lang")}</span>
              <span>{t("review.shows.col.cards")}</span>
              <span>{t("review.shows.col.accuracy")}</span>
              <span style={{ textAlign: "right" }}>{t("review.shows.col.lastReview")}</span>
            </div>

            {shows.map((s, i) => {
              const totalCorrect = s.cards.reduce((sum, c) => sum + c.correctCount, 0);
              const totalWrong = s.cards.reduce((sum, c) => sum + c.wrongCount, 0);
              const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

              return (
                <div key={s.showName} className="dc-row-hover" onClick={() => onNavigate("cards", s.showName)} style={{
                  display: "grid", gridTemplateColumns: "minmax(250px, 2fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr)", gap: "0 16px",
                  padding: "14px 18px",
                  borderTop: i === 0 ? "none" : `1px solid ${P.borderSoft}`,
                  alignItems: "center", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: P.w.medium, color: P.text }}>{s.showName}</div>
                    </div>
                  </div>

                  <span style={{ fontSize: 13, color: P.textSoft }}>{s.langPair}</span>

                  <div style={{ fontSize: 13, fontFamily: P.fontMono, color: P.text }}>
                    {s.total}
                    <span style={{ color: P.textMute }}> / </span>
                    <span style={{
                      color: s.due > 0 ? P.red : P.textMute,
                      fontWeight: s.due > 0 ? P.w.semibold : P.w.regular,
                    }}>{s.due}</span>
                  </div>

                  <div style={{ fontSize: 12, color: P.text }}>
                    <span style={{ fontFamily: P.fontMono, fontWeight: P.w.medium }}>{accuracy}%</span>
                    <div style={{ width: 120, height: 3, background: P.borderSoft, borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                      <div style={{ width: `${accuracy}%`, height: "100%", background: P.blue }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono, textAlign: "right" }}>
                    {s.lastReview}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
