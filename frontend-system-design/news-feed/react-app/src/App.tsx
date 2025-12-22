/**
 * App Component
 */

import { FeedProvider } from './store/FeedContext';
import { Feed } from './components/Feed';
import './App.css';

function App() {
  return (
    <FeedProvider>
      <div className="app">
        <header className="app-header">
          <div className="app-header__content">
            <h1 className="app-header__logo">📰 News Feed</h1>
            <nav className="app-header__nav">
              <button className="app-header__nav-item app-header__nav-item--active">
                🏠 Home
              </button>
              <button className="app-header__nav-item">
                👥 Friends
              </button>
              <button className="app-header__nav-item">
                🔔 Notifications
              </button>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Feed />
        </main>
      </div>
    </FeedProvider>
  );
}

export default App;
