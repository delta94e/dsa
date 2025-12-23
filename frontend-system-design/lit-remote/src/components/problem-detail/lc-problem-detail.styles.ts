/**
 * Problem Detail Styles
 * @module components/problem-detail/styles
 */

import { css } from 'lit';

export const problemDetailStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    height: calc(100vh - 60px);
    padding: 8px;
  }

  .panel {
    background: #1a1a1a;
    border-radius: 8px;
    border: 1px solid #333;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Left Panel - Description */
  .panel-tabs {
    display: flex;
    padding: 0 16px;
    background: #252525;
    border-bottom: 1px solid #333;
  }

  .panel-tab {
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .panel-tab:hover {
    color: #ccc;
  }

  .panel-tab.active {
    color: #fff;
    border-bottom-color: #ffa116;
  }

  .panel-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .problem-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .problem-header h1 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #fff;
  }

  .difficulty {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .Easy { background: rgba(0, 184, 163, 0.15); color: #00b8a3; }
  .Medium { background: rgba(255, 192, 30, 0.15); color: #ffc01e; }
  .Hard { background: rgba(255, 55, 95, 0.15); color: #ff375f; }

  .topic-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .topic-chip {
    padding: 4px 10px;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 16px;
    color: #888;
    font-size: 12px;
    cursor: pointer;
  }

  .topic-chip:hover {
    background: #333;
    color: #ccc;
  }

  .description {
    color: #c9d1d9;
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 24px;
  }

  .examples {
    margin-bottom: 24px;
  }

  .example {
    margin-bottom: 20px;
  }

  .example-header {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .example-content pre {
    background: #252525;
    border-radius: 6px;
    padding: 12px 16px;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 13px;
    color: #c9d1d9;
    margin: 0;
    overflow-x: auto;
  }

  .section-title {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .constraints-list {
    margin: 0;
    padding-left: 20px;
    color: #888;
    font-size: 13px;
    line-height: 1.8;
  }

  .panel-footer {
    display: flex;
    gap: 16px;
    padding: 12px 20px;
    background: #252525;
    border-top: 1px solid #333;
  }

  .stat {
    color: #666;
    font-size: 13px;
    cursor: pointer;
  }

  .stat:hover {
    color: #ccc;
  }

  /* Right Panel - Code Editor */
  .right-panel {
    display: flex;
    flex-direction: column;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #252525;
    border-bottom: 1px solid #333;
  }

  .code-label {
    color: #888;
    font-size: 13px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lang-select {
    padding: 6px 12px;
    background: #333;
    border: 1px solid #444;
    border-radius: 4px;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
  }

  .auto-label {
    color: #666;
    font-size: 12px;
  }

  .code-area {
    flex: 1;
    display: flex;
    min-height: 200px;
    background: #1e1e1e;
  }

  .line-numbers {
    display: flex;
    flex-direction: column;
    padding: 16px 8px;
    background: #1a1a1a;
    border-right: 1px solid #333;
    user-select: none;
  }

  .line-num {
    color: #555;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 13px;
    line-height: 1.5;
    text-align: right;
    min-width: 24px;
  }

  textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: #9cdcfe;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 13px;
    line-height: 1.5;
    padding: 16px;
    resize: none;
    outline: none;
  }

  /* Testcase Section */
  .testcase-section {
    border-top: 1px solid #333;
    background: #1a1a1a;
  }

  .testcase-header {
    padding: 8px 16px;
    border-bottom: 1px solid #333;
  }

  .testcase-tabs {
    display: flex;
    gap: 4px;
  }

  .testcase-tab {
    padding: 8px 14px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    border-radius: 4px;
  }

  .testcase-tab.active {
    background: #2a2a2a;
    color: #fff;
  }

  .testcase-content {
    padding: 12px 16px;
  }

  .case-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .case-tab {
    padding: 6px 12px;
    background: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    color: #888;
    font-size: 12px;
    cursor: pointer;
  }

  .case-tab.active {
    background: #333;
    color: #fff;
  }

  .case-tab.add-case {
    background: transparent;
    border-style: dashed;
  }

  .case-input {
    background: #252525;
    border-radius: 6px;
    padding: 12px;
  }

  .input-label {
    color: #888;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .input-value {
    color: #9cdcfe;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 13px;
    background: #1e1e1e;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .testcase-footer {
    padding: 12px 16px;
    border-top: 1px solid #333;
    text-align: right;
  }

  .hint {
    color: #666;
    font-size: 12px;
    font-style: italic;
  }

  /* Actions */
  .actions {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: #252525;
    border-top: 1px solid #333;
  }

  .left-actions, .right-actions {
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    padding: 8px;
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
  }

  .source-btn {
    padding: 8px 12px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 12px;
    cursor: pointer;
  }

  .run-btn {
    padding: 8px 16px;
    background: #333;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
  }

  .run-btn:hover {
    background: #444;
  }

  .submit-btn {
    padding: 8px 16px;
    background: #2cbb5d;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .submit-btn:hover {
    background: #26a352;
  }

  .run-btn:disabled, .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Console */
  .console {
    border-top: 1px solid #333;
    max-height: 200px;
    overflow-y: auto;
  }

  .console-header {
    padding: 10px 16px;
    font-size: 13px;
    color: #888;
    border-bottom: 1px solid #333;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .status-badge {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-badge.success {
    background: rgba(0, 184, 163, 0.15);
    color: #00b8a3;
  }

  .status-badge.error {
    background: rgba(255, 55, 95, 0.15);
    color: #ff375f;
  }

  .console-content {
    padding: 12px;
  }

  .result {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    font-size: 12px;
    font-family: 'SF Mono', monospace;
  }

  .result.passed {
    background: rgba(0, 184, 163, 0.08);
    border-left: 3px solid #00b8a3;
  }

  .result.failed {
    background: rgba(255, 55, 95, 0.08);
    border-left: 3px solid #ff375f;
  }

  .result div {
    margin-bottom: 4px;
    color: #c9d1d9;
  }

  .result-label {
    color: #666;
    font-size: 10px;
    text-transform: uppercase;
    margin-right: 8px;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: #ffa116;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 1024px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
`;

