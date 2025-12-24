/**
 * Problem List Component - Vaadin Version
 * Uses vaadin-grid for virtualized list, vaadin-text-field for search
 */

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ApiService } from '../../services/api.service';
import type { Problem, Topic, Category } from '../../types/problem.types';

// Vaadin imports
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column.js';
import '@vaadin/text-field';
import '@vaadin/tabs';
import '@vaadin/select';
import '@vaadin/button';
import '@vaadin/progress-bar';
import type { Grid, GridEventContext } from '@vaadin/grid';
import type { SelectChangeEvent } from '@vaadin/select';

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

@customElement('lc-problem-list')
export class LcProblemList extends LitElement {
  static styles = css`
        :host {
            display: block;
        }

        .container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* Topic Tags */
        .topic-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px 0;
        }

        .topic-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            cursor: pointer;
            transition: all 0.2s;
        }

        .topic-tag:hover {
            background: rgba(255, 161, 22, 0.15);
            border-color: rgba(255, 161, 22, 0.4);
        }

        .topic-tag.active {
            background: rgba(255, 161, 22, 0.2);
            border-color: #ffa116;
            color: #ffa116;
        }

        .topic-tag .count {
            font-size: 11px;
            opacity: 0.7;
        }

        /* Category Tabs */
        .category-tabs {
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
        }

        vaadin-tab {
            color: rgba(255, 255, 255, 0.7);
        }

        vaadin-tab[selected] {
            color: #ffa116;
        }

        /* Controls */
        .controls {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }

        .search-field {
            flex: 1;
            min-width: 200px;
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
        }

        .search-field::part(input-field) {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
        }

        .sort-select {
            min-width: 150px;
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
        }

        .stats {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }

        /* Grid Styling */
        vaadin-grid {
            --lumo-base-color: transparent;
            --lumo-body-text-color: white;
            --lumo-secondary-text-color: rgba(255, 255, 255, 0.8);
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
            --lumo-contrast-5pct: rgba(255, 255, 255, 0.05);
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            height: 600px;
            color: white;
        }

        vaadin-grid::part(cell) {
            color: white;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        vaadin-grid::part(body-cell) {
            color: white;
        }

        vaadin-grid::part(header-cell) {
            background: rgba(0, 0, 0, 0.4);
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            text-transform: uppercase;
        }

        vaadin-grid::part(row):hover {
            background: rgba(255, 161, 22, 0.15);
        }

        /* Status icons */
        .status-solved { color: #00b8a3; }
        .status-attempted { color: #ffc01e; }
        .status-todo { color: rgba(255, 255, 255, 0.3); }

        /* Difficulty badges */
        .difficulty {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        .difficulty.easy { background: rgba(0, 184, 163, 0.2); color: #00b8a3; }
        .difficulty.medium { background: rgba(255, 192, 30, 0.2); color: #ffc01e; }
        .difficulty.hard { background: rgba(255, 55, 95, 0.2); color: #ff375f; }

        .premium-icon { color: #ffa116; }

        /* Pagination */
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            padding: 16px 0;
        }

        vaadin-button[theme~="icon"] {
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
        }

        .page-info {
            padding: 0 16px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }

        /* Empty state */
        .empty {
            text-align: center;
            padding: 48px;
            color: rgba(255, 255, 255, 0.5);
        }
    `;

  @state() private problems: Problem[] = [];
  @state() private topics: Topic[] = [];
  @state() private loading = true;
  @state() private searchQuery = '';
  @state() private selectedCategory: Category | 'all' = 'all';
  @state() private selectedCategoryIndex = 0;
  @state() private selectedTopic = '';
  @state() private currentPage = 1;
  @state() private totalProblems = 0;
  @state() private itemsPerPage = 50;
  @state() private selectedSort = 'custom';

  private sortOptions = [
    { label: 'Custom', value: 'custom' },
    { label: 'Difficulty', value: 'difficulty' },
    { label: 'Acceptance', value: 'acceptance' },
    { label: 'Question ID', value: 'id' },
  ];

  override async connectedCallback() {
    super.connectedCallback();
    await Promise.all([this.fetchProblems(), this.fetchTopics()]);
  }

  override updated() {
    this._injectAllDarkStyles();
  }

