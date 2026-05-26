import { usePalette } from "../theme";
import { CARDS_STRANGER } from "../mock-data";
import * as Icon from "../icons";
import { t } from "@shared/i18n";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ onClose, onConfirm }: DeleteModalProps) {
  const P = usePalette();
  const c = CARDS_STRANGER[1]; // mock

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(15,23,42,0.4)",
      }} />

      {/* Modal */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 440, background: P.panel, borderRadius: 14,
        border: `1px solid ${P.border}`, boxShadow: P.shadowLg,
        overflow: "hidden",
      }}>
        {/* Body */}
        <div style={{ padding: "24px 24px 18px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: P.redSoft, color: P.red,
            display: "grid", placeItems: "center", marginBottom: 14,
          }}>
            <Icon.Trash size={20} />
          </div>
          <div style={{ fontSize: 18, fontWeight: P.w.semibold, color: P.text, marginBottom: 6 }}>{t("review.delete.title")}</div>
          <div style={{ fontSize: 13, color: P.textSoft, lineHeight: 1.6 }}>
            {t("review.delete.desc")}（{t("review.card.streakCount")} {c.streak}）<br />
            {t("review.delete.netflixNote")}
          </div>

          {/* Card preview */}
          <div style={{
            marginTop: 16, padding: "12px 14px", borderRadius: 8,
            background: P.panelTint, border: `1px solid ${P.borderSoft}`,
          }}>
            <div style={{ fontSize: 14, color: P.text, fontWeight: P.w.medium, lineHeight: 1.4 }}>
              "{c.original}"
            </div>
            <div style={{ fontSize: 12, color: P.textSoft, marginTop: 4 }}>{c.translation}</div>
            <div style={{ fontSize: 12, color: P.textMute, marginTop: 6, fontFamily: P.fontMono }}>
              Stranger Things · {c.episode} · {c.time}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 22px", borderTop: `1px solid ${P.borderSoft}`,
          display: "flex", alignItems: "center", gap: 10, background: P.panelTint,
        }}>
          <span style={{ marginLeft: "auto" }} />
          <button onClick={onClose} style={{
            padding: "9px 16px", borderRadius: 8, border: `1px solid ${P.border}`,
            background: P.panel, color: P.textSoft, fontSize: 13, fontWeight: P.w.medium, cursor: "pointer",
          }}>{t("review.delete.cancel")}</button>
          <button onClick={onConfirm} style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            background: P.red, color: "#fff", fontSize: 13, fontWeight: P.w.semibold, cursor: "pointer",
            boxShadow: `0 4px 10px -4px ${P.red}`,
          }}>{t("review.delete.confirm")}</button>
        </div>
      </div>
    </div>
  );
}
