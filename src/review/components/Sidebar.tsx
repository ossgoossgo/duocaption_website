import { t } from "@shared/i18n";
import { usePalette } from "../theme";
import { useCardsContext } from "../App";
import { groupByShow, isDue } from "../hooks/useCards";
import * as Icon from "../icons";
import type { ReactElement } from "react";
import type { Route } from "../App";

interface SidebarProps {
  active: Route;
  onNavigate: (route: Route, show?: string) => void;
}

function getNavItems(): { id: Route; label: string; icon: ReactElement }[] {
  return [
    { id: "home", label: t("review.nav.home"), icon: <Icon.Stack size={16} /> },
    { id: "shows", label: t("review.nav.byShow"), icon: <Icon.Bookmark size={16} /> },
    { id: "random", label: t("review.nav.random"), icon: <Icon.Shuffle size={16} /> },
    { id: "search", label: t("review.nav.search"), icon: <Icon.Search size={16} /> },
    { id: "stats", label: t("review.nav.stats"), icon: <Icon.BarChart size={16} /> },
  ];
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const P = usePalette();
  const { cards } = useCardsContext();
  const shows = groupByShow(cards);
  const dueCount = cards.filter(isDue).length;
  const NAV_ITEMS = getNavItems();

  return (
    <aside style={{
      width: 220, flexShrink: 0, padding: "24px 16px",
      borderRight: `1px solid ${P.border}`, background: P.panel,
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ padding: "4px 10px 24px", cursor: "pointer" }} onClick={() => onNavigate("home")}>
        <img src="/logo.png" alt="DuoCaption" style={{ height: 24, width: "auto", display: "block" }} />
        <div style={{ fontSize: 12, color: P.textMute, marginTop: 4, letterSpacing: 0.5 }}>Watch. Learn. Remember.</div>
      </div>

      <div style={{
        fontSize: 12, color: P.textMute, padding: "6px 10px",
        fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase",
      }}>複習</div>

      {NAV_ITEMS.map(it => (
        <a key={it.id} className={`dc-nav-item${active === it.id ? " active" : ""}`} onClick={() => onNavigate(it.id)} style={{
          padding: "8px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: P.w.medium,
          color: active === it.id ? P.blue : P.textSoft,
          background: active === it.id ? P.blueSoft : "transparent",
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textDecoration: "none",
        }}>
          {it.icon}{it.label}
          {it.id === "home" && dueCount > 0 && (
            <span style={{
              marginLeft: "auto", fontSize: 12, fontFamily: P.fontMono,
              color: P.blue, background: P.panel, padding: "1px 5px",
              borderRadius: 4, fontWeight: P.w.semibold,
            }}>{dueCount}</span>
          )}
        </a>
      ))}

      <div style={{
        fontSize: 12, color: P.textMute, padding: "20px 10px 6px",
        fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase",
      }}>{t("review.nav.shows")}</div>

      {[...shows].sort((a, b) => b.due - a.due).slice(0, 4).map(s => (
        <a key={s.showName} className="dc-show-item" onClick={() => onNavigate("cards", s.showName)} style={{
          padding: "6px 10px", borderRadius: 8, fontSize: 12.5, fontWeight: P.w.regular,
          color: P.textSoft, display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", textDecoration: "none",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent }} />
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.showName}</span>
          <span style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono }}>{s.total}</span>
        </a>
      ))}
      {shows.length > 4 && (
        <a className="dc-footer-link" onClick={() => onNavigate("shows")} style={{
          padding: "6px 10px", fontSize: 12, color: P.blue,
          cursor: "pointer", textDecoration: "none",
        }}>{t("review.nav.viewAll")} ({shows.length})</a>
      )}

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2, borderTop: `1px solid ${P.borderSoft}`, paddingTop: 10 }}>
        <a className="dc-footer-link" onClick={() => onNavigate("help")} style={{
          padding: "6px 10px", borderRadius: 6, fontSize: 12, color: P.textMute,
          display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", textDecoration: "none",
        }}>
          <Icon.HelpCircle size={14} /> {t("review.nav.help")}
        </a>
        <a className="dc-footer-link" onClick={() => onNavigate("legal")} style={{
          padding: "6px 10px", borderRadius: 6, fontSize: 12, color: P.textMute,
          display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", textDecoration: "none",
        }}>
          <Icon.FileText size={14} /> {t("review.nav.legal")}
        </a>
      </div>

      {/* TODO: 登入功能完成後顯示使用者資訊 */}
    </aside>
  );
}