  private _injectAllDarkStyles() {
    // Inject into Grid
    const grid = this.renderRoot.querySelector('vaadin-grid');
    if (grid?.shadowRoot && !grid.shadowRoot.querySelector('#dark-theme-styles')) {
      const style = document.createElement('style');
      style.id = 'dark-theme-styles';
      style.textContent = `
        :host {
          background: transparent !important;
          --lumo-base-color: transparent !important;
        }
        [part~="cell"] {
          background: transparent !important;
          color: white !important;
        }
        [part~="header-cell"] {
          background: rgba(0, 0, 0, 0.4) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.5px !important;
        }
        [part~="row"] {
          background: transparent !important;
        }
        [part~="row"]:hover {
          background: rgba(255, 161, 22, 0.12) !important;
        }
      `;
      grid.shadowRoot.appendChild(style);
    }

    // Inject into Select
    const selects = this.renderRoot.querySelectorAll('vaadin-select');
    selects.forEach(select => {
      if (select?.shadowRoot && !select.shadowRoot.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
          :host {
            --lumo-base-color: #1a1a2e !important;
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1) !important;
          }
          [part~="input-field"] {
            background: rgba(0, 0, 0, 0.4) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            color: white !important;
          }
          [part~="value"] {
            color: white !important;
          }
          [part~="toggle-button"] {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `;
        select.shadowRoot.appendChild(style);
      }
    });

    // Inject into TextField
    const textFields = this.renderRoot.querySelectorAll('vaadin-text-field');
    textFields.forEach(field => {
      if (field?.shadowRoot && !field.shadowRoot.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
          :host {
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1) !important;
          }
          [part~="input-field"] {
            background: rgba(0, 0, 0, 0.4) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
          }
          [part~="value"], input {
            color: white !important;
          }
          ::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
        `;
        field.shadowRoot.appendChild(style);
      }
    });

    // Inject into Tabs
    const tabs = this.renderRoot.querySelectorAll('vaadin-tabs');
    tabs.forEach(tabGroup => {
      if (tabGroup?.shadowRoot && !tabGroup.shadowRoot.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
          :host {
            --lumo-contrast-10pct: transparent !important;
            --lumo-primary-color: #ffa116 !important;
          }
          [part~="tabs"] {
            background: transparent !important;
          }
        `;
        tabGroup.shadowRoot.appendChild(style);
      }
    });

    // Inject into individual Tab items
    const tabItems = this.renderRoot.querySelectorAll('vaadin-tab');
    tabItems.forEach(tab => {
      if (tab?.shadowRoot && !tab.shadowRoot.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
          :host {
            color: rgba(255, 255, 255, 0.7) !important;
            background: transparent !important;
          }
          :host([selected]) {
            color: #ffa116 !important;
            background: transparent !important;
          }
          :host(:hover) {
            color: white !important;
          }
        `;
        tab.shadowRoot.appendChild(style);
      }
    });
  }

