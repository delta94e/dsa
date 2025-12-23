/**
 * LeetCode App Shell Component
 * Main application shell with theme support and routing
 * @module components/app/lc-app
 */

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { appStyles } from './lc-app.styles.js';
import { ThemeService } from '../../services/index.js';
import { THEMES } from '../../constants/themes.js';
import { generateSnowflakes } from '../../utils/helpers.js';
import type { ThemeId, ViewState, Problem } from '../../types/index.js';

// Import child components
import '../problem-list/lc-problem-list.js';
import '../problem-detail/lc-problem-detail.js';

/**
 * Main application shell component
 * @element lc-app
 * @fires problem-select - When a problem is selected from the list
 */
@customElement('lc-app')
export class LcApp extends LitElement {
    static styles = appStyles;

    /** Current view state */
    @state() private currentView: ViewState = 'list';

    /** Currently selected problem */
    @state() private selectedProblem: Problem | null = null;

    /** Active theme ID */
    @state() private themeId: ThemeId = ThemeService.getCurrentTheme();

    /** Theme dropdown visibility */
    @state() private showThemeDropdown = false;

    /** Get current theme configuration */
    private get theme() {
        return ThemeService.getTheme(this.themeId);
    }

    /** Get event banner for current theme */
    private get eventBanner() {
        return ThemeService.getEventBanner(this.themeId);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('problem-select', this._handleProblemSelect as EventListener);
        this._setupClickOutside();
    }

    private _setupClickOutside() {
        document.addEventListener('click', (e) => {
            const path = e.composedPath();
            const isThemeSelector = path.some((el: any) =>
                el.classList?.contains('theme-selector')
            );
            if (!isThemeSelector) {
                this.showThemeDropdown = false;
            }
        });
    }

    private _handleProblemSelect = (e: CustomEvent<Problem>) => {
        this.selectedProblem = e.detail;
        this.currentView = 'detail';
    };

    private _goHome = (e: Event) => {
        e.preventDefault();
        this.currentView = 'list';
        this.selectedProblem = null;
    };

    private _setTheme = (id: ThemeId) => {
        this.themeId = id;
        this.showThemeDropdown = false;
        ThemeService.saveTheme(id);
    };

    private _toggleThemeDropdown = () => {
        this.showThemeDropdown = !this.showThemeDropdown;
    };

    private _renderSnowfall() {
        if (!this.theme.effects?.snowfall) return null;

        const snowflakes = generateSnowflakes(30);
        return html`
      <div class="snowfall">
        ${snowflakes.map(s => html`
          <div 
            class="snowflake" 
            style="left: ${s.left}%; animation-delay: ${s.delay}s; animation-duration: ${s.duration}s; font-size: ${s.size}px;"
          >❄</div>
        `)}
      </div>
    `;
    }

    private _renderEventBanner() {
        if (!this.eventBanner) return null;

        return html`
      <div class="event-banner">
        <div class="event-banner-icon">${this.theme.icon}</div>
        <div class="event-banner-text">
          <h3>${this.eventBanner.title}</h3>
          <p>${this.eventBanner.description}</p>
        </div>
      </div>
    `;
    }

    private _renderThemeSelector() {
        return html`
      <div class="theme-selector">
        <button class="theme-btn" @click=${this._toggleThemeDropdown}>
          <span>${this.theme.icon}</span>
          <span>Theme</span>
        </button>
        <div class="theme-dropdown ${this.showThemeDropdown ? 'open' : ''}">
          ${(Object.keys(THEMES) as ThemeId[]).map(id => html`
            <div 
              class="theme-option ${this.themeId === id ? 'active' : ''}"
              @click=${() => this._setTheme(id)}
            >
              <span>${THEMES[id].icon}</span>
              <span>${THEMES[id].name}</span>
            </div>
          `)}
        </div>
      </div>
    `;
    }

    render() {
        const cssVars = ThemeService.getCssVariables(this.themeId);
        const styleString = Object.entries(cssVars)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');

        return html`
      <div class="app" style="${styleString}">
        <div class="bg-gradient"></div>
        ${this._renderSnowfall()}

        <header>
          <div class="logo" @click=${this._goHome}>
            <div class="logo-icon">${this.theme.icon}</div>
            <span class="logo-text">LeetCode</span>
          </div>
          <nav>
            <a href="#" class="active" @click=${this._goHome}>Explore</a>
            <a href="#">Problems</a>
            <a href="#">Contest</a>
            <a href="#">Discuss</a>
          </nav>
          <div class="user-section">
            ${this._renderThemeSelector()}
            <div class="streak">🔥 5</div>
            <button class="premium-btn">⭐ Premium</button>
            <div class="avatar">👤</div>
          </div>
        </header>

        <main>
          ${this._renderEventBanner()}
          ${this.currentView === 'list'
                ? html`<lc-problem-list></lc-problem-list>`
                : html`<lc-problem-detail 
                .slug=${this.selectedProblem?.slug}
                @back=${this._goHome}
              ></lc-problem-detail>`
            }
        </main>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lc-app': LcApp;
    }
}
