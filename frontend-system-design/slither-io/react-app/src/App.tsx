import { useState, useEffect, useRef } from 'react';
import { useMultiplayerGame } from './hooks/useMultiplayerGame';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    isConnected,
    isPlaying,
    isDead,
    playerColor,
    connect,
    joinGame,
    respawn,
    setCanvas,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  } = useMultiplayerGame();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current);
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [setCanvas]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  const handlePlay = () => {
    joinGame(name.trim() || 'Player');
  };

  const handleRespawn = () => {
    respawn(name.trim() || 'Player');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePlay();
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />

      {/* Start Screen */}
      {!isPlaying && !isDead && (
        <div className="start-screen">
          <div className="start-content">
            <h1>🐍 Slither.io</h1>
            <p>Eat orbs to grow. Avoid other snakes!</p>
            
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Connected to server' : '🔴 Connecting...'}
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              maxLength={15}
              disabled={!isConnected}
            />
            <button onClick={handlePlay} disabled={!isConnected}>
              {isConnected ? 'Play' : 'Connecting...'}
            </button>
            <div className="controls">
              <p>🖱️ Move mouse to steer</p>
              <p>🔥 Hold click or Space to boost</p>
            </div>
          </div>
        </div>
      )}

      {/* Death Screen */}
      {isDead && (
        <div className="death-screen">
          <div className="death-content">
            <h2>💀 You Died!</h2>
            <p>Better luck next time!</p>
            <button onClick={handleRespawn}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
