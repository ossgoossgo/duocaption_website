import { createContext, useContext } from "react";

export interface Palette {
  bg: string;
  bgSub: string;
  panel: string;
  panelTint: string;
  panelHi: string;
  border: string;
  borderSoft: string;
  text: string;
  textSoft: string;
  textMute: string;
  blue: string;
  blueSoft: string;
  blueGlow: string;
  red: string;
  redSoft: string;
  green: string;
  greenSoft: string;
  orange: string;
  shadow: string;
  shadowLg: string;
  font: string;
  fontMono: string;
  w: { regular: number; medium: number; semibold: number };
}

export const palette: Palette = {
  bg: "#FBFCFD",
  bgSub: "#F4F6FA",
  panel: "#FFFFFF",
  panelTint: "#F4F6FA",
  panelHi: "#FAFBFE",
  border: "#E4E9F0",
  borderSoft: "#EEF1F6",
  text: "#0F172A",
  textSoft: "#52607A",
  textMute: "#94A0B5",
  blue: "#10A45A",
  blueSoft: "#DCF4E5",
  blueGlow: "rgba(16,164,90,0.5)",
  red: "#E11D2E",
  redSoft: "#FCE7E9",
  green: "#10A45A",
  greenSoft: "#DEF5E8",
  orange: "#E89234",
  shadow: "0 1px 0 rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.04)",
  shadowLg: "0 4px 16px -8px rgba(15,23,42,0.1), 0 1px 2px rgba(15,23,42,0.04)",
  font: '"Inter","Noto Sans TC",-apple-system,sans-serif',
  fontMono: '"JetBrains Mono",ui-monospace,monospace',
  w: { regular: 400, medium: 500, semibold: 600 },
};

export const PaletteContext = createContext<Palette>(palette);
export const usePalette = () => useContext(PaletteContext);
