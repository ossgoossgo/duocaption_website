/**
 * 使用 Google Translate 免費端點翻譯單詞。
 * 有簡單的快取避免重複請求。
 * dt=t 基本翻譯，dt=bd 字典（詞性 + 多義）
 */

export interface DictEntry {
  pos: string;      // 詞性（verb, noun, adjective...）
  terms: string[];  // 該詞性下的多個意思
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
  dictionary?: DictEntry[];
}

const cache = new Map<string, TranslationResult>();

const MAX_POS = 3;    // 最多顯示 3 個詞性
const MAX_TERMS = 4;  // 每個詞性最多 4 個意思

export async function translateWord(
  word: string,
  sourceLang: string,
  targetLang: string,
): Promise<TranslationResult> {
  const cacheKey = `${sourceLang}:${targetLang}:${word}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const sl = normalizeLang(sourceLang);
    const isEnglish = sl === "en";
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${normalizeLang(targetLang)}&dt=t${isEnglish ? "&dt=bd" : ""}&q=${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const data = await response.json();

    // data[0] 是翻譯結果陣列，每個元素的 [0] 是翻譯文字
    const translated = data?.[0]
      ?.map((item: [string]) => item[0])
      ?.join("") ?? word;

    // data[1] 是字典資料：[[詞性, [意思1, 意思2, ...], ...], ...]
    let dictionary: DictEntry[] | undefined;
    if (Array.isArray(data?.[1])) {
      dictionary = data[1]
        .slice(0, MAX_POS)
        .map((entry: [string, string[]]) => ({
          pos: entry[0],
          terms: (entry[1] || []).slice(0, MAX_TERMS),
        }))
        .filter((e: DictEntry) => e.terms.length > 0);

      if (dictionary.length === 0) dictionary = undefined;
    }

    const result: TranslationResult = {
      original: word,
      translated,
      sourceLang,
      targetLang,
      dictionary,
    };

    cache.set(cacheKey, result);
    return result;
  } catch {
    return { original: word, translated: word, sourceLang, targetLang };
  }
}

/**
 * 把 BCP-47 語言代碼轉成 Google Translate 接受的格式
 */
function normalizeLang(lang: string): string {
  const map: Record<string, string> = {
    "zh-Hant": "zh-TW",
    "zh-Hans": "zh-CN",
    "zh": "zh-TW",
  };
  return map[lang] ?? lang.split("-")[0];
}
