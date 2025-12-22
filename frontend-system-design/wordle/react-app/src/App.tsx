import { useWordle } from './hooks/useWordle';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import './App.css';

function App() {
  const {
    state,
    keyboardState,
    toast,
    shakeRow,
    bounceRow,
    flipTiles,
    handleKeyPress,
  } = useWordle();

  return (
    <div className="wordle-app">
      <header className="header">
        <h1>WORDLE</h1>
      </header>

      <Board
        guesses={state.guesses}
        currentGuess={state.currentGuess}
        evaluations={state.evaluations}
        currentRow={state.currentRow}
        shakeRow={shakeRow}
        bounceRow={bounceRow}
        flipTiles={flipTiles}
      />

      <Keyboard
        keyboardState={keyboardState}
        onKeyPress={handleKeyPress}
      />

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}
    </div>
  );
}

export default App;
