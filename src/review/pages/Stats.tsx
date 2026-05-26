import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import { Chip } from "../components/Chip";
import { useCardsContext } from "../App";
import { groupByShow, isDue } from "../hooks/useCards";
import { t } from "@shared/i18n";
import type { Route } from "../App";

interface StatsProps {
  onNavigate: (route: Route) => void;
}

export function Stats({ onNavigate }: StatsProps) {
  const P = usePalette();
  const { cards } = useCardsContext();

  const totalCards = cards.length;
  const totalCorrect = cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const totalReviews = totalCorrect + totalWrong;
  const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const reviewDates = new Set(cards.map(c => c.lastReviewAt?.split("T")[0]).filter(Boolean));
  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (reviewDates.has(key)) streakDays++;
    else if (i > 0) break;
  }

  const shows = groupByShow(cards);
  const showStats = shows.map(s => {
    const correct = s.cards.reduce((sum, c) => sum + c.correctCount, 0);
    const wrong = s.cards.reduce((sum, c) => sum + c.wrongCount, 0);
    return { ...s, accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0 };
  });

  const hardestCards = [...cards].sort((a, b) => a.streak - b.streak).slice(0, 5);
  const maxTotal = Math.max(...shows.map(s => s.total), 1);

  // 最近 7 天每日複習數
  const weekData: number[] = [];
  const weekLabels: string[] = [];
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const count = cards.filter(c => c.lastReviewAt?.startsWith(key)).length;
    weekData.push(count);
    weekLabels.push(dayNames[d.getDay()]);
  }
  const maxWeek = Math.max(...weekData, 1);

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="stats" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "28px 36px 28px", overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: P.w.semibold, letterSpacing: -0.4, color: P.text }}>{t("review.stats.title")}</h1>
          <div style={{ color: P.textMute, fontSize: 13, marginTop: 4 }}>{t("review.stats.subtitle")}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: t("review.stats.totalSaved"), value: String(totalCards), suffix: "句", color: P.text },
            { label: t("review.stats.totalReviews"), value: String(totalReviews), suffix: "次", color: P.blue },
            { label: t("review.stats.streakDays"), value: String(streakDays), suffix: "天", color: P.orange },
            { label: t("review.stats.overallAccuracy"), value: String(overallAccuracy), suffix: "%", color: P.green },
          ].map((s, i) => (
            <div key={i} style={{
              background: P.panel, border: `1px solid ${P.border}`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 12, color: P.textSoft, marginBottom: 6 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: P.w.semibold, letterSpacing: -0.8, color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 12, color: P.textMute }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, alignItems: "stretch" }}>
          <div style={{ background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12, padding: "16px 22px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: P.w.semibold, color: P.text }}>{t("review.stats.dailyReviews")}</div>
              <Chip tone="line">7 天</Chip>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flex: 1, paddingTop: 4 }}>
              {weekData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono }}>{v}</span>
                  <div style={{
                    width: "100%", height: `${(v / maxWeek) * 100}%`, minHeight: v > 0 ? 4 : 0, borderRadius: 4,
                    background: i === 6 ? P.blue : P.blueSoft,
                  }} />
                  <span style={{ fontSize: 12, color: i === 6 ? P.blue : P.textMute, fontWeight: i === 6 ? P.w.semibold : P.w.regular }}>{weekLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12, padding: "16px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: P.w.semibold, color: P.text, marginBottom: 12 }}>{t("review.stats.showAccuracy")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...showStats].sort((a, b) => b.accuracy - a.accuracy).map(s => (
                <div key={s.showName} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: P.w.medium, color: P.text, width: 140, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.showName}</span>
                  <div style={{ flex: 1, minWidth: 60, height: 6, borderRadius: 3, background: P.borderSoft, overflow: "hidden" }}>
                    <div style={{ width: `${s.accuracy}%`, height: "100%", borderRadius: 3, background: s.accuracy >= 80 ? P.green : s.accuracy >= 60 ? P.blue : P.orange }} />
                  </div>
                  <span style={{ fontSize: 12, fontFamily: P.fontMono, fontWeight: P.w.medium, color: P.text, width: 36, textAlign: "right" }}>{s.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
          <div style={{ background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12, padding: "16px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: P.w.semibold, color: P.text, marginBottom: 12 }}>{t("review.stats.showCollection")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...shows].sort((a, b) => b.total - a.total).map(s => (
                <div key={s.showName} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: P.w.medium, color: P.text, width: 140, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.showName}</span>
                  <div style={{ flex: 1, minWidth: 60, height: 6, borderRadius: 3, background: P.borderSoft, overflow: "hidden" }}>
                    <div style={{ width: `${(s.total / maxTotal) * 100}%`, height: "100%", borderRadius: 3, background: P.blue }} />
                  </div>
                  <span style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, width: 36, textAlign: "right" }}>{s.total} 句</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12, padding: "16px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: P.w.semibold, color: P.text, marginBottom: 12 }}>{t("review.stats.hardestCards")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {hardestCards.map((c, i) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${P.borderSoft}`,
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: 4, background: P.redSoft, color: P.red,
                    display: "grid", placeItems: "center", fontSize: 12, fontWeight: P.w.semibold, flexShrink: 0,
                  }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: P.text, fontWeight: P.w.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      "{c.original}"
                    </div>
                    <div style={{ fontSize: 12, color: P.textMute }}>{c.seasonEpisode} · {c.showName}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: P.w.medium,
                    color: c.streak >= 3 ? P.orange : P.red,
                  }}>{t("review.card.streakCount")} {c.streak}</span>
                </div>
              ))}
              {hardestCards.length === 0 && (
                <div style={{ fontSize: 13, color: P.textMute, padding: 12, textAlign: "center" }}>{t("review.stats.noReviews")}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
