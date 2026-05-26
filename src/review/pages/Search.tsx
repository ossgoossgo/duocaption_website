import { usePalette } from "../theme";
import { Sidebar } from "../components/Sidebar";
import { Chip } from "../components/Chip";
import { SHOWS } from "../mock-data";
import * as Icon from "../icons";
import { t } from "@shared/i18n";
import type { Route } from "../App";
import type { ReactNode } from "react";

interface SearchProps {
  onNavigate: (route: Route) => void;
}

interface SearchResult {
  show: string;
  showId: string;
  episode: string;
  time: string;
  original: string;
  translation: string;
  streak: number;
}

const SEARCH_RESULTS: SearchResult[] = [
  { show: "Stranger Things", showId: "stranger", episode: "S1 E4", time: "12:08", original: "Friends don't lie.", translation: "朋友不會說謊。", streak: 9 },
  { show: "Stranger Things", showId: "stranger", episode: "S2 E1", time: "34:20", original: "He's not your friend anymore.", translation: "他已經不是你的朋友了。", streak: 3 },
  { show: "The Crown", showId: "crown", episode: "S3 E5", time: "08:55", original: "Even a Queen needs a friend.", translation: "就連女王也需要一位朋友。", streak: 0 },
  { show: "鬼滅の刃", showId: "kimetsu", episode: "S1 E11", time: "17:42", original: "君が私の友達だから。", translation: "因為你是我的朋友。", streak: 6 },
  { show: "La Casa de Papel", showId: "casa", episode: "S1 E3", time: "41:02", original: "Tenemos que ser amigos antes de todo.", translation: "做朋友之前先信任彼此。", streak: 2 },
];

function highlightText(text: string, query: string, P: ReturnType<typeof usePalette>): ReactNode {
  if (!query) return text;
  const re = new RegExp(`(${query})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) => re.test(p)
    ? <mark key={i} style={{ background: P.blueSoft, color: P.blue, padding: "0 2px", borderRadius: 3, fontWeight: P.w.semibold }}>{p}</mark>
    : <span key={i}>{p}</span>
  );
}

export function Search({ onNavigate }: SearchProps) {
  const P = usePalette();
  const q = "friend";

  const showIds = [...new Set(SEARCH_RESULTS.map(r => r.showId))];

  return (
    <div style={{
      width: "100%", height: "100%", background: P.bg, color: P.text,
      fontFamily: P.font, fontWeight: P.w.regular, display: "flex", overflow: "hidden",
    }}>
      <Sidebar active="search" onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "24px 36px 28px", overflowY: "auto" }}>
        {/* Search box */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", borderRadius: 12,
          background: P.panel, border: `1px solid ${P.blue}`,
          boxShadow: `0 0 0 3px ${P.blueSoft}`,
          marginBottom: 16,
        }}>
          <Icon.Search size={18} style={{ color: P.blue }} />
          <input readOnly value={q} style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 17, fontWeight: P.w.medium, color: P.text, fontFamily: P.font,
          }} />
          <Chip tone="line">{t("review.search.searchBoth")}</Chip>
          <span style={{ fontFamily: P.fontMono, fontSize: 12, color: P.textMute, padding: "2px 8px", border: `1px solid ${P.border}`, borderRadius: 5 }}>ESC</span>
        </div>

        {/* Result summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: P.text }}>
            {t("review.search.found")} <strong style={{ fontWeight: P.w.semibold }}>{SEARCH_RESULTS.length}</strong> {t("review.search.results")}
          </span>
          <span style={{ color: P.textMute, fontSize: 12 }}>· {t("review.search.across")} {showIds.length} {t("review.search.shows")}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: P.textSoft, display: "inline-flex", alignItems: "center", gap: 6 }}>
            篩選：<Chip tone="blue">{t("review.search.filterAll")}</Chip>
            <Chip tone="line">EN</Chip>
            <Chip tone="line">JA</Chip>
            <Chip tone="line">ES</Chip>
          </span>
        </div>

        {/* Results grouped by show */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>
          {showIds.map(showId => {
            const show = SHOWS.find(s => s.id === showId);
            const matches = SEARCH_RESULTS.filter(r => r.showId === showId);
            if (!show) return null;
            return (
              <div key={showId} style={{
                background: P.panel, border: `1px solid ${P.border}`, borderRadius: 12,
                overflow: "hidden",
              }}>
                {/* Group header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", borderBottom: `1px solid ${P.borderSoft}`,
                  background: P.panelTint,
                }}>
                  <span style={{ fontSize: 13, fontWeight: P.w.semibold, color: P.text }}>{show.title}</span>
                  <span style={{ fontSize: 13, color: P.textSoft }}>{show.langPair}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: P.textMute, fontFamily: P.fontMono }}>{matches.length} 個結果</span>
                </div>

                {/* Result rows */}
                {matches.map((r, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "32px 1fr 1fr 120px",
                    gap: 14, alignItems: "flex-start",
                    padding: "12px 16px",
                    borderTop: i === 0 ? "none" : `1px solid ${P.borderSoft}`,
                    cursor: "pointer",
                  }}>
                    <button style={{
                      width: 28, height: 28, borderRadius: 6, border: "none",
                      background: P.panelTint, color: P.blue, cursor: "pointer",
                      display: "grid", placeItems: "center", marginTop: 2,
                    }}>
                      <Icon.Speaker size={13} />
                    </button>
                    <div style={{ fontSize: 14, color: P.text, lineHeight: 1.5, fontWeight: P.w.medium }}>
                      "{highlightText(r.original, q, P)}"
                    </div>
                    <div style={{ fontSize: 13, color: P.textSoft, lineHeight: 1.5 }}>
                      {highlightText(r.translation, "朋友", P)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, fontSize: 12 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 8px", borderRadius: 6,
                        background: P.panelTint, border: `1px solid ${P.borderSoft}`,
                        cursor: "pointer", color: P.textSoft,
                      }}>
                        <Icon.Netflix size={12} /> {r.episode} {r.time} ▶
                      </span>
                      <span style={{
                        fontWeight: P.w.medium,
                        color: r.streak >= 6 ? P.red : r.streak >= 3 ? P.orange : P.textMute,
                      }}>{t("review.card.streakCount")} {r.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
