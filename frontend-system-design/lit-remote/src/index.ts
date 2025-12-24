/**
 * LeetCode Clone - Entry Point
 * @module lit-remote
 * 
 * A LeetCode-like coding platform built with Lit Web Components
 * and Go backend for code execution.
 */

// Import Vaadin Lumo theme (MUST be first!)
import '@vaadin/vaadin-lumo-styles/all-imports.js';

// Apply dark theme to document
document.documentElement.setAttribute('theme', 'dark');

// Register all components
import './components/app/lc-app.js';
import './components/problem-list/lc-problem-list.js';
import './components/problem-detail/lc-problem-detail.js';
import './components/shared/lit-widget.js';
import './components/shared/lit-counter.js';

// Export components for external use
export * from './components/index.js';

// Export types
export * from './types/index.js';

// Export services
export * from './services/index.js';

console.log('🧩 LeetCode Clone loaded!');

