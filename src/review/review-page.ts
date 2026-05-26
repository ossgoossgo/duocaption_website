// src/review/review-page.ts
import type { SentenceCard, ReviewMode } from "@shared/card-types";
import type { ReviewSettings } from "@shared/card-types";
import { DEFAULT_REVIEW_SETTINGS } from "@shared/card-types";
import { sortForReview, calculateStats } from "@shared/review-engine";
import { ReviewCard } from "./review-card";
import { REVIEW_STYLES } from "./styles";
import { loadSettings } from "@shared/storage";

class ReviewPage {
  private cards: SentenceCard[] = [];
  private settings: ReviewSettings = DEFAULT_REVIEW_SETTINGS;
  private voicePreferences: Record<string, string> = {};
  private currentIndex = 0;
  private isReviewMode = false;
  private searchQuery = "";
  private filterShow = "";
  private app: HTMLElement;

  constructor() {
    const style = document.createElement("style");
    style.textContent = REVIEW_STYLES;
    document.head.appendChild(style);

    this.app = document.getElementById("app")!;
    this.init();
  }

  private async init(): Promise<void> {
    this.cards = await this.loadCards();
    this.settings = await this.loadSettings();
    const duoSettings = await loadSettings();
    this.voicePreferences = duoSettings.voicePreferences;
    this.renderMain();
  }

