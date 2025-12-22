import { SnakeGame } from './SnakeGame';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const game = new SnakeGame(canvas, {
        gridWidth: 20,
        gridHeight: 20,
        cellSize: 20,
        initialSpeed: 150,
        speedIncrement: 5,
        minSpeed: 50,
    });

    // Expose game to window for debugging
    (window as any).snakeGame = game;
});
