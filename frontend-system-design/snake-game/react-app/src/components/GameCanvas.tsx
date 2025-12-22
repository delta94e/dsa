import { useRef, useEffect, useCallback } from 'react';
import { GameState, GameConfig, DEFAULT_CONFIG, Direction } from '../types';

interface GameCanvasProps {
  state: GameState;
  config?: GameConfig;
  onSwipe?: (direction: Direction) => void;
}

export function GameCanvas({ 
  state, 
  config = DEFAULT_CONFIG,
  onSwipe 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // ═══════════════════════════════════════════════════════════
  // RENDERING
  // ═══════════════════════════════════════════════════════════

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cellSize, gridWidth, gridHeight } = config;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#252542';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(
      state.food.x * cellSize + cellSize / 2,
      state.food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    state.snake.forEach((segment, index) => {
      const brightness = 1 - (index / state.snake.length) * 0.5;
      ctx.fillStyle = `hsl(145, 63%, ${Math.floor(45 * brightness)}%)`;

      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;

      if (index === 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 4);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, size, size);
      }
    });

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, 10, 25);
    ctx.textAlign = 'right';
    ctx.fillText(`High: ${state.highScore}`, canvas.width - 10, 25);

    // Overlays
    if (state.status !== 'PLAYING') {
      // Darken background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = 'center';

      if (state.status === 'IDLE') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('🐍 SNAKE GAME', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = '16px Arial';
        ctx.fillText('Press any arrow key to start', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('WASD or Arrow keys to move', canvas.width / 2, canvas.height / 2 + 35);
      } else if (state.status === 'PAUSED') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('⏸️ PAUSED', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '16px Arial';
        ctx.fillText('Press SPACE to resume', canvas.width / 2, canvas.height / 2 + 20);
      } else if (state.status === 'GAME_OVER') {
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 5);
        
        if (state.score === state.highScore && state.score > 0) {
          ctx.fillStyle = '#ffd700';
          ctx.fillText('🏆 New High Score!', canvas.width / 2, canvas.height / 2 + 35);
        }
        
        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 65);
      }
    }
  }, [state, config]);

  // Render on state change
  useEffect(() => {
    render();
  }, [render]);

  // Render loop for smooth visuals during gameplay
  useEffect(() => {
    let animationId: number;

    const loop = () => {
      render();
      if (state.status === 'PLAYING') {
        animationId = requestAnimationFrame(loop);
      }
    };

    if (state.status === 'PLAYING') {
      loop();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.status, render]);

  // ═══════════════════════════════════════════════════════════
  // TOUCH HANDLING
  // ═══════════════════════════════════════════════════════════

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!onSwipe) return;

    const threshold = 30;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = endY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        onSwipe(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        onSwipe(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={config.gridWidth * config.cellSize}
      height={config.gridHeight * config.cellSize}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        border: '3px solid #4ecca3',
        borderRadius: '8px',
        boxShadow: '0 0 30px rgba(78, 204, 163, 0.2)',
      }}
    />
  );
}
