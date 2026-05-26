// ---- Subtitle data ----

export interface SubtitleTrack {
  id: string;
  language: string; // BCP-47 code, e.g. "en", "zh-Hant"
  label: string;    // Display name, e.g. "English", "中文（繁體）"
}

export interface SubtitleCue {
  startTime: number; // seconds
  endTime: number;   // seconds
  text: string;
}

// ---- Settings ----

export interface PlatformTrackSelection {
  primaryTrackId: string | null;
  secondaryTrackId: string | null; // null = single language mode
  primaryLanguage: string | null;  // BCP-47 code, 用於跨影片匹配
  secondaryLanguage: string | null;
}

export interface SubtitleLineAppearance {
  fontSize: number;    // px
  fontFamily: string;
  fontColor: string;   // hex
  opacity: number;     // 0-100, default 100/75
}

export type DividerStyle = "none" | "solid" | "dashed" | "dotted";

export interface DividerAppearance {
  style: DividerStyle;
  thickness: number;  // px, 1-4
  color: string;      // hex
}

export interface SavedWordAppearance {
  color: string;       // hex, default "#ff8a8a"
  bold: boolean;       // default true
  italic: boolean;     // default false
  sizeScale: number;   // 1.0 = 原大小, 1.1 = 放大10%, default 1.1
}

export interface SubtitleAppearance {
  primary: SubtitleLineAppearance;
  secondary: SubtitleLineAppearance;
  divider: DividerAppearance;
  wordHighlightColor: string; // hex, default "#bb94ff"
  backgroundColor: string;    // hex, default "#000000"
  backgroundOpacity: number;  // 0-100, default 40
  savedWord: SavedWordAppearance;
}

export interface SubtitlePosition {
  x: number; // percentage 0-100, relative to video area
  y: number; // percentage 0-100, relative to video area
}

export interface ShortcutSettings {
  prevSentence: string; // key value, e.g. "<", "ArrowLeft"
  nextSentence: string;
}

export interface DuoCaptionSettings {
  enabled: boolean;
  netflix: PlatformTrackSelection;
  youtube: PlatformTrackSelection;
  appearance: SubtitleAppearance;
  position: {
    primary: SubtitlePosition;
    secondary: SubtitlePosition;
  };
  toolbarPosition: SubtitlePosition | null; // null = 使用預設位置
  playbackSpeed: number; // 0.5 - 2.0
  voicePreferences: Record<string, string>; // lang code -> voice name
  shortcuts: ShortcutSettings;
}

// ---- Messages (content script <-> background) ----

import { SentenceCard, ReviewSettings } from "./card-types";

export type MessageType =
  | { type: "GET_SETTINGS" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<DuoCaptionSettings> }
  | { type: "SETTINGS_CHANGED"; payload: DuoCaptionSettings }
  | { type: "SAVE_SENTENCE"; payload: Omit<SentenceCard, "id" | "correctCount" | "streak" | "wrongCount" | "lastReviewAt" | "savedAt"> }
  | { type: "GET_CARDS" }
  | { type: "DELETE_CARD"; payload: { id: string } }
  | { type: "DELETE_CARD_BY_ORIGINAL"; payload: { original: string } }
  | { type: "UPDATE_CARD"; payload: SentenceCard }
  | { type: "GET_REVIEW_SETTINGS" }
  | { type: "UPDATE_REVIEW_SETTINGS"; payload: Partial<ReviewSettings> };

// ---- Platform ----

export type Platform = "netflix" | "youtube";
