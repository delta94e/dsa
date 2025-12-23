import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Lit Counter - An interactive web component
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
    
    button {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: scale(1.05);
    }
    
    .decrement {
      background: #ef4444;
      color: white;
    }
    
    .reset {
      background: #374151;
      color: white;
    }
    
    .increment {
      background: #22c55e;
      color: white;
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
          <button class="decrement" @click=${this.decrement}>−</button>
          <button class="reset" @click=${this.reset}>Reset</button>
          <button class="increment" @click=${this.increment}>+</button>
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
