import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { problemListStyles } from './lc-problem-list.styles';
import { ApiService } from '../../services/api.service';
import type { Problem, Topic, Category } from '../../types/problem.types';

/**
 * Category tab configuration
 */
interface CategoryTab {
  id: Category | 'all';
  name: string;
  icon: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'all', name: 'All Topics', icon: '📋' },
  { id: 'algorithms', name: 'Algorithms', icon: '🧩' },
  { id: 'database', name: 'Database', icon: '💾' },
  { id: 'shell', name: 'Shell', icon: '💲' },
  { id: 'concurrency', name: 'Concurrency', icon: '🔀' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
];

const ROW_HEIGHT = 48;
const VISIBLE_ROWS = 13;

/**
 * Problem List component with virtualized scrolling
 */
@customElement('lc-problem-list')
export class LcProblemList extends LitElement {
  static override styles = problemListStyles;

  @state() private problems: Problem[] = [];
  @state() private topics: Topic[] = [];
  @state() private loading = true;
  @state() private searchQuery = '';
  @state() private selectedCategory: Category | 'all' = 'all';
  @state() private selectedTopic = '';
  @state() private listScrollTop = 0;
  @state() private currentPage = 1;
  @state() private totalProblems = 0;
  @state() private itemsPerPage = 50;
  @state() private showSortDropdown = false;
  @state() private selectedSort = 'custom';

  private isFetching = false;
  private abortController: AbortController | null = null;

  private sortOptions = [
    { value: 'custom', label: 'Custom', premium: false },
    { value: 'frequency', label: 'Frequency', premium: true },
    { value: 'contest', label: 'Contest Point', premium: true },
    { value: 'difficulty', label: 'Difficulty', premium: false },
    { value: 'acceptance', label: 'Acceptance', premium: false },
    { value: 'id', label: 'Question ID', premium: false },
    { value: 'submitted', label: 'Last Submitted Time', premium: false },
  ];

  @state() private showFilterPanel = false;
  @state() private filterMatch: 'all' | 'any' = 'all';
  @state() private filters: { type: string; operator: string; value: string }[] = [
    { type: 'status', operator: 'is', value: '' },
    { type: 'difficulty', operator: 'is', value: '' },
  ];
  @state() private topicSearch = '';
  @state() private selectedFilterTopics: string[] = [];
  @state() private showTopicsPanel = false;

  private filterTypes = [
    { value: 'status', label: 'Status', icon: '☑' },
    { value: 'difficulty', label: 'Difficulty', icon: '◎' },
    { value: 'topics', label: 'Topics', icon: '◇' },
    { value: 'language', label: 'Language', icon: '</>' },
  ];

  private filterValues: Record<string, { value: string; label: string }[]> = {
    status: [
      { value: 'todo', label: 'Todo' },
      { value: 'attempted', label: 'Attempted' },
      { value: 'solved', label: 'Solved' },
    ],
    difficulty: [
      { value: 'Easy', label: 'Easy' },
      { value: 'Medium', label: 'Medium' },
      { value: 'Hard', label: 'Hard' },
    ],
    topics: [], // Populated from API
    language: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'python3', label: 'Python3' },
      { value: 'java', label: 'Java' },
      { value: 'cpp', label: 'C++' },
      { value: 'c', label: 'C' },
      { value: 'csharp', label: 'C#' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
      { value: 'kotlin', label: 'Kotlin' },
      { value: 'swift', label: 'Swift' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'scala', label: 'Scala' },
      { value: 'php', label: 'PHP' },
      { value: 'dart', label: 'Dart' },
      { value: 'racket', label: 'Racket' },
      { value: 'erlang', label: 'Erlang' },
      { value: 'elixir', label: 'Elixir' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mssql', label: 'MS SQL Server' },
      { value: 'oracle', label: 'Oracle' },
      { value: 'pandas', label: 'Pandas' },
      { value: 'postgresql', label: 'PostgreSQL' },
    ],
  };

  override async connectedCallback() {
    super.connectedCallback();
    await Promise.all([this.fetchProblems(), this.fetchTopics()]);
  }