  private loadCards(): Promise<SentenceCard[]> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "GET_CARDS" }, (cards) => {
        resolve(cards ?? []);
      });
    });
  }

  private loadSettings(): Promise<ReviewSettings> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "GET_REVIEW_SETTINGS" }, (settings) => {
        resolve(settings ?? DEFAULT_REVIEW_SETTINGS);
      });
    });
  }

  private renderMain(): void {
    const stats = calculateStats(this.cards);
    const shows = [...new Set(this.cards.map((c) => c.showName))].filter(Boolean);
    const filtered = this.getFilteredCards();

    this.app.innerHTML = `
      <div class="page-header">
        <h1>DuoCaption 複習</h1>
        <div>
          <button class="rc-btn rc-btn-correct" id="start-review" ${this.cards.length === 0 ? "disabled" : ""}>
            開始複習 (${this.cards.length})
          </button>
        </div>
      </div>
      <div class="page-content">
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-value">${stats.totalCards}</div>
            <div class="stat-label">總收藏</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.streakGroups.new}</div>
            <div class="stat-label">新句子</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.streakGroups.learning}</div>
            <div class="stat-label">學習中</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.streakGroups.familiar}</div>
            <div class="stat-label">熟悉了</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.streakGroups.mastered}</div>
            <div class="stat-label">已掌握</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${stats.totalCorrect + stats.totalWrong > 0 ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100) : 0}%</div>
            <div class="stat-label">答對率</div>
          </div>
        </div>

        <div class="mode-selector">
          <button class="mode-btn ${this.settings.mode === "comprehension" ? "active" : ""}" data-mode="comprehension">理解模式</button>
          <button class="mode-btn ${this.settings.mode === "production" ? "active" : ""}" data-mode="production">產出模式</button>
          <button class="mode-btn ${this.settings.mode === "cloze" ? "active" : ""}" data-mode="cloze">填空模式</button>
        </div>

        <div class="card-list-controls">
          <input type="text" placeholder="搜尋句子..." id="search-input" value="${this.searchQuery}">
          <select id="filter-show">
            <option value="">全部影片</option>
            ${shows.map((s) => `<option value="${s}" ${this.filterShow === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </div>

        <div id="card-list">
          ${filtered.length === 0
            ? `<div class="empty-state"><p>還沒有收藏句子</p><p>看劇時 hover 字幕，點收藏按鈕開始收集</p></div>`
            : filtered.map((card) => this.renderListItem(card)).join("")}
        </div>
      </div>
    `;

    this.bindMainEvents();
  }

  private renderListItem(card: SentenceCard): string {
    const mins = Math.floor(card.timestamp / 60);
    const secs = card.timestamp % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;

    return `
      <div class="card-list-item" data-id="${card.id}">
        <div class="card-list-original">${card.original}</div>
        <div class="card-list-translation">${card.translation}</div>
        <div class="card-list-footer">
          <span>${card.showName} · ${card.seasonEpisode} · ${timeStr}</span>
          <span>✅${card.correctCount} 🔥${card.streak} ❌${card.wrongCount}</span>
        </div>
      </div>
    `;
  }

  private getFilteredCards(): SentenceCard[] {
    let result = this.cards;
    if (this.filterShow) {
      result = result.filter((c) => c.showName === this.filterShow);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.original.toLowerCase().includes(q) ||
          c.translation.toLowerCase().includes(q),
      );
    }
    return result;
  }

  private bindMainEvents(): void {
    this.app.querySelector("#start-review")?.addEventListener("click", () => {
      this.startReview();
    });

    this.app.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = (btn as HTMLElement).dataset.mode as ReviewMode;
        this.settings.mode = mode;
        chrome.runtime.sendMessage({
          type: "UPDATE_REVIEW_SETTINGS",
          payload: { mode },
        });
        this.renderMain();
      });
    });

    this.app.querySelector("#search-input")?.addEventListener("input", (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.renderMain();
    });

    this.app.querySelector("#filter-show")?.addEventListener("change", (e) => {
      this.filterShow = (e.target as HTMLSelectElement).value;
      this.renderMain();
    });

    this.app.querySelectorAll(".card-list-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = (item as HTMLElement).dataset.id!;
        this.editCard(id);
      });
    });
  }

  private startReview(): void {
    this.isReviewMode = true;
    const sorted = sortForReview(this.cards);
    this.currentIndex = 0;
    this.renderReviewView(sorted);
  }

  private renderReviewView(sorted: SentenceCard[]): void {
    if (this.currentIndex >= sorted.length) {
      this.isReviewMode = false;
      this.renderMain();
      return;
    }

    const card = sorted[this.currentIndex];
    const progress = `${this.currentIndex + 1} / ${sorted.length}`;

    this.app.innerHTML = `
      <div class="page-header">
        <h1>複習中 — ${progress}</h1>
        <button class="rc-btn rc-btn-flip" id="exit-review">結束複習</button>
      </div>
      <div class="page-content" id="review-container"></div>
    `;

    const container = this.app.querySelector("#review-container")!;
    const reviewCard = new ReviewCard(card, this.settings.mode, this.cards, {
      onUpdate: async (updated) => {
        const index = this.cards.findIndex((c) => c.id === updated.id);
        if (index !== -1) this.cards[index] = updated;
        chrome.runtime.sendMessage({ type: "UPDATE_CARD", payload: updated });
      },
      onDelete: async (id) => {
        this.cards = this.cards.filter((c) => c.id !== id);
        chrome.runtime.sendMessage({ type: "DELETE_CARD", payload: { id } });
        this.currentIndex++;
        this.renderReviewView(sorted);
      },
      onNext: () => {
        this.currentIndex++;
        this.renderReviewView(sorted);
      },
    }, this.voicePreferences);

    container.appendChild(reviewCard.el);

    this.app.querySelector("#exit-review")?.addEventListener("click", () => {
      this.isReviewMode = false;
      this.renderMain();
    });
  }

  private editCard(id: string): void {
    const card = this.cards.find((c) => c.id === id);
    if (!card) return;

    this.app.innerHTML = `
      <div class="page-header">
        <h1>編輯卡片</h1>
        <button class="rc-btn rc-btn-flip" id="back-to-list">返回</button>
      </div>
      <div class="page-content">
        <div class="rc-card">
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">原文</label>
            <div class="rc-sentence">${card.original}</div>
          </div>
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">翻譯（可編輯）</label>
            <textarea id="edit-translation" style="width:100%;min-height:60px;background:#1a1a2e;border:1px solid #333;border-radius:6px;color:#eee;padding:8px;font-size:14px;resize:vertical;">${card.translation}</textarea>
          </div>
          ${this.renderCardMeta(card)}
          <div class="rc-actions" style="margin-top:16px;">
            <button class="rc-btn rc-btn-correct" id="save-edit">儲存</button>
            <button class="rc-btn rc-btn-delete" id="delete-card">刪除卡片</button>
          </div>
        </div>
      </div>
    `;

    this.app.querySelector("#back-to-list")?.addEventListener("click", () => {
      this.renderMain();
    });

    this.app.querySelector("#save-edit")?.addEventListener("click", () => {
      const textarea = this.app.querySelector("#edit-translation") as HTMLTextAreaElement;
      const updated = { ...card, translation: textarea.value };
      const index = this.cards.findIndex((c) => c.id === id);
      if (index !== -1) this.cards[index] = updated;
      chrome.runtime.sendMessage({ type: "UPDATE_CARD", payload: updated });
      this.renderMain();
    });

    this.app.querySelector("#delete-card")?.addEventListener("click", () => {
      this.showDeleteConfirm(id);
    });
  }

  private showDeleteConfirm(id: string): void {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <p>確定要刪除這張卡片嗎？</p>
        <div class="rc-actions">
          <button class="rc-btn rc-btn-flip" id="confirm-cancel">取消</button>
          <button class="rc-btn rc-btn-wrong" id="confirm-delete">刪除</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector("#confirm-cancel")?.addEventListener("click", () => {
      overlay.remove();
    });

    overlay.querySelector("#confirm-delete")?.addEventListener("click", () => {
      this.cards = this.cards.filter((c) => c.id !== id);
      chrome.runtime.sendMessage({ type: "DELETE_CARD", payload: { id } });
      overlay.remove();
      this.renderMain();
    });
  }

  private renderCardMeta(card: SentenceCard): string {
    const mins = Math.floor(card.timestamp / 60);
    const secs = card.timestamp % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, "0")}`;
    return `<div class="rc-meta">${card.showName} · ${card.seasonEpisode} · ${timeStr}</div>
    <div class="rc-stats">
      <span>✅ ${card.correctCount}</span>
      <span>🔥 ${card.streak}</span>
      <span>❌ ${card.wrongCount}</span>
      <span>📅 ${card.savedAt.split("T")[0]}</span>
    </div>`;
  }
}

new ReviewPage();
