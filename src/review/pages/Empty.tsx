import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import * as Icon from "../icons";
import type { Route } from "../App";
import { t } from "@shared/i18n";

interface EmptyProps {
  onNavigate: (route: Route) => void;
}

export function Empty({ onNavigate }: EmptyProps) {
  const P = usePalette();

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="home" onNavigate={onNavigate} />

      <main style={{
        flex: 1, padding: "36px 36px 0", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: P.w.semibold, letterSpacing: -0.5, color: P.text }}>{t("review.empty.greeting")}</h1>
          <div style={{ color: P.textSoft, fontSize: 14, marginTop: 6 }}>{t("review.empty.desc")}</div>
        </div>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 40,
        }}>
          {/* Empty card illustration */}
          <div style={{ position: "relative", width: 360, height: 200, marginBottom: 22 }}>
            {[2, 1, 0].map(i => (
              <div key={i} style={{
                position: "absolute", inset: 0,
                transform: `translate(${i * 14}px, ${i * 10}px) rotate(${i * -3}deg)`,
                background: P.panel, border: `1.5px dashed ${i === 0 ? P.blue : P.border}`,
                borderRadius: 14, padding: "20px 22px",
                opacity: 1 - i * 0.25,
              }}>
                {i === 0 && (
                  <>
                    <div style={{ fontSize: 12, fontFamily: P.fontMono, color: P.textMute, letterSpacing: 1, marginBottom: 8 }}>EN · YOUR FIRST CAPTION</div>
                    <div style={{ fontSize: 17, color: P.textMute, fontWeight: P.w.medium, marginBottom: 6, fontStyle: "italic" }}>"…還沒有收藏字句"</div>
                    <div style={{ fontSize: 13, color: P.textMute }}>翻譯會出現在這裡。</div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 18, fontWeight: P.w.semibold, color: P.text, marginBottom: 6 }}>{t("review.empty.cta")}</div>
          <div style={{ fontSize: 14, color: P.textSoft, textAlign: "center", maxWidth: 440, lineHeight: 1.7, marginBottom: 22 }}>
            {t("review.empty.ctaDesc")}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer" style={{
              padding: "12px 22px", borderRadius: 10, border: "none",
              background: P.blue, color: "#fff", fontSize: 13, fontWeight: P.w.semibold, cursor: "pointer",
              boxShadow: `0 4px 10px -4px ${P.blueGlow}`,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {t("review.empty.openNetflix")}
            </a>
          </div>

          <div style={{
            marginTop: 30, padding: "10px 14px", borderRadius: 10,
            background: P.panelTint, border: `1px dashed ${P.border}`,
            fontSize: 12, color: P.textMute, fontFamily: P.fontMono, letterSpacing: 0.3,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {t("review.empty.installed")}
          </div>
        </div>
      </main>
    </div>
  );
}
