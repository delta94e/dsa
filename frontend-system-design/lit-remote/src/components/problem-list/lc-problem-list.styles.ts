import { css } from 'lit';

/**
 * Styles for problem list component
 */
export const problemListStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Topic Tags Row */
  .topic-tags {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    overflow-x: auto;
    border-bottom: 1px solid #333;
    margin-bottom: 16px;
  }

  .topic-tags::-webkit-scrollbar {
    height: 4px;
  }

  .topic-tags::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 2px;
  }

  .topic-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #888;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s;
  }

  .topic-tag:hover {
    color: #fff;
  }

  .topic-tag .count {
    color: #666;
    font-size: 12px;
  }

  .expand-btn {
    color: #ffa116;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }

  /* Category Tabs */
  .category-tabs {
    display: flex;
    gap: 8px;
    padding: 16px 0;
    overflow-x: auto;
  }

  .category-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 20px;
    color: #888;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .category-tab:hover {
    background: #333;
    color: #fff;
  }

  .category-tab.active {
    background: #333;
    color: #fff;
    border-color: #555;
  }

  .category-tab .icon {
    font-size: 16px;
  }

  /* Search & Controls */
  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #333;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 8px;
    flex: 0 0 200px;
  }

  .search-box input {
    background: transparent;
    border: none;
    color: #888;
    font-size: 14px;
    outline: none;
    width: 100%;
  }

  .search-box input::placeholder {
    color: #666;
  }

  .search-icon {
    color: #666;
    font-size: 16px;
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s;
  }

  .control-btn:hover {
    background: #333;
    color: #fff;
  }

  /* Sort Dropdown */
  .sort-dropdown {
    position: relative;
  }

  .sort-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #ccc;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
    transition: all 0.2s;
  }

  .sort-btn:hover {
    background: #333;
    color: #fff;
  }

  .sort-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 180px;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 8px 0;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .sort-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    color: #ccc;
    cursor: pointer;
    transition: background 0.15s;
  }

  .sort-option:hover {
    background: #333;
  }

  .sort-option.active {
    color: #fff;
  }

  .sort-option.premium {
    color: #666;
    cursor: not-allowed;
  }

  .sort-option .check {
    color: #2cbb5d;
    font-size: 14px;
  }

  .sort-option .lock {
    color: #ffa116;
    font-size: 12px;
  }

  /* Filter Panel */
  .filter-dropdown {
    position: relative;
  }

  .control-btn.active {
    background: #333;
    color: #ffa116;
  }

  .filter-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    max-width: 90vw;
    background: #262626;
    border: 1px solid #404040;
    border-radius: 16px;
    padding: 24px;
    z-index: 1000;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  }

  .filter-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
  }

  .filter-rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
    max-height: 280px;
    overflow-y: auto;
  }

  .filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
  }

  .filter-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 16px;
    flex-shrink: 0;
  }

  .filter-select {
    flex: 1;
    min-width: 100px;
    padding: 10px 14px;
    background: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 13px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23888' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 18px;
    padding-right: 30px;
  }

  .filter-select:hover {
    border-color: #555;
  }

  .filter-select:focus {
    outline: none;
    border-color: #ffa116;
  }

  .filter-select.small {
    flex: 0 0 90px;
    min-width: 90px;
  }

  .remove-btn {
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid transparent;
    color: #666;
    font-size: 20px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    background: rgba(255, 100, 100, 0.1);
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  .add-filter-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px dashed #404040;
    border-radius: 10px;
    color: #888;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 20px;
  }

  .add-filter-btn:hover {
    border-color: #666;
    color: #e0e0e0;
    background: rgba(255, 255, 255, 0.02);
  }

  /* Topics Panel */
  .topics-trigger {
    flex: 1;
    min-width: 100px;
    padding: 10px 14px;
    background: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 8px;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
  }

  .topics-trigger:hover {
    border-color: #555;
    color: #ccc;
  }

  .topics-panel {
    margin: 12px 0 0 32px;
    padding: 16px;
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 12px;
  }

  .topics-search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .topics-search span {
    color: #666;
    font-size: 14px;
  }

  .topics-search input {
    flex: 1;
    background: transparent;
    border: none;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
  }

  .topics-search input::placeholder {
    color: #666;
  }

  .topics-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .topic-chip {
    padding: 8px 14px;
    background: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 20px;
    color: #ccc;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .topic-chip:hover {
    background: #333;
    border-color: #555;
    color: #fff;
  }

  .topic-chip.selected {
    background: rgba(255, 161, 22, 0.15);
    border-color: #ffa116;
    color: #ffa116;
  }

  .topics-footer {
    display: flex;
    justify-content: flex-end;
  }

  .topics-reset {
    padding: 8px 16px;
    background: #333;
    border: none;
    border-radius: 6px;
    color: #ccc;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .topics-reset:hover {
    background: #444;
    color: #fff;
  }

  .filter-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #333;
  }

  .reset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 28px;
    background: #404040;
    border: none;
    border-radius: 10px;
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .reset-btn:hover {
    background: #4a4a4a;
    color: #fff;
  }

  .stats {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
    color: #888;
    font-size: 14px;
  }

  .shuffle-btn {
    color: #888;
    cursor: pointer;
    font-size: 18px;
  }

  /* Problem Table */
  .problem-table {
    width: 100%;
  }

  /* Table Header */
  .table-header {
    display: grid;
    grid-template-columns: 60px 1fr 100px 80px 80px;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #333;
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .header-status {
    text-align: center;
  }

  .header-acceptance,
  .header-difficulty {
    text-align: right;
  }

  /* Virtualized Container */
  .virtual-container {
    height: 600px;
    overflow-y: auto;
    position: relative;
  }

  .virtual-container::-webkit-scrollbar {
    width: 8px;
  }

  .virtual-container::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  .virtual-content {
    position: relative;
  }

  .problem-row {
    position: absolute;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 60px 1fr 100px 80px 80px;
    align-items: center;
    padding: 12px 16px;
    box-shadow: inset 0 -1px 0 0 #333;
    transition: background 0.2s;
    cursor: pointer;
    box-sizing: border-box;
  }

  .problem-row:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .problem-row.featured {
    background: transparent;
  }

  .problem-row.featured:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .status-icon {
    font-size: 16px;
    color: #666;
  }

  .status-icon.solved {
    color: #2cbb5d;
  }

  .status-icon.attempted {
    color: #ffa116;
  }

  .problem-title {
    font-size: 14px;
    color: #fff;
    padding-right: 16px;
  }

  .problem-title.featured {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .featured-icon {
    color: #ffa116;
    font-size: 14px;
  }

  .acceptance {
    font-size: 14px;
    color: #888;
    text-align: right;
  }

  .difficulty {
    font-size: 12px;
    text-align: right;
    padding-right: 12px;
  }

  .difficulty.easy {
    color: #2cbb5d;
  }

  .difficulty.medium {
    color: #ffa116;
  }

  .difficulty.hard {
    color: #ff375f;
  }

  .icons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    color: #666;
    font-size: 14px;
  }

  /* Skeleton Loading */
  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
  }

  .skeleton-bar {
    height: 44px;
    background: #2a2a2a;
    border-radius: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .skeleton-bar:nth-child(2) {
    animation-delay: 0.1s;
  }

  .skeleton-bar:nth-child(3) {
    animation-delay: 0.2s;
  }

  .skeleton-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  .skeleton-bar:nth-child(5) {
    animation-delay: 0.4s;
  }

  .skeleton-bar:nth-child(6) {
    animation-delay: 0.5s;
  }

  .skeleton-bar:nth-child(7) {
    animation-delay: 0.6s;
  }

  .skeleton-bar:nth-child(8) {
    animation-delay: 0.7s;
  }

  /* Empty State */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
  }

  .page-btn {
    padding: 8px 12px;
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s;
  }

  .page-btn:hover:not(:disabled) {
    background: #333;
    color: #fff;
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-btn.active {
    background: #ffa116;
    border-color: #ffa116;
    color: #000;
  }

  .page-info {
    color: #888;
    font-size: 14px;
    padding: 0 12px;
  }
`;
