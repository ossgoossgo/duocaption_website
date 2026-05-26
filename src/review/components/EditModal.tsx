import { usePalette } from "../theme";
import { CARDS_STRANGER } from "../mock-data";
import { t } from "@shared/i18n";

interface EditModalProps {
  onClose: () => void;
  onSave?: () => void;
}

export function EditModal({ onClose, onSave }: EditModalProps) {
  const P = usePalette();
  const c = CARDS_STRANGER[1]; // mock

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(15,23,42,0.35)",
      }} />

      {/* Modal */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 580, background: P.panel, borderRadius: 14,
        border: `1px solid ${P.border}`, boxShadow: P.shadowLg,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 22px 14px", borderBottom: `1px solid ${P.borderSoft}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 12, color: P.textMute, fontFamily: P.fontMono, fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
              {t("review.edit.title")} · STRANGER THINGS · {c.episode} · {c.time}
            </div>
            <div style={{ fontSize: 17, fontWeight: P.w.semibold, color: P.text }}>{t("review.edit.subtitle")}</div>
          </div>
          <span onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, display: "grid", placeItems: "center",
            color: P.textMute, cursor: "pointer", fontSize: 16,
          }}>✕</span>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Original (locked) */}
          <div>
            <div style={{ fontSize: 12, color: P.textMute, fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{t("review.edit.originalLocked")}</div>
            <div style={{
              padding: "12px 14px", borderRadius: 8,
              background: P.panelTint, border: `1px solid ${P.borderSoft}`,
              fontSize: 15, color: P.textSoft, lineHeight: 1.5,
            }}>"{c.original}"</div>
          </div>

          {/* Translation (editable) */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8,
            }}>
              <span style={{ fontSize: 12, color: P.textMute, fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase" }}>{t("review.edit.translation")}</span>
              <span style={{ fontSize: 12, color: P.blue, cursor: "pointer" }}>{t("review.edit.revert")}</span>
            </div>
            <textarea
              defaultValue={c.translation}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 8,
                background: P.panel, border: `1.5px solid ${P.blue}`,
                fontSize: 16, color: P.text, lineHeight: 1.5,
                outline: "none", minHeight: 80, boxShadow: `0 0 0 3px ${P.blueSoft}`,
                fontFamily: P.font, resize: "vertical",
              }}
            />
            <div style={{ fontSize: 12, color: P.textMute, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span>原翻譯：{c.translation}</span>
            </div>
          </div>

          {/* TODO: 筆記功能之後再開放
          <div>
            <div style={{ fontSize: 12, color: P.textMute, fontWeight: P.w.semibold, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>個人筆記 (選填)</div>
            <textarea
              placeholder="寫下你的理解、語感、聯想…"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 8,
                background: P.panel, border: `1px solid ${P.border}`,
                fontSize: 13, color: P.text, lineHeight: 1.5,
                minHeight: 56, fontFamily: P.font, resize: "vertical",
                outline: "none",
              }}
            />
          </div>
          */}
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
          }}>{t("review.edit.cancel")}</button>
          <button onClick={onSave ?? onClose} style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            background: P.blue, color: "#fff", fontSize: 13, fontWeight: P.w.semibold, cursor: "pointer",
            boxShadow: `0 4px 10px -4px ${P.blueGlow}`,
          }}>{t("review.edit.save")}</button>
        </div>
      </div>
    </div>
  );
}
