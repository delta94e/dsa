import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Vaadin imports
import '@vaadin/button';

/**
 * Lit Counter - An interactive web component with Vaadin buttons
 */
@customElement('lit-counter')
export class LitCounter extends LitElement {
  static styles = css`
        :host {
            display: block;
        }
        
        .counter {
            background: #1a1a2e;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
            color: white;
            width: fit-content;
        }
        
        h4 {
            margin: 0 0 16px 0;
            color: #f97316;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .display {
            font-size: 48px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .buttons {
            display: flex;
            gap: 8px;
        }
        
        vaadin-button {
            flex: 1;
        }

        vaadin-button[theme~="error"] {
            --lumo-primary-color: #ef4444;
        }

        vaadin-button[theme~="success"] {
            --lumo-primary-color: #22c55e;
        }
    `;

  @property({ type: Number, attribute: 'initial-value' }) initialValue = 0;
  @property({ type: Number }) step = 1;
  @state() private count = 0;

  connectedCallback() {
    super.connectedCallback();
    this.count = this.initialValue;
  }

  private increment() {
    this.count += this.step;
    this.dispatchEvent(new CustomEvent('count-changed', {
      detail: { count: this.count },
      bubbles: true,
      composed: true,
    }));
  }

  private decrement() {
    this.count -= this.step;
    this.dispatchEvent(new CustomEvent('count-changed', {
      detail: { count: this.count },
      bubbles: true,
      composed: true,
    }));
  }

  private reset() {
    this.count = this.initialValue;
    this.dispatchEvent(new CustomEvent('count-changed', {
      detail: { count: this.count },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
            <div class="counter">
                <h4>Lit Counter</h4>
                <div class="display">${this.count}</div>
                <div class="buttons">
                    <vaadin-button theme="primary error" @click=${this.decrement}>−</vaadin-button>
                    <vaadin-button theme="tertiary" @click=${this.reset}>Reset</vaadin-button>
                    <vaadin-button theme="primary success" @click=${this.increment}>+</vaadin-button>
                </div>
            </div>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-counter': LitCounter;
  }
}
