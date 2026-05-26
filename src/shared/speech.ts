let voicesLoaded = false;
let voicesPromiseResolve: (() => void) | null = null;
const voicesReady = new Promise<void>((resolve) => {
  voicesPromiseResolve = resolve;
});

function initVoices() {
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesLoaded = true;
    voicesPromiseResolve?.();
  }
}

// Some browsers load voices async
if (typeof speechSynthesis !== "undefined") {
  initVoices();
  speechSynthesis.addEventListener("voiceschanged", initVoices);
}

export function getVoicesForLang(lang: string): SpeechSynthesisVoice[] {
  const base = lang.split("-")[0].toLowerCase();
  return speechSynthesis.getVoices().filter((v) => {
    const vBase = v.lang.split("-")[0].toLowerCase();
    return vBase === base;
  });
}

export function getAllVoices(): SpeechSynthesisVoice[] {
  return speechSynthesis.getVoices();
}

export async function waitForVoices(): Promise<void> {
  if (voicesLoaded) return;
  await voicesReady;
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  let score = 0;
  const nameLower = voice.name.toLowerCase();

  // Google 語音品質穩定，大加分
  if (nameLower.includes("google")) score += 50;

  // 系統高品質語音關鍵字
  if (nameLower.includes("premium")) score += 40;
  if (nameLower.includes("enhanced")) score += 35;
  if (nameLower.includes("natural")) score += 30;
  if (nameLower.includes("neural")) score += 25;

  // Microsoft Online 語音品質也不錯
  if (nameLower.includes("microsoft") && !voice.localService) score += 20;

  // 已下載的高品質本地語音（非預設的老舊語音）
  // macOS 預設 default 語音通常是最差的那個，所以不加分
  // 但有 quality keyword 的本地語音加分
  if (voice.localService && score > 0) score += 5;

  return score;
}

function pickBestVoice(candidates: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (candidates.length === 0) return undefined;
  const best = candidates.reduce((a, b) => scoreVoice(b) > scoreVoice(a) ? b : a);
  // 只在有明確好選擇時才覆蓋，避免選到更差的
  return scoreVoice(best) > 0 ? best : undefined;
}

function findVoice(
  lang: string,
  preferredName?: string,
): SpeechSynthesisVoice | undefined {
  const candidates = getVoicesForLang(lang);
  if (preferredName) {
    const match = candidates.find((v) => v.name === preferredName);
    if (match) return match;
  }
  // 沒有偏好設定時，自動挑品質最好的
  return pickBestVoice(candidates);
}

export function speak(
  text: string,
  lang: string,
  voicePreferences?: Record<string, string>,
  rate = 0.9,
): void {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  // Try exact lang match first, then base lang
  const preferred = voicePreferences?.[lang] ?? voicePreferences?.[lang.split("-")[0]];
  const voice = findVoice(lang, preferred);
  if (voice) utterance.voice = voice;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
