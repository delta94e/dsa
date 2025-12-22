import { WordleGame } from './WordleGame';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    if (!container) {
        console.error('App container not found');
        return;
    }

    const game = new WordleGame(container);

    // Expose for debugging
    (window as any).wordleGame = game;
});
