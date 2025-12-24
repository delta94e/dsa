/**
 * LeetCode App Shell Component
 * Main application shell with theme support and routing
 * @module components/app/lc-app
 * 
 * Migrated to Vaadin Web Components
 */

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ThemeService } from '../../services/index.js';
import { THEMES } from '../../constants/themes.js';
import { generateSnowflakes } from '../../utils/helpers.js';
import type { ThemeId, ViewState, Problem } from '../../types/index.js';

// Vaadin imports
import '@vaadin/tabs';
import '@vaadin/button';
import '@vaadin/select';
import '@vaadin/tooltip';
import type { Select } from '@vaadin/select';

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
  static styles = css`
        :host {
            display: block;
            --lumo-primary-color: var(--theme-primary, #ffa116);
            --lumo-primary-text-color: var(--theme-primary, #ffa116);
        }

        .app {
            min-height: 100vh;
            background: var(--theme-background, #1a1a2e);
            color: var(--theme-text, #fff);
            position: relative;
            overflow: hidden;
        }

        .bg-gradient {
            position: fixed;
            inset: 0;
            background: var(--theme-gradient, linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%));
            z-index: 0;
        }

        header {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            height: 56px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-weight: 600;
            font-size: 20px;
        }

        .logo-icon {
            font-size: 28px;
        }

        .nav-tabs {
            --lumo-base-color: transparent;
        }

        vaadin-tabs {
            --lumo-contrast-10pct: transparent;
        }

        vaadin-tab {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }

        vaadin-tab[selected] {
            color: var(--theme-primary, #ffa116);
        }

        .user-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .streak {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            background: rgba(255, 161, 22, 0.15);
            border-radius: 20px;
            font-size: 14px;
            color: #ffa116;
        }

        vaadin-button[theme~="primary"] {
            --lumo-primary-color: var(--theme-primary, #ffa116);
        }

        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--theme-primary, #ffa116);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
        }

        main {
            position: relative;
            z-index: 1;
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .event-banner {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 24px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, rgba(255, 161, 22, 0.15) 0%, rgba(255, 107, 107, 0.15) 100%);
            border-radius: 12px;
            border: 1px solid rgba(255, 161, 22, 0.3);
        }

        .event-banner-icon {
            font-size: 32px;
        }

        .event-banner-text h3 {
            margin: 0 0 4px;
            font-size: 16px;
            color: var(--theme-primary, #ffa116);
        }

        .event-banner-text p {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
        }

        /* Snowfall effect */
        .snowfall {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 100;
            overflow: hidden;
        }

        .snowflake {
            position: absolute;
            top: -20px;
            color: rgba(255, 255, 255, 0.8);
            animation: snow-fall linear infinite;
        }

        @keyframes snow-fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }

        /* Theme select styling */
        .theme-select {
            --lumo-base-color: rgba(0, 0, 0, 0.3);
            --lumo-contrast-10pct: rgba(255, 255, 255, 0.1);
            min-width: 140px;
        }

        .theme-select::part(input-field) {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
        }
    `;

  /** Current view state */
  @state() private currentView: ViewState = 'list';

  /** Currently selected problem */
  @state() private selectedProblem: Problem | null = null;

  /** Active theme ID */
  @state() private themeId: ThemeId = ThemeService.getCurrentTheme();

  /** Selected nav tab */
  @state() private selectedTab = 0;

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
  }

  override updated() {
    this._injectDarkStyles();
  }

  private _injectDarkStyles() {
    // Inject into Tabs
    const tabs = this.renderRoot.querySelector('vaadin-tabs');
    if (tabs?.shadowRoot && !tabs.shadowRoot.querySelector('#dark-theme-styles')) {
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
      tabs.shadowRoot.appendChild(style);
    }

    // Inject into Tab items
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

    // Inject into Buttons
    const buttons = this.renderRoot.querySelectorAll('vaadin-button');
    buttons.forEach(btn => {
      if (btn?.shadowRoot && !btn.shadowRoot.querySelector('#dark-theme-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-theme-styles';
        style.textContent = `
          :host {
            --lumo-contrast-5pct: rgba(255, 255, 255, 0.1) !important;
          }
          :host([theme~="primary"]) {
            --lumo-primary-color: #ffa116 !important;
          }
          [part~="label"] {
            color: inherit !important;
          }
        `;
        btn.shadowRoot.appendChild(style);
      }
    });
  }

  private _handleProblemSelect = (e: CustomEvent<Problem>) => {
    this.selectedProblem = e.detail;
    this.currentView = 'detail';
  };

  private _goHome = () => {
    this.currentView = 'list';
    this.selectedProblem = null;
    this.selectedTab = 0;
  };

  private _handleThemeChange = (e: Event) => {
    const select = e.target as Select;
    const themeId = select.value as ThemeId;
    if (themeId) {
      this.themeId = themeId;
      ThemeService.saveTheme(themeId);
    }
  };

  private _handleTabChange = (e: CustomEvent) => {
    this.selectedTab = e.detail.value;
    if (this.selectedTab === 0) {
      this._goHome();
    }
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
    const themeItems = (Object.keys(THEMES) as ThemeId[]).map(id => ({
      label: `${THEMES[id].icon} ${THEMES[id].name}`,
      value: id
    }));

    return html`
            <vaadin-select
                class="theme-select"
                .items=${themeItems}
                .value=${this.themeId}
                @change=${this._handleThemeChange}
            ></vaadin-select>
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
                        <span>LeetCode</span>
                    </div>

                    <vaadin-tabs 
                        class="nav-tabs" 
                        .selected=${this.selectedTab}
                        @selected-changed=${this._handleTabChange}
                    >
                        <vaadin-tab>Explore</vaadin-tab>
                        <vaadin-tab>Problems</vaadin-tab>
                        <vaadin-tab>Contest</vaadin-tab>
                        <vaadin-tab>Discuss</vaadin-tab>
                    </vaadin-tabs>

                    <div class="user-section">
                        ${this._renderThemeSelector()}
                        <div class="streak">🔥 5</div>
                        <vaadin-button theme="primary small">
                            ⭐ Premium
                        </vaadin-button>
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
