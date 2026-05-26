// src/review/review-card.ts
import type { SentenceCard } from "@shared/card-types";
import type { ReviewMode } from "@shared/card-types";
import type { ClozeResult } from "@shared/review-engine";
import { generateClozeOptions, markCorrect, markWrong } from "@shared/review-engine";
import { segmentText } from "@content/providers/word-segmenter";
import { translateWord } from "@content/providers/translator";
import { speak } from "@shared/speech";

export interface ReviewCardCallbacks {
  onUpdate: (card: SentenceCard) => void;
  onDelete: (id: string) => void;
  onNext: () => void;
}

export class ReviewCard {
  readonly el: HTMLDivElement;
  private card: SentenceCard;
  private mode: ReviewMode;
  private allCards: SentenceCard[];
  private revealed = false;
  private cloze: ClozeResult | null = null;
  private callbacks: ReviewCardCallbacks;
  private voicePreferences: Record<string, string>;

  constructor(
    card: SentenceCard,
    mode: ReviewMode,
    allCards: SentenceCard[],
    callbacks: ReviewCardCallbacks,
    voicePreferences: Record<string, string> = {},
  ) {
    this.card = card;
    this.mode = mode;
    this.allCards = allCards;
    this.callbacks = callbacks;
    this.voicePreferences = voicePreferences;
    this.el = document.createElement("div");
    this.el.className = "rc-card";
    this.render();
  }

  private render(): void {
    this.revealed = false;

    if (this.mode === "cloze") {
      this.cloze = generateClozeOptions(this.card, this.allCards, this.card.originalLang);
      if (!this.cloze) {
        this.mode = "comprehension"; // fallback
      }
    }

    if (this.mode === "cloze" && this.cloze) {
      this.renderCloze();
    } else {
      this.renderFlipCard();
    }
  }

  private renderFlipCard(): void {
    const isComprehension = this.mode === "comprehension";
    const shown = isComprehension ? this.card.original : this.card.translation;
    const hidden = isComprehension ? this.card.translation : this.card.original;
    const shownLang = isComprehension ? this.card.originalLang : this.card.translationLang;

    this.el.innerHTML = `
      <div class="rc-sentence">${this.renderWords(shown, shownLang)}</div>
      <div class="rc-hidden" id="rc-hidden">點擊翻面</div>
      <div class="rc-translation" id="rc-answer" style="display:none;"></div>
      <div class="rc-divider"></div>
      ${this.renderMeta()}
      ${this.renderStats()}
      <div class="rc-actions">
        <button class="rc-btn rc-btn-speak" id="rc-speak" title="發音">🔊</button>
        <button class="rc-btn rc-btn-flip" id="rc-flip">翻面</button>
        <button class="rc-btn rc-btn-wrong" id="rc-wrong" style="display:none;">不會 ✗</button>
        <button class="rc-btn rc-btn-correct" id="rc-correct" style="display:none;">會了 ✓</button>
      </div>
      <div class="rc-actions" style="margin-top:8px;">
        <button class="rc-btn rc-btn-delete" id="rc-delete">刪除</button>
      </div>
    `;

    const answerEl = this.el.querySelector("#rc-answer") as HTMLElement;
    const hiddenEl = this.el.querySelector("#rc-hidden") as HTMLElement;
    const flipBtn = this.el.querySelector("#rc-flip") as HTMLButtonElement;
    const wrongBtn = this.el.querySelector("#rc-wrong") as HTMLButtonElement;
    const correctBtn = this.el.querySelector("#rc-correct") as HTMLButtonElement;

    const reveal = () => {
      if (this.revealed) return;
      this.revealed = true;
      const answerLang = isComprehension ? this.card.translationLang : this.card.originalLang;
      answerEl.innerHTML = this.renderWords(hidden, answerLang);
      answerEl.style.display = "";
      hiddenEl.style.display = "none";
      flipBtn.style.display = "none";
      wrongBtn.style.display = "";
      correctBtn.style.display = "";
    };

    hiddenEl.addEventListener("click", reveal);
    flipBtn.addEventListener("click", reveal);
    correctBtn.addEventListener("click", () => this.handleCorrect());
    wrongBtn.addEventListener("click", () => this.handleWrong());

    this.bindCommon();
  }

