import { DEFAULT_SETTINGS } from "./constants";
import type { DuoCaptionSettings } from "./types";

const STORAGE_KEY = "duo-caption-settings";

export async function loadSettings(): Promise<DuoCaptionSettings> {
  const result = await chrome.storage.sync.get([STORAGE_KEY]);
  const stored = result[STORAGE_KEY] as Partial<DuoCaptionSettings> | undefined;
  if (!stored) return { ...DEFAULT_SETTINGS };
  return deepMerge(DEFAULT_SETTINGS as unknown as Record<string, unknown>, stored as unknown as Record<string, unknown>) as unknown as DuoCaptionSettings;
}

export async function saveSettings(
  partial: Partial<DuoCaptionSettings>,
): Promise<void> {
  const current = await loadSettings();
  const merged = deepMerge(current as unknown as Record<string, unknown>, partial as unknown as Record<string, unknown>) as unknown as DuoCaptionSettings;
  await chrome.storage.sync.set({ [STORAGE_KEY]: merged });
}

export function onSettingsChanged(
  callback: (settings: DuoCaptionSettings) => void,
): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: string,
  ) => {
    if (area !== "sync" || !(STORAGE_KEY in changes)) return;
    const newValue = changes[STORAGE_KEY].newValue as DuoCaptionSettings;
    callback(newValue);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      typeof target[key] === "object" &&
      target[key] !== null
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
