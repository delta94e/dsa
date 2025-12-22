import { useConnectFour } from './hooks/useConnectFour';
import { Board } from './components/Board';
import './App.css';

function App() {
  const {
    state,
    droppingCell,
    makeMove,
    undo,
    restart,
    getDropRow,
  } = useConnectFour();

  const getStatusText = () => {
    if (state.gameStatus === 'won') {
      return `🎉 ${state.winner} Wins!`;
    }
    if (state.gameStatus === 'draw') {
      return "🤝 It's a Draw!";
    }
    return `${state.currentPlayer === 'RED' ? '🔴' : '🟡'} ${state.currentPlayer}'s Turn`;
  };

  return (
    <div className="connect-four">
      <header className="header">
        <h1>CONNECT FOUR</h1>
        <div className={`status ${state.currentPlayer.toLowerCase()}`}>
          {getStatusText()}
        </div>
      </header>

      <Board
        board={state.board}
        currentPlayer={state.currentPlayer}
        winningCells={state.winningCells}
        droppingCell={droppingCell}
        onColumnClick={makeMove}
        getDropRow={getDropRow}
        gameStatus={state.gameStatus}
      />

      <div className="controls">
        <button className="restart-btn" onClick={restart}>
          Restart
        </button>
        <button
          className="undo-btn"
          onClick={undo}
          disabled={state.moveHistory.length === 0}
        >
          Undo
        </button>
      </div>

      <div className="keyboard-hint">
        <p>Press <kbd>1</kbd>-<kbd>7</kbd> to drop • <kbd>R</kbd> restart • <kbd>U</kbd> undo</p>
      </div>
    </div>
  );
}

export default App;
