/**
 * 用 Intl.Segmenter 將文字拆成詞彙。
 * 支援中日韓英等語言，瀏覽器內建不需額外函式庫。
 */

export interface WordSegment {
  word: string;
  isWordLike: boolean; // true = 詞彙，false = 標點或空白
}

const segmenterCache = new Map<string, Intl.Segmenter>();

function getSegmenter(lang: string): Intl.Segmenter {
  // 取主語言代碼（zh-Hant → zh）
  const key = lang.split("-")[0];
  if (!segmenterCache.has(key)) {
    segmenterCache.set(key, new Intl.Segmenter(key, { granularity: "word" }));
  }
  return segmenterCache.get(key)!;
}

export function segmentText(text: string, lang: string): WordSegment[] {
  try {
    const segmenter = getSegmenter(lang);
    return [...segmenter.segment(text)].map((seg) => ({
      word: seg.segment,
      isWordLike: seg.isWordLike ?? false,
    }));
  } catch {
    // fallback：整段文字當一個詞
    return [{ word: text, isWordLike: true }];
  }
}