  private renderCloze(): void {
    const cloze = this.cloze!;
    const sentenceHtml = cloze.segments
      .map((seg, i) =>
        i === cloze.blankIndex
          ? `<span class="rc-blank" id="rc-blank">＿＿＿</span>`
          : seg,
      )
      .join("");

    this.el.innerHTML = `
      <div class="rc-sentence">${sentenceHtml}</div>
      <div class="rc-translation" style="color:#666;">${this.card.translation}</div>
      <div class="rc-options" id="rc-options">
        ${cloze.options.map((opt, i) => `<button class="rc-option" data-index="${i}" data-value="${opt}">${opt}</button>`).join("")}
      </div>
      <div class="rc-divider"></div>
      ${this.renderMeta()}
      ${this.renderStats()}
      <div class="rc-actions">
        <button class="rc-btn rc-btn-speak" id="rc-speak" title="發音">🔊</button>
        <button class="rc-btn rc-btn-delete" id="rc-delete">刪除</button>
      </div>
    `;

    const optionsEl = this.el.querySelector("#rc-options") as HTMLElement;
    const blankEl = this.el.querySelector("#rc-blank") as HTMLElement;

    optionsEl.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(".rc-option") as HTMLElement;
      if (!btn || btn.classList.contains("correct") || btn.classList.contains("wrong")) return;

      const value = btn.dataset.value!;
      if (value === cloze.correctAnswer) {
        btn.classList.add("correct");
        blankEl.textContent = cloze.correctAnswer;
        blankEl.style.color = "#22c55e";
        this.handleCorrect();
      } else {
        btn.classList.add("wrong");
        optionsEl.querySelectorAll(".rc-option").forEach((el) => {
          if ((el as HTMLElement).dataset.value === cloze.correctAnswer) {
            el.classList.add("correct");
          }
        });
        blankEl.textContent = cloze.correctAnswer;
        blankEl.style.color = "#ef4444";
        this.handleWrong();
      }
    });

    this.bindCommon();
  }

  private bindCommon(): void {
    this.el.querySelector("#rc-speak")?.addEventListener("click", () => {
      speak(this.card.original, this.card.originalLang, this.voicePreferences);
    });

    this.el.querySelector("#rc-delete")?.addEventListener("click", () => {
      this.callbacks.onDelete(this.card.id);
    });

    this.el.querySelectorAll(".rc-word").forEach((wordEl) => {
      wordEl.addEventListener("click", async (e) => {
        e.stopPropagation();
        const word = (wordEl as HTMLElement).dataset.word!;
        const lang = (wordEl as HTMLElement).dataset.lang!;

        speak(word, lang, this.voicePreferences);

        if (this.card.originalLang && this.card.translationLang) {
          const targetLang = lang === this.card.originalLang
            ? this.card.translationLang
            : this.card.originalLang;
          const result = await translateWord(word, lang, targetLang);
          const el = wordEl as HTMLElement;
          el.title = result.translated;
        }
      });
    });

    this.el.querySelector("#rc-jump")?.addEventListener("click", (e) => {
      e.preventDefault();
      const url = `https://www.netflix.com/watch/${this.card.netflixId}?t=${this.card.timestamp}`;
      window.open(url, "_blank");
    });
  }

  private handleCorrect(): void {
    const updated = markCorrect(this.card);
    this.callbacks.onUpdate(updated);
    setTimeout(() => this.callbacks.onNext(), 800);
  }

  private handleWrong(): void {
    const updated = markWrong(this.card);
    this.callbacks.onUpdate(updated);
    setTimeout(() => this.callbacks.onNext(), 1200);
  }

  private renderWords(text: string, lang: string): string {
    const segments = segmentText(text, lang);
    return segments
      .map((seg) =>
        seg.isWordLike
          ? `<span class="rc-word" data-word="${seg.word}" data-lang="${lang}">${seg.word}</span>`
          : seg.word,
      )
      .join("");
  }

  private renderMeta(): string {
    const { showName, seasonEpisode, timestamp, netflixId } = this.card;
    const mins = Math.floor(timestamp / 60);
    const secs = timestamp % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;
    const jumpLink = netflixId
      ? `<a href="#" id="rc-jump">${showName} · ${seasonEpisode} · ${timeStr} ▶</a>`
      : `${showName} · ${seasonEpisode} · ${timeStr}`;
    return `<div class="rc-meta">${jumpLink}</div>`;
  }

  private renderStats(): string {
    return `<div class="rc-stats">
      <span>✅ ${this.card.correctCount}</span>
      <span>🔥 ${this.card.streak}</span>
      <span>❌ ${this.card.wrongCount}</span>
    </div>`;
  }
}
