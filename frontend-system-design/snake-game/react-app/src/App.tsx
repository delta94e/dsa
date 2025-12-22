import { useSnakeGame } from './hooks/useSnakeGame';
import { GameCanvas } from './components/GameCanvas';
import { DEFAULT_CONFIG } from './types';
import './App.css';

function App() {
  const { state, start, setDirection } = useSnakeGame(DEFAULT_CONFIG);

  const handleSwipe = (direction: typeof state.direction) => {
    setDirection(direction);
    if (state.status === 'IDLE') {
      start();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🐍 Snake Game</h1>
        
        <GameCanvas 
          state={state} 
          config={DEFAULT_CONFIG}
          onSwipe={handleSwipe}
        />

        <div className="controls">
          <p>
            <kbd>↑</kbd> <kbd>←</kbd> <kbd>↓</kbd> <kbd>→</kbd> or{' '}
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move
          </p>
          <p>
            <kbd>SPACE</kbd> to pause | <kbd>R</kbd> to restart
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
