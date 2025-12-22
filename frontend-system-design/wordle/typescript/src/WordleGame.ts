import {
    TileState,
    GameStatus,
    KeyState,
    GameState,
    Statistics,
    WORD_LENGTH,
    MAX_ATTEMPTS,
    KEYBOARD_ROWS,
    STATE_PRIORITY,
    ANSWER_WORDS,
    VALID_WORDS,
} from './types';

// ═══════════════════════════════════════════════════════════════
// WORDLE GAME ENGINE
// ═══════════════════════════════════════════════════════════════

export class WordleGame {
    private state: GameState;
    private keyboardState: Map<string, KeyState> = new Map();
    private statistics: Statistics;
    private container: HTMLElement;

    private readonly STORAGE_KEY = 'wordle-state';
    private readonly STATS_KEY = 'wordle-stats';

    constructor(container: HTMLElement) {
        this.container = container;
        this.statistics = this.loadStatistics();
        this.initKeyboard();

        const saved = this.loadGame();
        if (saved && this.isSameDay(saved.lastPlayed)) {
            this.state = saved.state;
            this.keyboardState = new Map(Object.entries(saved.keyboard));
        } else {
            this.state = this.createNewGame();
        }

        this.render();
        this.setupInputHandlers();
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    private createNewGame(): GameState {
        return {
            targetWord: this.getDailyWord(),
            guesses: [],
            currentGuess: '',
            evaluations: [],
            gameStatus: 'playing',
            currentRow: 0,
        };
    }

    private initKeyboard(): void {
        KEYBOARD_ROWS.flat().forEach(key => {
            if (key !== 'ENTER' && key !== 'BACKSPACE') {
                this.keyboardState.set(key, 'unused');
            }
        });
    }

    private getDailyWord(): string {
        const today = new Date();
        const startDate = new Date('2024-01-01');
        const daysDiff = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return ANSWER_WORDS[daysDiff % ANSWER_WORDS.length];
    }

    // ═══════════════════════════════════════════════════════════
    // INPUT HANDLING
    // ═══════════════════════════════════════════════════════════

    private setupInputHandlers(): void {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    private handleKeyPress = (e: KeyboardEvent): void => {
        if (this.state.gameStatus !== 'playing') return;

        const key = e.key.toUpperCase();

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key)) {
            this.addLetter(key);
        }
    };

    handleKeyClick(key: string): void {
        if (this.state.gameStatus !== 'playing') return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else {
            this.addLetter(key);
        }
    }

    private addLetter(letter: string): void {
        if (this.state.currentGuess.length >= WORD_LENGTH) return;

        this.state.currentGuess += letter;
        this.renderCurrentRow();
        this.animatePop(this.state.currentGuess.length - 1);
    }

    private deleteLetter(): void {
        if (this.state.currentGuess.length === 0) return;

        this.state.currentGuess = this.state.currentGuess.slice(0, -1);
        this.renderCurrentRow();
    }

    private async submitGuess(): Promise<void> {
        const guess = this.state.currentGuess;

        if (guess.length !== WORD_LENGTH) {
            this.showToast('Not enough letters');
            this.shakeRow();
            return;
        }

        if (!VALID_WORDS.has(guess)) {
            this.showToast('Not in word list');
            this.shakeRow();
            return;
        }

        const evaluation = this.evaluateGuess(guess);

        this.state.guesses.push(guess);
        this.state.evaluations.push(evaluation);

        await this.animateFlip(evaluation);
        this.updateKeyboardState(guess, evaluation);

        if (evaluation.every(s => s === 'correct')) {
            this.state.gameStatus = 'won';
            this.animateBounce();
            this.recordWin();
            this.showToast(this.getWinMessage());
        } else if (this.state.guesses.length >= MAX_ATTEMPTS) {
            this.state.gameStatus = 'lost';
            this.recordLoss();
            this.showToast(this.state.targetWord, 5000);
        }

        this.state.currentGuess = '';
        this.state.currentRow++;
        this.saveGame();
        this.render();
    }

