export interface ShowData {
  id: string;
  title: string;
  subtitle: string;
  langPair: string;
  total: number;
  due: number;
  lastReview: string;
  accent: string;
  cover: string;
}

export const SHOWS: ShowData[] = [
  { id: "stranger", title: "Stranger Things", subtitle: "怪奇物語", langPair: "EN → 中", total: 24, due: 6, lastReview: "昨天", accent: "#7c4b8f", cover: "linear-gradient(135deg,#3a1e4a 0%,#7c2d3a 100%)" },
  { id: "squid", title: "오징어 게임", subtitle: "魷魚遊戲", langPair: "KO → 中", total: 18, due: 3, lastReview: "今天", accent: "#d94a4a", cover: "linear-gradient(135deg,#1a4d3a 0%,#d94a4a 100%)" },
  { id: "crown", title: "The Crown", subtitle: "王冠", langPair: "EN → 中", total: 12, due: 12, lastReview: "5 天前", accent: "#7c6f5c", cover: "linear-gradient(135deg,#2a3556 0%,#c8b87a 100%)" },
  { id: "kimetsu", title: "鬼滅の刃", subtitle: "鬼滅之刃", langPair: "JA → 中", total: 31, due: 8, lastReview: "2 天前", accent: "#c66", cover: "linear-gradient(135deg,#1a1f2e 0%,#d97757 100%)" },
  { id: "casa", title: "La Casa de Papel", subtitle: "紙房子", langPair: "ES → 中", total: 9, due: 0, lastReview: "1 週前", accent: "#c4302b", cover: "linear-gradient(135deg,#7a1a1a 0%,#e8a838 100%)" },
  { id: "dark", title: "Dark", subtitle: "闇", langPair: "DE → 中", total: 14, due: 4, lastReview: "3 天前", accent: "#3c5a6e", cover: "linear-gradient(135deg,#0f1626 0%,#3c5a6e 100%)" },
];

export interface CardData {
  id: number;
  original: string;
  translation: string;
  episode: string;
  time: string;
  streak: number;
  lastReview: string;
}

export const CARDS_STRANGER: CardData[] = [
  { id: 1, original: "I don't think we have a choice.", translation: "我不認為我們還有別的選擇。", episode: "S4 E7", time: "23:14", streak: 4, lastReview: "昨天" },
  { id: 2, original: "But what comes after is much worse.", translation: "但接下來發生的事更糟。", episode: "S4 E7", time: "24:42", streak: 0, lastReview: "4 天前" },
  { id: 3, original: "Friends don't lie.", translation: "朋友不會說謊。", episode: "S1 E4", time: "12:08", streak: 9, lastReview: "3 天前" },
  { id: 4, original: "You can't spell America without Erica.", translation: "America 這個字裡面藏著 Erica。", episode: "S3 E2", time: "08:33", streak: 2, lastReview: "今天" },
  { id: 5, original: "Running up that hill, with no problems.", translation: "毫無阻礙地，奔上那座山丘。", episode: "S4 E4", time: "54:18", streak: 6, lastReview: "昨天" },
  { id: 6, original: "We're not done yet.", translation: "我們還沒結束。", episode: "S4 E9", time: "1:12:40", streak: 1, lastReview: "2 天前" },
];

export const WEEK_DATA = [12, 8, 15, 6, 18, 22, 14];
export const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"];
