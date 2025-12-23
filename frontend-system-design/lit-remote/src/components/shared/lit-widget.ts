import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Lit Widget - A federated web component
 * Can be used in any framework: React, Vue, Angular, vanilla JS
 */
@customElement('lit-widget')
export class LitWidget extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
    
    .widget {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 24px;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    
    .widget:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
    }
    
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    h3 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    p {
      margin: 0 0 16px 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
    }
  `;

    @property({ type: String }) title = 'Hello from Lit!';
    @property({ type: String }) description = 'This is a Lit Web Component';

    render() {
        return html`
      <div class="widget">
        <div class="icon">🔥</div>
        <h3>${this.title}</h3>
        <p>${this.description}</p>
        <span class="badge">Lit Element</span>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-widget': LitWidget;
    }
}