    // ═══════════════════════════════════════════════════════════
    // EVALUATION ALGORITHM (Two-Pass)
    // ═══════════════════════════════════════════════════════════

    private evaluateGuess(guess: string): TileState[] {
        const result: TileState[] = Array(WORD_LENGTH).fill('absent');
        const targetCounts = new Map<string, number>();

        // Count letters in target
        for (const letter of this.state.targetWord) {
            targetCounts.set(letter, (targetCounts.get(letter) || 0) + 1);
        }

        // PASS 1: Mark exact matches
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === this.state.targetWord[i]) {
                result[i] = 'correct';
                targetCounts.set(guess[i], targetCounts.get(guess[i])! - 1);
            }
        }

        // PASS 2: Mark present letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (result[i] === 'correct') continue;

            const count = targetCounts.get(guess[i]) || 0;
            if (count > 0) {
                result[i] = 'present';
                targetCounts.set(guess[i], count - 1);
            }
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD STATE
    // ═══════════════════════════════════════════════════════════

    private updateKeyboardState(guess: string, evaluation: TileState[]): void {
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const newState = this.tileToKeyState(evaluation[i]);
            const currentState = this.keyboardState.get(letter) || 'unused';

            if (STATE_PRIORITY[newState] > STATE_PRIORITY[currentState]) {
                this.keyboardState.set(letter, newState);
            }
        }
        this.renderKeyboard();
    }

    private tileToKeyState(tile: TileState): KeyState {
        if (tile === 'correct') return 'correct';
        if (tile === 'present') return 'present';
        return 'absent';
    }

    // ═══════════════════════════════════════════════════════════
    // ANIMATIONS
    // ═══════════════════════════════════════════════════════════

    private animatePop(tileIndex: number): void {
        const tile = this.container.querySelector(
            `.row-${this.state.currentRow} .tile-${tileIndex}`
        );
        if (tile) {
            tile.classList.add('pop');
            setTimeout(() => tile.classList.remove('pop'), 100);
        }
    }

    private async animateFlip(evaluation: TileState[]): Promise<void> {
        const row = this.container.querySelector(`.row-${this.state.currentRow}`);
        if (!row) return;

        const tiles = row.querySelectorAll('.tile');

        for (let i = 0; i < tiles.length; i++) {
            await new Promise<void>(resolve => {
                setTimeout(() => {
                    tiles[i].classList.add('flip');

                    setTimeout(() => {
                        tiles[i].classList.add(`tile-${evaluation[i]}`);
                        tiles[i].classList.remove('tile-tbd');
                    }, 150);

                    setTimeout(resolve, 300);
                }, i * 300);
            });
        }
    }

    private shakeRow(): void {
        const row = this.container.querySelector(`.row-${this.state.currentRow}`);
        if (row) {
            row.classList.add('shake');
            setTimeout(() => row.classList.remove('shake'), 600);
        }
    }

    private animateBounce(): void {
        const rowIndex = this.state.currentRow;
        const tiles = this.container.querySelectorAll(`.row-${rowIndex} .tile`);

        tiles.forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('bounce');
            }, i * 100);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════

    private render(): void {
        this.container.innerHTML = `
      <div class="wordle-game">
        <header class="header">
          <h1>WORDLE</h1>
        </header>
        ${this.renderBoard()}
        ${this.renderKeyboard()}
        <div class="toast-container"></div>
      </div>
    `;
        this.attachKeyboardListeners();
    }

    private renderBoard(): string {
        let html = '<div class="board">';

        for (let row = 0; row < MAX_ATTEMPTS; row++) {
            html += `<div class="row row-${row}">`;

            for (let col = 0; col < WORD_LENGTH; col++) {
                const letter = this.getLetterAt(row, col);
                const state = this.getTileState(row, col);

                html += `
          <div class="tile tile-${col} tile-${state}">
            ${letter}
          </div>
        `;
            }

            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    private renderCurrentRow(): void {
        const row = this.container.querySelector(`.row-${this.state.currentRow}`);
        if (!row) return;

        const tiles = row.querySelectorAll('.tile');
        tiles.forEach((tile, i) => {
            const letter = this.state.currentGuess[i] || '';
            tile.textContent = letter;
            tile.className = `tile tile-${i} tile-${letter ? 'tbd' : 'empty'}`;
        });
    }

    private renderKeyboard(): string {
        let html = '<div class="keyboard">';

        for (const row of KEYBOARD_ROWS) {
            html += '<div class="keyboard-row">';

            for (const key of row) {
                const state = this.keyboardState.get(key) || 'unused';
                const isWide = key === 'ENTER' || key === 'BACKSPACE';
                const display = key === 'BACKSPACE' ? '⌫' : key;

                html += `
          <button 
            class="key key-${state} ${isWide ? 'key-wide' : ''}"
            data-key="${key}"
          >
            ${display}
          </button>
        `;
            }

            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    private attachKeyboardListeners(): void {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                this.handleKeyClick(key.getAttribute('data-key') || '');
            });
        });
    }

    private getLetterAt(row: number, col: number): string {
        if (row < this.state.guesses.length) {
            return this.state.guesses[row][col] || '';
        }
        if (row === this.state.currentRow) {
            return this.state.currentGuess[col] || '';
        }
        return '';
    }

    private getTileState(row: number, col: number): TileState {
        if (row < this.state.evaluations.length) {
            return this.state.evaluations[row][col];
        }
        if (row === this.state.currentRow && this.state.currentGuess[col]) {
            return 'tbd';
        }
        return 'empty';
    }

    // ═══════════════════════════════════════════════════════════
    // TOAST MESSAGES
    // ═══════════════════════════════════════════════════════════

    private showToast(message: string, duration = 2000): void {
        const container = this.container.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    private getWinMessage(): string {
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        return messages[Math.min(this.state.guesses.length - 1, messages.length - 1)];
    }

    // ═══════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════

    private saveGame(): void {
        const data = {
            state: this.state,
            keyboard: Object.fromEntries(this.keyboardState),
            lastPlayed: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    private loadGame(): { state: GameState; keyboard: Record<string, KeyState>; lastPlayed: string } | null {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    private isSameDay(dateStr: string): boolean {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    }

    // ═══════════════════════════════════════════════════════════
    // STATISTICS
    // ═══════════════════════════════════════════════════════════

    private loadStatistics(): Statistics {
        const saved = localStorage.getItem(this.STATS_KEY);
        return saved ? JSON.parse(saved) : {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: [0, 0, 0, 0, 0, 0],
            lastPlayed: null,
        };
    }

    private saveStatistics(): void {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(this.statistics));
    }

    private recordWin(): void {
        this.statistics.gamesPlayed++;
        this.statistics.gamesWon++;
        this.statistics.guessDistribution[this.state.guesses.length - 1]++;
        this.statistics.currentStreak++;
        this.statistics.maxStreak = Math.max(
            this.statistics.maxStreak,
            this.statistics.currentStreak
        );
        this.statistics.lastPlayed = new Date().toISOString().split('T')[0];
        this.saveStatistics();
    }

    private recordLoss(): void {
        this.statistics.gamesPlayed++;
        this.statistics.currentStreak = 0;
        this.statistics.lastPlayed = new Date().toISOString().split('T')[0];
        this.saveStatistics();
    }

    // ═══════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════

    getStatistics(): Statistics {
        return { ...this.statistics };
    }

    generateShareText(): string {
        const emojiMap: Record<TileState, string> = {
            correct: '🟩',
            present: '🟨',
            absent: '⬛',
            empty: '⬜',
            tbd: '⬜',
        };

        const grid = this.state.evaluations
            .map(row => row.map(state => emojiMap[state]).join(''))
            .join('\n');

        const attempts = this.state.gameStatus === 'won'
            ? this.state.guesses.length
            : 'X';

        return `Wordle ${attempts}/${MAX_ATTEMPTS}\n\n${grid}`;
    }

    destroy(): void {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}
