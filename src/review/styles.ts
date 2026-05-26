export const REVIEW_STYLES = /* css */ `
  /* ========== Review Card ========== */

  .rc-card {
    background: #1a1a2e;
    border-radius: 16px;
    padding: 28px 32px;
    max-width: 560px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .rc-sentence {
    font-size: 22px;
    line-height: 1.6;
    text-align: center;
    color: #f0f0f8;
    word-break: break-word;
  }

  .rc-hidden {
    background: rgba(124, 58, 237, 0.12);
    border: 1.5px dashed rgba(124, 58, 237, 0.5);
    border-radius: 10px;
    padding: 14px 20px;
    text-align: center;
    color: #a78bfa;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    user-select: none;
  }

  .rc-hidden:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: #7c3aed;
  }

  .rc-translation {
    font-size: 16px;
    line-height: 1.6;
    text-align: center;
    color: #bbb;
    word-break: break-word;
  }

  .rc-word {
    cursor: pointer;
    border-radius: 4px;
    padding: 1px 2px;
    transition: background 0.15s, color 0.15s;
  }

  .rc-word:hover {
    background: rgba(124, 58, 237, 0.25);
    color: #c4b5fd;
  }

  .rc-blank {
    border-bottom: 2px dashed #7c3aed;
    color: #a78bfa;
    padding: 0 6px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .rc-meta {
    font-size: 12px;
    text-align: center;
    color: #666;
  }

  .rc-meta a {
    color: #7c3aed;
    text-decoration: none;
  }

  .rc-meta a:hover {
    color: #a78bfa;
    text-decoration: underline;
  }

  .rc-stats {
    font-size: 13px;
    color: #888;
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .rc-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
    border: none;
    margin: 2px 0;
  }

  .rc-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ========== Buttons ========== */

  .rc-btn {
    padding: 10px 22px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s, background 0.15s;
    line-height: 1;
  }

  .rc-btn:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .rc-btn:active {
    transform: translateY(0);
    opacity: 1;
  }

  .rc-btn-correct {
    background: #22c55e;
    color: #fff;
  }

  .rc-btn-correct:hover {
    background: #16a34a;
  }

  .rc-btn-wrong {
    background: #ef4444;
    color: #fff;
  }

  .rc-btn-wrong:hover {
    background: #dc2626;
  }

  .rc-btn-flip {
    background: #2a2a3e;
    color: #d0d0e8;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
  }

  .rc-btn-flip:hover {
    background: #32324e;
    border-color: rgba(255, 255, 255, 0.18);
  }

  .rc-btn-speak {
    background: #2a2a3e;
    color: #d0d0e8;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    padding: 10px 14px;
    font-size: 16px;
  }

  .rc-btn-speak:hover {
    background: #32324e;
    border-color: rgba(255, 255, 255, 0.18);
  }

  .rc-btn-delete {
    background: transparent;
    color: #666;
    border: 1.5px solid rgba(255, 255, 255, 0.07);
    font-size: 13px;
    font-weight: 400;
    padding: 7px 16px;
  }

  .rc-btn-delete:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }

  /* ========== Cloze Options ========== */

  .rc-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 4px 0;
  }

  .rc-option {
    background: #12121f;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 15px;
    color: #d0d0e8;
    cursor: pointer;
    text-align: center;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .rc-option:hover:not(.correct):not(.wrong) {
    background: #1e1e30;
    border-color: #7c3aed;
    color: #c4b5fd;
  }

  .rc-option.correct {
    background: rgba(34, 197, 94, 0.12);
    border-color: #22c55e;
    color: #22c55e;
    cursor: default;
  }

  .rc-option.wrong {
    background: rgba(239, 68, 68, 0.12);
    border-color: #ef4444;
    color: #ef4444;
    cursor: default;
  }

  /* ========== Page Layout ========== */

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: #1a1a2e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .page-header h1 {
    font-size: 20px;
    font-weight: 700;
    color: #f0f0f8;
    margin: 0;
  }

  .page-header .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .page-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ========== Stats Bar ========== */

  .stats-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 100px;
    background: #1a1a2e;
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #7c3aed;
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ========== Card List Controls ========== */

  .card-list-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .card-list-controls input[type="search"],
  .card-list-controls input[type="text"] {
    flex: 1;
    background: #1a1a2e;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 9px 14px;
    font-size: 14px;
    color: #f0f0f8;
    outline: none;
    transition: border-color 0.2s;
  }

  .card-list-controls input:focus {
    border-color: #7c3aed;
  }

  .card-list-controls input::placeholder {
    color: #555;
  }

  .card-list-controls select {
    background: #1a1a2e;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 9px 14px;
    font-size: 14px;
    color: #d0d0e8;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .card-list-controls select:focus {
    border-color: #7c3aed;
  }

  /* ========== Card List ========== */

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-list-item {
    background: #1a1a2e;
    border: 1.5px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .card-list-item:hover {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.06);
  }

  .card-list-item .card-list-text {
    flex: 1;
    overflow: hidden;
  }

  .card-list-item .card-list-original {
    font-size: 15px;
    color: #e0e0f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-list-item .card-list-translation {
    font-size: 13px;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .card-list-item .card-list-meta {
    font-size: 11px;
    color: #555;
    white-space: nowrap;
  }

  /* ========== Mode Selector ========== */

  .mode-selector {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .mode-btn {
    padding: 9px 20px;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    background: #12121f;
    color: #999;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }

  .mode-btn:hover {
    background: #1a1a2e;
    border-color: rgba(124, 58, 237, 0.4);
    color: #c4b5fd;
  }

  .mode-btn.active {
    background: rgba(124, 58, 237, 0.2);
    border-color: #7c3aed;
    color: #c4b5fd;
    font-weight: 600;
  }

  /* ========== Empty State ========== */

  .empty-state {
    text-align: center;
    color: #555;
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-state .empty-icon {
    font-size: 48px;
    opacity: 0.5;
  }

  .empty-state .empty-title {
    font-size: 18px;
    color: #777;
    font-weight: 600;
  }

  .empty-state .empty-desc {
    font-size: 14px;
    color: #555;
    max-width: 320px;
    line-height: 1.6;
  }

  /* ========== Confirm Dialog ========== */

  .confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .confirm-dialog {
    background: #1a1a2e;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 28px 32px;
    max-width: 380px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  }

  .confirm-dialog h3 {
    font-size: 18px;
    font-weight: 700;
    color: #f0f0f8;
    margin: 0;
  }

  .confirm-dialog p {
    font-size: 14px;
    color: #999;
    margin: 0;
    line-height: 1.6;
  }

  .confirm-dialog .confirm-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .confirm-dialog .confirm-cancel {
    padding: 9px 20px;
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .confirm-dialog .confirm-cancel:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ccc;
  }

  .confirm-dialog .confirm-ok {
    padding: 9px 20px;
    border-radius: 8px;
    border: none;
    background: #ef4444;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .confirm-dialog .confirm-ok:hover {
    background: #dc2626;
  }
`;
