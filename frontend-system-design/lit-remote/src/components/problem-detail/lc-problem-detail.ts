/**
 * Problem Detail Component
 * Displays problem description with code editor and test runner
 * @module components/problem-detail/lc-problem-detail
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { problemDetailStyles } from './lc-problem-detail.styles.js';
import { ApiService, ApiError } from '../../services/index.js';
import type { Problem, TestResult, SubmissionStatus } from '../../types/index.js';

/** Supported programming languages */
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python 3' },
  { value: 'go', label: 'Go' },
] as const;

type LanguageId = typeof LANGUAGES[number]['value'];

/**
 * Problem detail view with code editor and test runner
 * @element lc-problem-detail
 * @fires back - When back button is clicked
 */
@customElement('lc-problem-detail')
export class LcProblemDetail extends LitElement {
  static styles = problemDetailStyles;

  /** Problem slug from URL */
  @property({ type: String }) slug = '';

  /** Problem data */
  @state() private problem: Problem | null = null;

  /** Current code in editor */
  @state() private code = '';

  /** Selected language */
  @state() private language: LanguageId = 'javascript';

  /** Loading state */
  @state() private loading = true;

  /** Code execution in progress */
  @state() private running = false;

  /** Test results */
  @state() private results: TestResult[] = [];

  /** Submission status */
  @state() private status: SubmissionStatus | string = '';

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

  /**
   * Fetch problem details from API
   */
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

  /**
   * Set starter code for current language
   */
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

  /**
   * Handle language selection change
   */
  private _onLanguageChange(e: Event) {
    this.language = (e.target as HTMLSelectElement).value as LanguageId;
    this._setStarterCode();
    this.results = [];
    this.status = '';
  }

  /**
   * Run code against example test cases
   */
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

  /**
   * Submit code for full evaluation
   */
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

  /**
   * Navigate back to problem list
   */
  private _goBack() {
    this.dispatchEvent(new CustomEvent('back', {
      bubbles: true,
      composed: true
    }));
  }

  private _renderLoading() {
    return html`
      <div class="loading">
        <div class="loading-spinner"></div>
        <div>Loading problem...</div>
      </div>
    `;
  }

  private _renderNotFound() {
    return html`<div class="loading">Problem not found</div>`;
  }

  private _renderDescription() {
    if (!this.problem) return null;

    return html`
      <div class="panel left-panel">
        <div class="panel-tabs">
          <button class="panel-tab active">📋 Description</button>
          <button class="panel-tab">📖 Editorial</button>
          <button class="panel-tab">💡 Solutions</button>
          <button class="panel-tab">📊 Submissions</button>
        </div>
        <div class="panel-content">
          <div class="problem-header">
            <h1>${this.problem.title}</h1>
            <span class="difficulty ${this.problem.difficulty}">
              ${this.problem.difficulty}
            </span>
          </div>
          
          <div class="topic-chips">
            ${this.problem.topics?.map(t => html`
              <span class="topic-chip">◇ ${t.name}</span>
            `) || ''}
            <span class="topic-chip">🏢 Companies</span>
            <span class="topic-chip">💡 Hint</span>
          </div>

          <div class="description">
            ${this.problem.description}
          </div>
          
          <div class="examples">
            ${this._renderExamples()}
          </div>
          
          <div class="constraints">
            <div class="section-title">Constraints:</div>
            <ul class="constraints-list">
              ${this.problem.constraints?.split('\n').map(c =>
      c.trim() ? html`<li>${c}</li>` : ''
    )}
            </ul>
          </div>
        </div>
        
        <div class="panel-footer">
          <span class="stat">👍 1.8K</span>
          <span class="stat">👎 191</span>
          <span class="stat">☆</span>
          <span class="stat">⬜</span>
        </div>
      </div>
    `;
  }

  private _renderExamples() {
    if (!this.problem?.examples) return '';

    const examples = this.problem.examples.split('Example').filter(e => e.trim());

    return examples.map((ex, i) => html`
      <div class="example">
        <div class="example-header">Example ${i + 1}:</div>
        <div class="example-visual">
          <!-- Visual placeholder for graphs/diagrams -->
        </div>
        <div class="example-content">
          <pre>${ex.trim()}</pre>
        </div>
      </div>
    `);
  }

  private _renderEditor() {
    return html`
      <div class="panel right-panel">
        <div class="editor-header">
          <div class="code-label">▸ Code</div>
          <div class="header-right">
            <select class="lang-select" .value=${this.language} @change=${this._onLanguageChange}>
              ${LANGUAGES.map(lang => html`
                <option value=${lang.value}>${lang.label}</option>
              `)}
            </select>
            <span class="auto-label">↻ Auto</span>
          </div>
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

        <div class="testcase-section">
          <div class="testcase-header">
            <div class="testcase-tabs">
              <button class="testcase-tab active">📋 Testcase</button>
              <button class="testcase-tab">📊 Test Result</button>
            </div>
          </div>
          <div class="testcase-content">
            <div class="case-tabs">
              ${this.problem?.testCases?.slice(0, 3).map((_, i) => html`
                <button class="case-tab ${i === 0 ? 'active' : ''}">Case ${i + 1}</button>
              `) || html`<button class="case-tab active">Case 1</button>`}
              <button class="case-tab add-case">+</button>
            </div>
            <div class="case-input">
              <div class="input-label">events =</div>
              <div class="input-value">${this.problem?.testCases?.[0]?.input || '[[1,3,2], [4,5,2], [2,4,3]]'}</div>
            </div>
          </div>
          <div class="testcase-footer">
            <span class="hint">You must run your code first</span>
          </div>
        </div>

        <div class="actions">
          <div class="left-actions">
            <button class="icon-btn">◐</button>
            <button class="source-btn">&lt;/&gt; Source ⚙</button>
          </div>
          <div class="right-actions">
            <button 
              class="run-btn" 
              @click=${this._runCode} 
              ?disabled=${this.running}
            >
              ${this.running ? '⏳' : '▶'} Run
            </button>
            <button 
              class="submit-btn" 
              @click=${this._submitCode} 
              ?disabled=${this.running}
            >
              ⬆ Submit
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _getLineNumbers() {
    const lines = this.code.split('\n').length || 7;
    return Array.from({ length: Math.max(lines, 7) }, (_, i) =>
      html`<span class="line-num">${i + 1}</span>`
    );
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
    if (this.loading) return this._renderLoading();
    if (!this.problem) return this._renderNotFound();

    return html`
      <div class="container">
        ${this._renderDescription()}
        ${this._renderEditor()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lc-problem-detail': LcProblemDetail;
  }
}