  private async fetchProblems() {
    // Prevent duplicate requests
    if (this.isFetching) {
      this.abortController?.abort();
    }

    this.isFetching = true;
    this.loading = true;
    this.abortController = new AbortController();

    try {
      const result = await ApiService.getProblems({
        page: this.currentPage,
        limit: this.itemsPerPage,
        category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
        topic: this.selectedTopic || undefined,
        search: this.searchQuery || undefined,
      });
      this.problems = result.problems;
      this.totalProblems = result.total;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to fetch problems:', error);
      }
    } finally {
      this.loading = false;
      this.isFetching = false;
    }
  }

  private async fetchTopics() {
    try {
      const result = await ApiService.getTopics();
      this.topics = result.topics;
      // Populate filter values with topics from API
      this.filterValues = {
        ...this.filterValues,
        topics: result.topics.map((t) => ({ value: t.slug, label: t.name })),
      };
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  }

  private handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 1;
    this.fetchProblems();
  }

  private handleCategoryClick(categoryId: Category | 'all') {
    // Prevent clicking same category or while loading
    if (this.selectedCategory === categoryId || this.loading) return;
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.fetchProblems();
  }

  private handleTopicClick(slug: string) {
    // Prevent clicking while loading
    if (this.loading) return;
    this.selectedTopic = this.selectedTopic === slug ? '' : slug;
    this.currentPage = 1;
    this.fetchProblems();
  }

  private toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  private getSortLabel(): string {
    const option = this.sortOptions.find((o) => o.value === this.selectedSort);
    return option?.label || 'Custom';
  }

  private handleSortChange(value: string, isPremium: boolean) {
    if (isPremium) return; // Premium options not available
    this.selectedSort = value;
    this.showSortDropdown = false;
    // TODO: Implement sorting logic
  }

  private toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    this.showSortDropdown = false;
  }

  private addFilter() {
    this.filters = [...this.filters, { type: 'topics', operator: 'is', value: '' }];
  }

  private removeFilter(index: number) {
    this.filters = this.filters.filter((_, i) => i !== index);
  }

  private updateFilter(index: number, field: 'type' | 'operator' | 'value', value: string) {
    this.filters = this.filters.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
  }

  private resetFilters() {
    this.filters = [
      { type: 'status', operator: 'is', value: '' },
      { type: 'difficulty', operator: 'is', value: '' },
    ];
    this.filterMatch = 'all';
    this.selectedFilterTopics = [];
    this.showTopicsPanel = false;
  }

  private toggleTopicsPanel(_index: number) {
    this.showTopicsPanel = !this.showTopicsPanel;
  }

  private getFilteredTopics(): { value: string; label: string }[] {
    const topics = this.filterValues['topics'] || [];
    if (!this.topicSearch) return topics;
    const search = this.topicSearch.toLowerCase();
    return topics.filter((t) => t.label.toLowerCase().includes(search));
  }

  private toggleTopicSelection(value: string) {
    if (this.selectedFilterTopics.includes(value)) {
      this.selectedFilterTopics = this.selectedFilterTopics.filter((t) => t !== value);
    } else {
      this.selectedFilterTopics = [...this.selectedFilterTopics, value];
    }
  }

  private resetTopicSelection() {
    this.selectedFilterTopics = [];
    this.topicSearch = '';
  }

  private handleScroll(e: Event) {
    const container = e.target as HTMLElement;
    this.listScrollTop = container.scrollTop;
  }

  private handleProblemClick(problem: Problem) {
    this.dispatchEvent(
      new CustomEvent('problem-select', {
        detail: problem,
        bubbles: true,
        composed: true,
      })
    );
  }

  private handlePageChange(page: number) {
    this.currentPage = page;
    this.listScrollTop = 0;
    this.fetchProblems();
  }

  private renderLoading() {
    return html`
      <div class="skeleton-list">
        ${[1, 2, 3, 4, 5, 6, 7, 8].map(
      () => html`<div class="skeleton-bar"></div>`
    )}
      </div>
    `;
  }

  private renderTableHeader() {
    return html`
      <div class="table-header">
        <span class="header-status">Status</span>
        <span class="header-title">Title</span>
        <span class="header-acceptance">Acceptance</span>
        <span class="header-difficulty">Difficulty</span>
        <span class="header-icons"></span>
      </div>
    `;
  }

  private renderVirtualizedList() {
    const startIndex = Math.floor(this.listScrollTop / ROW_HEIGHT);
    const endIndex = Math.min(startIndex + VISIBLE_ROWS + 2, this.problems.length);
    const totalHeight = this.problems.length * ROW_HEIGHT;
    const offsetY = startIndex * ROW_HEIGHT;
    const visibleItems = this.problems.slice(startIndex, endIndex);

    return html`
      <div class="virtual-container" @scroll=${this.handleScroll}>
        <div class="virtual-content" style="height: ${totalHeight}px;">
          ${visibleItems.map(
      (problem, index) => html`
              <div
                class="problem-row ${startIndex + index === 0 ? 'featured' : ''}"
                style="top: ${offsetY + index * ROW_HEIGHT}px; height: ${ROW_HEIGHT}px;"
                @click=${() => this.handleProblemClick(problem)}
              >
                <span class="status-icon ${this.getStatusClass(problem)}"
                  >${this.getStatusIcon(problem)}</span
                >
                <span class="problem-title">
                  ${startIndex + index === 0 ? html`<span class="featured-icon">📅</span>` : ''}
                  ${problem.title}
                </span>
                <span class="acceptance">${problem.acceptanceRate?.toFixed(1) || '0.0'}%</span>
                <span class="difficulty ${problem.difficulty.toLowerCase()}"
                  >${this.getDifficultyShort(problem.difficulty)}</span
                >
                <span class="icons">
                  ${problem.isPremium ? html`<span title="Premium">🔒</span>` : ''}
                </span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }

  private getStatusClass(problem: Problem): string {
    const id = problem.id || 0;
    if (id % 5 === 0) return 'solved';
    if (id % 3 === 0) return 'attempted';
    return '';
  }

  private getStatusIcon(problem: Problem): string {
    const id = problem.id || 0;
    if (id % 5 === 0) return '✓';
    if (id % 3 === 0) return '◐';
    return '';
  }

  private getDifficultyShort(difficulty: string): string {
    const map: Record<string, string> = {
      Easy: 'Easy',
      Medium: 'Med.',
      Hard: 'Hard',
    };
    return map[difficulty] || difficulty;
  }

  private getSolvedCount(): number {
    return this.problems.filter((_, i) => (i + 1) % 5 === 0).length;
  }

  private renderPagination() {
    const totalPages = Math.ceil(this.totalProblems / this.itemsPerPage);
    if (totalPages <= 1) return '';

    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(i);
    }

    return html`
      <div class="pagination">
        <button
          class="page-btn"
          ?disabled=${this.currentPage === 1}
          @click=${() => this.handlePageChange(this.currentPage - 1)}
        >
          ‹
        </button>
        ${pages.map(
      (page) => html`
            <button
              class="page-btn ${page === this.currentPage ? 'active' : ''}"
              @click=${() => this.handlePageChange(page)}
            >
              ${page}
            </button>
          `
    )}
        ${totalPages > 5 ? html`<span class="page-info">...</span>` : ''}
        <button
          class="page-btn"
          ?disabled=${this.currentPage === totalPages}
          @click=${() => this.handlePageChange(this.currentPage + 1)}
        >
          ›
        </button>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="container">
        <!-- Topic Tags from API -->
        <div class="topic-tags">
          ${this.topics.slice(0, 8).map(
      (topic) => html`
              <span
                class="topic-tag ${this.selectedTopic === topic.slug ? 'active' : ''}"
                @click=${() => this.handleTopicClick(topic.slug)}
              >
                ${topic.name}
                <span class="count">${topic.count || 0}</span>
              </span>
            `
    )}
          ${this.topics.length > 8 ? html`<span class="expand-btn">Expand ▾</span>` : ''}
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          ${CATEGORIES.map(
      (cat) => html`
              <button
                class="category-tab ${this.selectedCategory === cat.id ? 'active' : ''}"
                @click=${() => this.handleCategoryClick(cat.id)}
              >
                <span class="icon">${cat.icon}</span>
                ${cat.name}
              </button>
            `
    )}
        </div>

        <!-- Controls -->
        <div class="controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search questions"
              .value=${this.searchQuery}
              @input=${this.handleSearch}
            />
          </div>
          <div class="sort-dropdown">
            <button class="sort-btn" @click=${this.toggleSortDropdown}>
              ↕ ${this.getSortLabel()}
            </button>
            ${this.showSortDropdown
        ? html`
                  <div class="sort-menu">
                    ${this.sortOptions.map(
          (opt) => html`
                        <div
                          class="sort-option ${this.selectedSort === opt.value ? 'active' : ''} ${opt.premium ? 'premium' : ''}"
                          @click=${() => this.handleSortChange(opt.value, opt.premium)}
                        >
                          <span>${opt.label}</span>
                          ${this.selectedSort === opt.value ? html`<span class="check">✓</span>` : ''}
                          ${opt.premium ? html`<span class="lock">🔒</span>` : ''}
                        </div>
                      `
        )}
                  </div>
                `
        : ''}
          </div>
          <div class="filter-dropdown">
            <button class="control-btn ${this.showFilterPanel ? 'active' : ''}" title="Filter" @click=${this.toggleFilterPanel}>▽</button>
            ${this.showFilterPanel
        ? html`
                  <div class="filter-panel">
                    <div class="filter-header">
                      <span>Match</span>
                      <select class="filter-select small" .value=${this.filterMatch} @change=${(e: Event) => (this.filterMatch = (e.target as HTMLSelectElement).value as 'all' | 'any')}>
                        <option value="all">All</option>
                        <option value="any">Any</option>
                      </select>
                      <span>of the following filters:</span>
                    </div>
                    <div class="filter-rows">
                      ${this.filters.map(
          (filter, index) => html`
                          <div class="filter-row">
                            <span class="filter-icon">${this.filterTypes.find((t) => t.value === filter.type)?.icon || '◇'}</span>
                            <select class="filter-select" .value=${filter.type} @change=${(e: Event) => this.updateFilter(index, 'type', (e.target as HTMLSelectElement).value)}>
                              ${this.filterTypes.map((t) => html`<option value=${t.value}>${t.label}</option>`)}
                            </select>
                            <select class="filter-select small">
                              <option value="is">is</option>
                              <option value="is_not">is not</option>
                            </select>
                            ${filter.type === 'topics'
              ? html`
                                  <button class="topics-trigger" @click=${() => this.toggleTopicsPanel(index)}>
                                    ${this.selectedFilterTopics.length > 0
                  ? `${this.selectedFilterTopics.length} selected`
                  : 'Select topics...'}
                                  </button>
                                `
              : html`
                                  <select class="filter-select" .value=${filter.value} @change=${(e: Event) => this.updateFilter(index, 'value', (e.target as HTMLSelectElement).value)}>
                                    <option value="">Select...</option>
                                    ${(this.filterValues[filter.type] || []).map((v) => html`<option value=${v.value}>${v.label}</option>`)}
                                  </select>
                                `}
                            <button class="remove-btn" @click=${() => this.removeFilter(index)}>−</button>
                          </div>
                          ${filter.type === 'topics' && this.showTopicsPanel
              ? html`
                                <div class="topics-panel">
                                  <div class="topics-search">
                                    <span>🔍</span>
                                    <input
                                      type="text"
                                      placeholder="search"
                                      .value=${this.topicSearch}
                                      @input=${(e: Event) => (this.topicSearch = (e.target as HTMLInputElement).value)}
                                    />
                                  </div>
                                  <div class="topics-chips">
                                    ${this.getFilteredTopics().map(
                (t) => html`
                                        <button
                                          class="topic-chip ${this.selectedFilterTopics.includes(t.value) ? 'selected' : ''}"
                                          @click=${() => this.toggleTopicSelection(t.value)}
                                        >
                                          ${t.label}
                                        </button>
                                      `
              )}
                                  </div>
                                  <div class="topics-footer">
                                    <button class="topics-reset" @click=${this.resetTopicSelection}>↺ Reset</button>
                                  </div>
                                </div>
                              `
              : ''}
                        `
        )}
                    </div>
                    <button class="add-filter-btn" @click=${this.addFilter}>+ Add filter</button>
                    <div class="filter-footer">
                      <button class="reset-btn" @click=${this.resetFilters}>↺ Reset</button>
                    </div>
                  </div>
                `
        : ''}
          </div>
          <div class="stats">
            <span>⭘ ${this.getSolvedCount()}/${this.problems.length} Solved</span>
            <span class="shuffle-btn" title="Random">⚄</span>
          </div>
        </div>

        <!-- Problem List -->
        ${this.loading
        ? this.renderLoading()
        : this.problems.length === 0
          ? html`<div class="empty">No problems found</div>`
          : html`${this.renderTableHeader()}${this.renderVirtualizedList()}`}

        <!-- Pagination -->
        ${this.renderPagination()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lc-problem-list': LcProblemList;
  }
}
