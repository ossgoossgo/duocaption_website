import { usePalette } from "../theme";
import { Chip } from "../components/Chip";
import { useCardsContext } from "../App";
import * as Icon from "../icons";
import { t } from "@shared/i18n";
import type { Route } from "../App";

interface SessionDoneProps {
  onNavigate: (route: Route) => void;
}

export function SessionDone({ onNavigate }: SessionDoneProps) {
  const P = usePalette();
  const { cards } = useCardsContext();
  const total = cards.length;

  // 簡易統計（之後可以從 Review 傳入真實數據）
  const totalCorrect = cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  const hardestCards = [...cards].sort((a, b) => a.streak - b.streak).slice(0, 3);

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
        <img src="/logo.png" alt="DuoCaption" style={{ height: 18, width: "auto" }} />
        <span style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono }}>
          {new Date().toLocaleDateString("zh-TW")} · {new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </header>

      <main style={{ flex: 1, padding: "40px 32px 32px", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 600, marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: P.greenSoft, color: P.green,
            display: "grid", placeItems: "center", margin: "0 auto 18px",
          }}>
            <Icon.Check size={36} />
          </div>
          <div style={{ fontSize: 32, fontWeight: P.w.semibold, color: P.text, letterSpacing: -0.6, marginBottom: 8 }}>
            {t("review.done.title")}
          </div>
          <div style={{ color: P.textSoft, fontSize: 15, lineHeight: 1.6 }}>
            {t("review.done.subtitle")}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%", maxWidth: 760, marginBottom: 22 }}>
          {[
            { label: t("review.done.totalSaved"), value: String(total), color: P.text },
            { label: t("review.done.accuracyLabel"), value: `${accuracy}%`, color: P.green },
            { label: t("review.done.needWork"), value: String(hardestCards.length), color: P.orange },
          ].map((s, i) => (
            <div key={i} style={{
              background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12,
              padding: "16px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 32, fontWeight: P.w.semibold, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: P.textSoft, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {hardestCards.length > 0 && (
          <div style={{
            width: "100%", maxWidth: 760,
            background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12,
            padding: "14px 18px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 12, color: P.textMute, fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
              {t("review.done.hardestTitle")}
            </div>
            {hardestCards.map((c, i) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${P.borderSoft}`,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 4, background: P.redSoft, color: P.red,
                  display: "grid", placeItems: "center", fontSize: 12, fontWeight: P.w.semibold,
                }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: P.text, fontWeight: P.w.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{c.original}"
                  </div>
                </div>
                <span style={{ fontSize: 12, color: P.textMute }}>{c.showName}</span>
                <Chip tone="red">{t("review.card.streakCount")} {c.streak}</Chip>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("home")} style={{
            padding: "12px 20px", borderRadius: 10, border: `1px solid ${P.border}`,
            background: P.panel, color: P.textSoft, fontSize: 14, fontWeight: P.w.medium, cursor: "pointer",
          }}>{t("review.done.backHome")}</button>
          <button onClick={() => onNavigate("random")} style={{
            padding: "12px 24px", borderRadius: 10, border: `1px solid ${P.border}`,
            background: P.panel, color: P.text, fontSize: 14, fontWeight: P.w.medium, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <Icon.Shuffle size={15} /> {t("review.done.tryShuffle")}
          </button>
          <button onClick={() => onNavigate("review")} style={{
            padding: "12px 24px", borderRadius: 10, border: "none",
            background: P.blue, color: "#fff", fontSize: 14, fontWeight: P.w.semibold, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: `0 6px 16px -6px ${P.blueGlow}`,
          }}>
            {t("review.done.anotherRound")} <Icon.Arrow size={14} />
          </button>
        </div>
      </main>
    </div>
  );
}
