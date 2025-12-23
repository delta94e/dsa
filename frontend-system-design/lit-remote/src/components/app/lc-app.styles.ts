/**
 * App Shell Styles
 * @module components/app/styles
 */

import { css } from 'lit';

export const appStyles = css`
  :host {
    display: block;
    min-height: 100vh;
    color: #eff2f6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    transition: background 0.5s ease;
  }

  /* Animated background gradient */
  .bg-gradient {
    position: fixed;
    inset: 0;
    background: var(--bg-gradient);
    pointer-events: none;
    z-index: 0;
    transition: background 0.5s ease;
  }

  /* Snowfall effect */
  .snowfall {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .snowflake {
    position: absolute;
    top: -20px;
    color: white;
    animation: fall linear infinite;
    opacity: 0.8;
  }

  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
    }
  }

  /* Header */
  header {
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.02);
  }

  .logo:hover .logo-icon {
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5);
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    transition: all 0.3s ease;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Navigation */
  nav {
    display: flex;
    gap: 4px;
  }

  nav a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 18px;
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  nav a:hover {
    color: white;
    background: rgba(255, 255, 255, 0.04);
  }

  nav a.active {
    color: var(--primary);
  }

  /* User section */
  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .theme-selector {
    position: relative;
  }

  .theme-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 14px;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .theme-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
  }

  .theme-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: rgba(20, 20, 30, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px;
    min-width: 180px;
    display: none;
    z-index: 200;
  }

  .theme-dropdown.open {
    display: block;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }

  .theme-option:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .theme-option.active {
    background: rgba(var(--primary-rgb), 0.2);
    color: var(--primary);
  }

  .streak {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: rgba(var(--primary-rgb), 0.1);
    border-radius: 20px;
    font-size: 13px;
    color: var(--primary);
  }

  .premium-btn {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: #000;
    font-weight: 600;
    font-size: 13px;
    padding: 10px 20px;
    border-radius: 24px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .premium-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.5);
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  /* Main content */
  main {
    position: relative;
    z-index: 1;
    padding: 32px 40px;
    max-width: 1440px;
    margin: 0 auto;
  }

  /* Event Banner */
  .event-banner {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--secondary-rgb), 0.1) 100%);
    border: 1px solid rgba(var(--primary-rgb), 0.3);
    border-radius: 16px;
    padding: 16px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }

  .event-banner-icon {
    font-size: 32px;
  }

  .event-banner-text h3 {
    margin: 0 0 4px;
    font-size: 16px;
    color: white;
  }

  .event-banner-text p {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 1024px) {
    header { padding: 0 20px; }
    main { padding: 20px; }
    nav { display: none; }
  }
`;
