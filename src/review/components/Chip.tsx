import type { ReactNode } from "react";
import { usePalette } from "../theme";

interface ChipProps {
  children: ReactNode;
  tone?: "mute" | "blue" | "red" | "green" | "line";
}

export function Chip({ children, tone = "mute" }: ChipProps) {
  const P = usePalette();
  const tones: Record<string, { bg: string; color: string; border?: string }> = {
    mute: { bg: P.panelTint, color: P.textSoft },
    blue: { bg: P.blueSoft, color: P.blue },
    red: { bg: P.redSoft, color: P.red },
    green: { bg: P.greenSoft, color: P.green },
    line: { bg: "transparent", color: P.textSoft, border: `1px solid ${P.border}` },
  };
  const t = tones[tone];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 7px", borderRadius: 5, fontSize: 12, fontWeight: P.w.medium,
      background: t.bg, color: t.color,
      border: t.border || "1px solid transparent",
      letterSpacing: 0.2,
    }}>{children}</span>
  );
}
