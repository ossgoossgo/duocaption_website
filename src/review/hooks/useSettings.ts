import { useState, useEffect } from "react";

interface DuoSettings {
  voicePreferences: Record<string, string>;
}

export function useVoicePreferences(): Record<string, string> {
  const [prefs, setPrefs] = useState<Record<string, string>>({});

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings: DuoSettings) => {
      if (settings?.voicePreferences) {
        setPrefs(settings.voicePreferences);
      }
    });
  }, []);

  return prefs;
}
