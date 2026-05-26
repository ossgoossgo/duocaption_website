import { t } from "@shared/i18n";
import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import { Chip } from "../components/Chip";
import { useCardsContext } from "../App";
import { groupByShow, isDue } from "../hooks/useCards";
import * as Icon from "../icons";
import type { Route } from "../App";

interface HomeProps {
  onNavigate: (route: Route, show?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const P = usePalette();
  const { cards } = useCardsContext();
  const shows = groupByShow(cards);
  const totalCards = cards.length;
  const dueCards = cards.filter(isDue).length;
  const totalCorrect = cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  // 連續學習天數（簡易計算：看最近有複習的天數）
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

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="home" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "28px 36px 28px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: P.textMute, marginBottom: 4 }}>
              今天 · {new Date().toLocaleDateString("zh-TW", { weekday: "short", month: "numeric", day: "numeric" })}
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: P.w.semibold, letterSpacing: -0.5 }}>
              {t("review.home.greeting")}
            </h1>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 10,
            background: P.panel, border: `1px solid ${P.border}`,
            color: P.textSoft, fontSize: 13, width: 320, cursor: "pointer",
          }} className="dc-search" onClick={() => onNavigate("search")}>
            <Icon.Search size={15} />
            <span>{t("review.home.searchHint")}</span>
            <span style={{ marginLeft: "auto", fontFamily: P.fontMono, fontSize: 12, color: P.textMute }}>⌘K</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
          {[
            { label: t("review.home.totalCards"), value: String(totalCards), suffix: "句", sub: "" },
            { label: t("review.home.dueCards"), value: String(dueCards), suffix: "張", sub: "", accent: P.red },
            { label: t("review.home.streakDays"), value: String(streakDays), suffix: "天", sub: "", accent: P.orange },
            { label: t("review.home.accuracy"), value: String(accuracy), suffix: "%", sub: "", accent: P.green },
          ].map((s, i) => (
            <div key={i} style={{
              background: P.panel, border: `1px solid ${P.border}`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 12, color: P.textSoft, marginBottom: 6 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: P.w.semibold, letterSpacing: -0.8, color: s.accent || P.text }}>{s.value}</span>
                <span style={{ fontSize: 12, color: P.textMute }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two entry cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {/* 依劇複習 */}
          <div className="dc-card-hover" onClick={() => onNavigate("shows")} style={{
            background: P.panel, border: `1px solid ${P.border}`,
            borderRadius: 12, padding: 22, position: "relative", cursor: "pointer",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "3px 8px", borderRadius: 6,
                  background: P.blueSoft, color: P.blue,
                  fontSize: 12, fontWeight: P.w.semibold, marginBottom: 10,
                }}>
                  <Icon.Bookmark size={12} /> {t("review.nav.byShow")}
                </div>
                <div style={{ fontSize: 19, fontWeight: P.w.semibold, marginBottom: 4, color: P.text }}>
                  {t("review.home.byShowTitle")}
                </div>
                <div style={{ fontSize: 13, color: P.textSoft, lineHeight: 1.55 }}>
                  {t("review.home.byShowDesc")}
                </div>
              </div>
              <Icon.Arrow style={{ color: P.textSoft }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {shows.slice(0, 3).map(s => (
                <div key={s.showName} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8,
                  background: P.panelTint, border: `1px solid ${P.borderSoft}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: P.w.medium, color: P.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.showName}</div>
                    <div style={{ fontSize: 12, color: P.textMute }}>{s.langPair} · {s.total} 張</div>
                  </div>
                  {s.due > 0 && <Chip tone="red">{s.due}</Chip>}
                </div>
              ))}
            </div>
          </div>

          {/* 隨機複習 */}
          <div className="dc-card-dark-hover" onClick={() => onNavigate("random")} style={{
            background: "#0F172A", color: "#fff",
            borderRadius: 12, padding: 22, position: "relative", overflow: "hidden", cursor: "pointer",
          }}>
            <div style={{
              position: "absolute", right: -40, bottom: -40, width: 240, height: 240,
              background: `radial-gradient(circle at center, ${P.blueGlow} 0%, transparent 60%)`,
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "3px 8px", borderRadius: 6,
                    background: "rgba(255,255,255,0.1)", color: "#fff",
                    fontSize: 12, fontWeight: P.w.semibold, marginBottom: 10,
                  }}>
                    <Icon.Shuffle size={12} /> {t("review.nav.random")}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: P.w.semibold, marginBottom: 4 }}>{t("review.home.randomTitle")}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
                    {t("review.home.randomDesc")}
                  </div>
                </div>
                <Icon.Arrow style={{ color: "#fff" }} />
              </div>

              {cards.length > 0 && (
                <div style={{ position: "relative", marginTop: 24, height: 102 }}>
                  {[2, 1, 0].map(i => (
                    <div key={i} style={{
                      position: "absolute", left: i * 6, right: -i * 6, top: i * 6, bottom: -i * 6 + 18,
                      background: i === 0 ? "#fff" : "rgba(255,255,255,0.06)",
                      border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, padding: "10px 14px",
                      color: i === 0 ? "#0F172A" : "transparent",
                    }}>
                      {i === 0 && cards[0] && (
                        <>
                          <div style={{ fontSize: 12, color: "#94A0B5", fontFamily: P.fontMono, marginBottom: 4, fontWeight: P.w.semibold }}>
                            {cards[0].originalLang} → {cards[0].translationLang} · {cards[0].showName.toUpperCase()}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: P.w.medium, color: "#0F172A" }}>
                            "{cards[0].original.length > 50 ? cards[0].original.slice(0, 50) + "…" : cards[0].original}"
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button className="dc-btn-primary" style={{
                marginTop: 22, padding: "10px 16px", borderRadius: 8,
                background: P.blue, color: "#fff", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: P.w.semibold,
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: `0 6px 18px -6px ${P.blueGlow}`,
              }}>{t("review.home.startShuffle")} <Icon.Arrow size={14} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
