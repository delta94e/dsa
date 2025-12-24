/**
 * Problem Detail Component - Vaadin Version
 * Displays problem description with code editor and test runner
 * @module components/problem-detail/lc-problem-detail
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ApiService, ApiError } from '../../services/index.js';
import type { Problem, TestResult, SubmissionStatus } from '../../types/index.js';

// Vaadin imports
import '@vaadin/select';
import '@vaadin/button';
import '@vaadin/tabs';
import '@vaadin/progress-bar';
import type { SelectChangeEvent } from '@vaadin/select';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python 3' },
  { value: 'go', label: 'Go' },
];

type LanguageId = 'javascript' | 'python' | 'go';

@customElement('lc-problem-detail')
export class LcProblemDetail extends LitElement {
  static styles = css`
        :host {
            display: block;
        }

        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            height: calc(100vh - 150px);
            min-height: 600px;
        }

        .panel {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Header */
        .panel-header {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .back-btn {
            --lumo-primary-color: rgba(255, 255, 255, 0.7);
        }

        vaadin-tabs {
            --lumo-contrast-10pct: transparent;
        }

        vaadin-tab {
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
        }

        vaadin-tab[selected] {
            color: #ffa116;
        }

        /* Problem Info */
        .problem-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .problem-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #fff;
        }

        .problem-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 13px;
        }

        .difficulty {
            padding: 2px 10px;
            border-radius: 12px;
            font-weight: 500;
        }
        .difficulty.easy { background: rgba(0, 184, 163, 0.2); color: #00b8a3; }
        .difficulty.medium { background: rgba(255, 192, 30, 0.2); color: #ffc01e; }
        .difficulty.hard { background: rgba(255, 55, 95, 0.2); color: #ff375f; }

        .meta-item {
            color: rgba(255, 255, 255, 0.6);
        }

        .description {
            line-height: 1.7;
            color: rgba(255, 255, 255, 0.9);
        }

        .example {
            margin: 16px 0;
            padding: 12px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border-left: 3px solid #ffa116;
        }

        .example-header {
            font-weight: 600;
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.8);
        }

        .example pre {
            margin: 0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            color: rgba(255, 255, 255, 0.9);
        }

        /* Editor Panel */
        .editor-header {
            padding: 8px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-label {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }

        .lang-select {
            min-width: 140px;
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
        }

        .code-area {
            flex: 1;
            display: flex;
            overflow: hidden;
        }

        .line-numbers {
            padding: 12px 8px;
            background: rgba(0, 0, 0, 0.3);
            color: rgba(255, 255, 255, 0.3);
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            text-align: right;
            user-select: none;
            line-height: 1.5;
        }

        .code-area textarea {
            flex: 1;
            padding: 12px;
            background: transparent;
            border: none;
            color: #e2e8f0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: none;
            outline: none;
        }

        .code-area textarea::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        /* Actions */
        .actions {
            padding: 12px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        vaadin-button[theme~="primary"] {
            --lumo-primary-color: #00b8a3;
        }

        vaadin-button[theme~="success"] {
            --lumo-primary-color: #00b8a3;
        }

        /* Console */
        .console {
            margin-top: 12px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 8px;
            overflow: hidden;
        }

        .console-header {
            padding: 8px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.3);
            font-size: 13px;
        }

        .status-badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .status-badge.success { background: rgba(0, 184, 163, 0.2); color: #00b8a3; }
        .status-badge.error { background: rgba(255, 55, 95, 0.2); color: #ff375f; }

        .console-content {
            padding: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        .result {
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
        }
        .result.passed { background: rgba(0, 184, 163, 0.1); }
        .result.failed { background: rgba(255, 55, 95, 0.1); }

        .result-label {
            color: rgba(255, 255, 255, 0.5);
            margin-right: 8px;
        }

        /* Loading */
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            gap: 16px;
            color: rgba(255, 255, 255, 0.6);
        }
    `;

  @property({ type: String }) slug = '';
  @state() private problem: Problem | null = null;
  @state() private code = '';
  @state() private language: LanguageId = 'javascript';
  @state() private loading = true;
  @state() private running = false;
  @state() private results: TestResult[] = [];
  @state() private status: SubmissionStatus | string = '';
  @state() private selectedTab = 0;

  async connectedCallback() {
    super.connectedCallback();
    if (this.slug) {
      await this._fetchProblem();
    }
  }

  async updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('slug') && this.slug) {
      await this._fetchProblem();
    }
  }

  private async _fetchProblem() {
    this.loading = true;
    this.results = [];
    this.status = '';

    try {
      this.problem = await ApiService.getProblem(this.slug);
      this._setStarterCode();
    } catch (err) {
      console.error('Failed to fetch problem:', err);
      this.problem = null;
    } finally {
      this.loading = false;
    }
  }

  private _setStarterCode() {
    if (!this.problem?.starterCode) {
      this.code = '';
      return;
    }

    try {
      const codeMap = JSON.parse(this.problem.starterCode);
      this.code = codeMap[this.language] || '';
    } catch {
      this.code = '';
    }
  }

  private _handleLanguageChange = (e: SelectChangeEvent) => {
    this.language = e.target.value as LanguageId;
    this._setStarterCode();
    this.results = [];
    this.status = '';
  };

  private async _runCode() {
    if (!this.problem) return;

    this.running = true;
    this.results = [];
    this.status = 'Running...';

    try {
      const response = await ApiService.runCode({
        problemId: this.problem.id,
        language: this.language,
        code: this.code,
      });

      this.results = response.results;
      this.status = response.status;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unknown error';
      this.status = `Error: ${message}`;
    } finally {
      this.running = false;
    }
  }

  private async _submitCode() {
    if (!this.problem) return;

    this.running = true;
    this.results = [];
    this.status = 'Judging...';

    try {
      const response = await ApiService.submitCode({
        problemId: this.problem.id,
        language: this.language,
        code: this.code,
      });

      this.results = response.results;
      this.status = `${response.status} (${response.passed}/${response.total})`;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unknown error';
      this.status = `Error: ${message}`;
    } finally {
      this.running = false;
    }
  }

  private _goBack = () => {
    this.dispatchEvent(new CustomEvent('back', {
      bubbles: true,
      composed: true
    }));
  };

  private _getLineNumbers() {
    const lines = this.code.split('\n').length || 7;
    return Array.from({ length: Math.max(lines, 7) }, (_, i) =>
      html`<div>${i + 1}</div>`
    );
  }

  private _renderExamples() {
    if (!this.problem?.content) return null;

    const matches = this.problem.content.match(/Example \d+:[\s\S]*?(?=Example \d+:|Constraints:|$)/g);
    if (!matches) return null;

    return matches.slice(0, 3).map((ex, i) => html`
            <div class="example">
                <div class="example-header">Example ${i + 1}</div>
                <pre>${ex.replace(/Example \d+:\s*/, '').trim()}</pre>
            </div>
        `);
  }

  private _renderConsole() {
    if (this.results.length === 0 && !this.status) return null;

    const isAccepted = this.status.includes('Accepted');

    return html`
            <div class="console">
                <div class="console-header">
                    <span>Console</span>
                    ${this.status ? html`
                        <span class="status-badge ${isAccepted ? 'success' : 'error'}">
                            ${this.status}
                        </span>
                    ` : ''}
                </div>
                <div class="console-content">
                    ${this.results.map(r => html`
                        <div class="result ${r.passed ? 'passed' : 'failed'}">
                            <div><span class="result-label">Input:</span>${r.input}</div>
                            <div><span class="result-label">Expected:</span>${r.expected}</div>
                            <div><span class="result-label">Output:</span>${r.actual}</div>
                            <div>${r.passed ? '✅ Passed' : '❌ Failed'} · ${r.runtime}ms</div>
                        </div>
                    `)}
                </div>
            </div>
        `;
  }

  render() {
    if (this.loading) {
      return html`
                <div class="loading">
                    <vaadin-progress-bar indeterminate></vaadin-progress-bar>
                    <div>Loading problem...</div>
                </div>
            `;
    }

    if (!this.problem) {
      return html`<div class="loading">Problem not found</div>`;
    }

    return html`
            <div class="container">
                <!-- Left Panel: Description -->
                <div class="panel">
                    <div class="panel-header">
                        <vaadin-button theme="tertiary small" class="back-btn" @click=${this._goBack}>
                            ← Back
                        </vaadin-button>
                        <vaadin-tabs .selected=${this.selectedTab} @selected-changed=${(e: CustomEvent) => this.selectedTab = e.detail.value}>
                            <vaadin-tab>📋 Description</vaadin-tab>
                            <vaadin-tab>📖 Editorial</vaadin-tab>
                            <vaadin-tab>💡 Solutions</vaadin-tab>
                        </vaadin-tabs>
                    </div>
                    <div class="problem-content">
                        <div class="problem-title">${this.problem.title}</div>
                        <div class="problem-meta">
                            <span class="difficulty ${this.problem.difficulty.toLowerCase()}">${this.problem.difficulty}</span>
                            <span class="meta-item">👍 ${this.problem.likes || 0}</span>
                            <span class="meta-item">👎 ${this.problem.dislikes || 0}</span>
                        </div>
                        <div class="description">
                            ${this.problem.content || 'No description available.'}
                        </div>
                        ${this._renderExamples()}
                    </div>
                </div>

                <!-- Right Panel: Editor -->
                <div class="panel">
                    <div class="editor-header">
                        <span class="code-label">▸ Code</span>
                        <vaadin-select
                            class="lang-select"
                            .items=${LANGUAGES}
                            .value=${this.language}
                            @change=${this._handleLanguageChange}
                        ></vaadin-select>
                    </div>
                    <div class="code-area">
                        <div class="line-numbers">
                            ${this._getLineNumbers()}
                        </div>
                        <textarea 
                            .value=${this.code}
                            @input=${(e: InputEvent) => this.code = (e.target as HTMLTextAreaElement).value}
                            spellcheck="false"
                            placeholder="Write your solution here..."
                        ></textarea>
                    </div>
                    ${this._renderConsole()}
                    <div class="actions">
                        <vaadin-button 
                            theme="tertiary" 
                            @click=${this._runCode}
                            ?disabled=${this.running}
                        >
                            ${this.running ? '⏳' : '▶'} Run
                        </vaadin-button>
                        <vaadin-button 
                            theme="primary"
                            @click=${this._submitCode}
                            ?disabled=${this.running}
                        >
                            ⬆ Submit
                        </vaadin-button>
                    </div>
                </div>
            </div>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lc-problem-detail': LcProblemDetail;
  }
}
