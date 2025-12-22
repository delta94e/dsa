import { ConnectFourGame } from './ConnectFourGame';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    if (!container) {
        console.error('App container not found');
        return;
    }

    const game = new ConnectFourGame(container);

    // Expose for debugging
    (window as any).connectFourGame = game;
});
