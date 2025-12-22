import { SlitherGame } from './SlitherGame';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const game = new SlitherGame(canvas);

    // Show name input
    const nameInput = document.getElementById('nameInput') as HTMLInputElement;
    const playButton = document.getElementById('playButton') as HTMLButtonElement;
    const startScreen = document.getElementById('startScreen') as HTMLElement;

    playButton.addEventListener('click', () => {
        const name = nameInput.value.trim() || 'Player';
        game.spawnPlayer(name);
        game.start();
        startScreen.style.display = 'none';
    });

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            playButton.click();
        }
    });

    // Expose for debugging
    (window as any).slitherGame = game;
});
