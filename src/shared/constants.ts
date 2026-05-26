import type { DuoCaptionSettings } from "./types";

export const DEFAULT_SETTINGS: DuoCaptionSettings = {
  enabled: true,
  netflix: {
    primaryTrackId: null,
    secondaryTrackId: null,
    primaryLanguage: null,
    secondaryLanguage: null,
  },
  youtube: {
    primaryTrackId: null,
    secondaryTrackId: null,
    primaryLanguage: null,
    secondaryLanguage: null,
  },
  appearance: {
    primary: {
      fontSize: 36,
      fontFamily: "system-ui",
      fontColor: "#ffffff",
      opacity: 100,
    },
    secondary: {
      fontSize: 30,
      fontFamily: "system-ui",
      fontColor: "#ffffff",
      opacity: 75,
    },
    divider: {
      style: "dashed",
      thickness: 3,
      color: "#0afbff",
    },
    wordHighlightColor: "#ffffff",
    backgroundColor: "#000000",
    backgroundOpacity: 40,
    savedWord: {
      color: "#fd1717",
      bold: true,
      italic: false,
      sizeScale: 1.5,
    },
  },
  position: {
    primary: { x: 50, y: 85 },
    secondary: { x: 50, y: 75 },
  },
  toolbarPosition: null,
  playbackSpeed: 1.0,
  voicePreferences: {},
  shortcuts: {
    prevSentence: "<",
    nextSentence: ">",
  },
};

export const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5];

export const SHADOW_HOST_ID = "duo-caption-root";

export const APP_NAME = "DuoCaption";