  private async fetchProblems() {
    this.loading = true;
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
      console.error('Failed to fetch problems:', error);
    } finally {
      this.loading = false;
    }
  }

  private async fetchTopics() {
    try {
      const response = await ApiService.getTopics();
      this.topics = response.topics || [];
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  }

  private handleSearch = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 1;
    this.fetchProblems();
  };

  private handleCategoryChange = (e: CustomEvent) => {
    this.selectedCategoryIndex = e.detail.value;
    this.selectedCategory = CATEGORIES[this.selectedCategoryIndex].id;
    this.currentPage = 1;
    this.fetchProblems();
  };

  private handleTopicClick = (slug: string) => {
    this.selectedTopic = this.selectedTopic === slug ? '' : slug;
    this.currentPage = 1;
    this.fetchProblems();
  };

  private handleSortChange = (e: SelectChangeEvent) => {
    this.selectedSort = e.target.value;
    this.fetchProblems();
  };

  private handleProblemClick = (problem: Problem) => {
    this.dispatchEvent(new CustomEvent('problem-select', {
      detail: problem,
      bubbles: true,
      composed: true
    }));
  };

  private handlePageChange = (page: number) => {
    const totalPages = Math.ceil(this.totalProblems / this.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.fetchProblems();
    }
  };

  private getStatusClass(problem: Problem): string {
    const id = problem.id || 0;
    if (id % 5 === 0) return 'status-solved';
    if (id % 3 === 0) return 'status-attempted';
    return 'status-todo';
  }

  private getStatusIcon(problem: Problem): string {
    const id = problem.id || 0;
    if (id % 5 === 0) return '✓';
    if (id % 3 === 0) return '◐';
    return '○';
  }

  private getSolvedCount(): number {
    return this.problems.filter(p => (p.id || 0) % 5 === 0).length;
  }

  private statusRenderer = (root: HTMLElement, _: HTMLElement, model: GridEventContext<Problem>) => {
    const problem = model.item;
    if (!problem) return;
    const statusClass = this.getStatusClass(problem);
    const statusIcon = this.getStatusIcon(problem);
    const colors: Record<string, string> = {
      'status-solved': '#00b8a3',
      'status-attempted': '#ffc01e',
      'status-todo': 'rgba(255,255,255,0.4)'
    };
    root.innerHTML = `<span style="color: ${colors[statusClass] || 'white'}; font-size: 16px;">${statusIcon}</span>`;
  };

  private titleRenderer = (root: HTMLElement, _: HTMLElement, model: GridEventContext<Problem>) => {
    const problem = model.item;
    if (!problem) return;
    root.innerHTML = `<span style="color: white; cursor: pointer;">${problem.title}</span>`;
  };

  private acceptanceRenderer = (root: HTMLElement, _: HTMLElement, model: GridEventContext<Problem>) => {
    const problem = model.item;
    if (!problem) return;
    root.innerHTML = `<span style="color: rgba(255,255,255,0.8);">${problem.acceptanceRate?.toFixed(1) || '0.0'}%</span>`;
  };

  private difficultyRenderer = (root: HTMLElement, _: HTMLElement, model: GridEventContext<Problem>) => {
    const problem = model.item;
    if (!problem) return;
    const diff = problem.difficulty.toLowerCase();
    const colors: Record<string, string> = {
      easy: '#00b8a3',
      medium: '#ffc01e',
      hard: '#ff375f'
    };
    const bgColors: Record<string, string> = {
      easy: 'rgba(0,184,163,0.2)',
      medium: 'rgba(255,192,30,0.2)',
      hard: 'rgba(255,55,95,0.2)'
    };
    root.innerHTML = `<span style="color: ${colors[diff]}; background: ${bgColors[diff]}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">${problem.difficulty}</span>`;
  };

  private handleGridClick = (e: Event) => {
    const grid = e.target as Grid<Problem>;
    const eventContext = grid.getEventContext(e);
    if (eventContext.item) {
      this.handleProblemClick(eventContext.item);
    }
  };

  override render() {
    const totalPages = Math.ceil(this.totalProblems / this.itemsPerPage);

    return html`
            <div class="container">
                <!-- Topic Tags -->
                <div class="topic-tags">
                    ${this.topics.slice(0, 8).map(topic => html`
                        <span 
                            class="topic-tag ${this.selectedTopic === topic.slug ? 'active' : ''}"
                            @click=${() => this.handleTopicClick(topic.slug)}
                        >
                            ${topic.name}
                            <span class="count">${topic.count || 0}</span>
                        </span>
                    `)}
                </div>

                <!-- Category Tabs -->
                <vaadin-tabs 
                    class="category-tabs"
                    .selected=${this.selectedCategoryIndex}
                    @selected-changed=${this.handleCategoryChange}
                >
                    ${CATEGORIES.map(cat => html`
                        <vaadin-tab>${cat.icon} ${cat.name}</vaadin-tab>
                    `)}
                </vaadin-tabs>

                <!-- Controls -->
                <div class="controls">
                    <vaadin-text-field
                        class="search-field"
                        placeholder="Search questions..."
                        clear-button-visible
                        .value=${this.searchQuery}
                        @input=${this.handleSearch}
                    >
                        <span slot="prefix">🔍</span>
                    </vaadin-text-field>

                    <vaadin-select
                        class="sort-select"
                        .items=${this.sortOptions}
                        .value=${this.selectedSort}
                        @change=${this.handleSortChange}
                    ></vaadin-select>

                    <div class="stats">
                        <span>⭘ ${this.getSolvedCount()}/${this.problems.length} Solved</span>
                    </div>
                </div>

                <!-- Problem Grid -->
                ${this.loading ? html`
                    <vaadin-progress-bar indeterminate></vaadin-progress-bar>
                ` : this.problems.length === 0 ? html`
                    <div class="empty">No problems found</div>
                ` : html`
                    <vaadin-grid 
                        .items=${this.problems}
                        @click=${this.handleGridClick}
                        theme="no-border row-stripes"
                    >
                        <vaadin-grid-column 
                            header="Status" 
                            width="80px" 
                            flex-grow="0"
                            .renderer=${this.statusRenderer}
                        ></vaadin-grid-column>
                        <vaadin-grid-column 
                            header="Title" 
                            .renderer=${this.titleRenderer}
                        ></vaadin-grid-column>
                        <vaadin-grid-column 
                            header="Acceptance" 
                            width="120px" 
                            flex-grow="0"
                            .renderer=${this.acceptanceRenderer}
                        ></vaadin-grid-column>
                        <vaadin-grid-column 
                            header="Difficulty" 
                            width="100px" 
                            flex-grow="0"
                            .renderer=${this.difficultyRenderer}
                        ></vaadin-grid-column>
                    </vaadin-grid>
                `}

                <!-- Pagination -->
                ${totalPages > 1 ? html`
                    <div class="pagination">
                        <vaadin-button 
                            theme="icon tertiary"
                            ?disabled=${this.currentPage === 1}
                            @click=${() => this.handlePageChange(this.currentPage - 1)}
                        >‹</vaadin-button>
                        
                        <span class="page-info">
                            Page ${this.currentPage} of ${totalPages}
                        </span>
                        
                        <vaadin-button 
                            theme="icon tertiary"
                            ?disabled=${this.currentPage === totalPages}
                            @click=${() => this.handlePageChange(this.currentPage + 1)}
                        >›</vaadin-button>
                    </div>
                ` : ''}
            </div>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lc-problem-list': LcProblemList;
  }
}
