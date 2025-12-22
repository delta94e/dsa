import {
    Player,
    Cell,
    GameState,
    Position,
    ROWS,
    COLS,
    WIN_LENGTH,
    DIRECTIONS,
} from './types';

// ═══════════════════════════════════════════════════════════════
// CONNECT FOUR GAME ENGINE
// ═══════════════════════════════════════════════════════════════

export class ConnectFourGame {
    private state: GameState;
    private container: HTMLElement;
    private isAnimating = false;
    private hoveredColumn: number | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.state = this.createInitialState();
        this.render();
        this.setupEventListeners();
    }

    // ═══════════════════════════════════════════════════════════
    // STATE INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    private createInitialState(): GameState {
        return {
            board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
            currentPlayer: 'RED',
            winner: null,
            winningCells: [],
            gameStatus: 'playing',
            moveHistory: [],
        };
    }

    // ═══════════════════════════════════════════════════════════
    // GAME LOGIC
    // ═══════════════════════════════════════════════════════════

    private getDropRow(col: number): number {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.state.board[row][col] === null) {
                return row;
            }
        }
        return -1;
    }

    private getOpponent(player: Player): Player {
        return player === 'RED' ? 'YELLOW' : 'RED';
    }

    private isBoardFull(): boolean {
        return this.state.board[0].every(cell => cell !== null);
    }

    async makeMove(col: number): Promise<boolean> {
        if (this.isAnimating || this.state.gameStatus !== 'playing') return false;

        const row = this.getDropRow(col);
        if (row === -1) return false;

        this.isAnimating = true;

        // Update board
        this.state.board[row][col] = this.state.currentPlayer;
        this.state.moveHistory.push(col);

        // Animate drop
        this.render();
        await this.animateDrop(row, col);

        // Check win
        const winningCells = this.checkWin(row, col);
        if (winningCells) {
            this.state.winner = this.state.currentPlayer;
            this.state.winningCells = winningCells;
            this.state.gameStatus = 'won';
        } else if (this.isBoardFull()) {
            this.state.gameStatus = 'draw';
        } else {
            this.state.currentPlayer = this.getOpponent(this.state.currentPlayer);
        }

        this.isAnimating = false;
        this.render();
        return true;
    }

    // ═══════════════════════════════════════════════════════════
    // WIN DETECTION
    // ═══════════════════════════════════════════════════════════

    private checkWin(row: number, col: number): Position[] | null {
        const player = this.state.board[row][col];
        if (!player) return null;

        for (const { dr, dc } of DIRECTIONS) {
            const line = this.getLine(row, col, dr, dc, player);
            if (line.length >= WIN_LENGTH) {
                return line.slice(0, WIN_LENGTH);
            }
        }

        return null;
    }

    private getLine(
        startRow: number,
        startCol: number,
        dr: number,
        dc: number,
        player: Player
    ): Position[] {
        const cells: Position[] = [];

        // Check in negative direction first
        for (let i = -(WIN_LENGTH - 1); i < WIN_LENGTH; i++) {
            const row = startRow + dr * i;
            const col = startCol + dc * i;

            if (
                row >= 0 && row < ROWS &&
                col >= 0 && col < COLS &&
                this.state.board[row][col] === player
            ) {
                cells.push({ row, col });
            } else {
                if (cells.length >= WIN_LENGTH) break;
                cells.length = 0;
            }
        }

        return cells;
    }

    // ═══════════════════════════════════════════════════════════
    // UNDO
    // ═══════════════════════════════════════════════════════════

    undo(): boolean {
        if (this.state.moveHistory.length === 0 || this.isAnimating) return false;

        // Replay all moves except last
        const moves = this.state.moveHistory.slice(0, -1);
        this.state = this.createInitialState();

        for (const col of moves) {
            const row = this.getDropRow(col);
            this.state.board[row][col] = this.state.currentPlayer;
            this.state.currentPlayer = this.getOpponent(this.state.currentPlayer);
            this.state.moveHistory.push(col);
        }

        this.render();
        return true;
    }

    restart(): void {
        this.state = this.createInitialState();
        this.render();
    }

    // ═══════════════════════════════════════════════════════════
    // ANIMATION
    // ═══════════════════════════════════════════════════════════

    private async animateDrop(row: number, col: number): Promise<void> {
        const cell = this.container.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        ) as HTMLElement;

        if (!cell) return;

        cell.classList.add('dropping');

        return new Promise(resolve => {
            setTimeout(() => {
                cell.classList.remove('dropping');
                resolve();
            }, 100 + row * 80);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // EVENT HANDLING
    // ═══════════════════════════════════════════════════════════

    private setupEventListeners(): void {
        this.container.addEventListener('click', this.handleClick);
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    private handleClick = (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        const col = target.closest('[data-col]')?.getAttribute('data-col');

        if (col !== null) {
            this.makeMove(parseInt(col, 10));
        }

        // Check for button clicks
        if (target.classList.contains('restart-btn')) {
            this.restart();
        } else if (target.classList.contains('undo-btn')) {
            this.undo();
        }
    };

    private handleMouseMove = (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        const col = target.closest('[data-col]')?.getAttribute('data-col');

        if (col !== null) {
            const newCol = parseInt(col, 10);
            if (this.hoveredColumn !== newCol) {
                this.hoveredColumn = newCol;
                this.updateHoverPreview();
            }
        }
    };

    private handleMouseLeave = (): void => {
        this.hoveredColumn = null;
        this.updateHoverPreview();
    };

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key >= '1' && e.key <= '7') {
            this.makeMove(parseInt(e.key, 10) - 1);
        } else if (e.key.toLowerCase() === 'r') {
            this.restart();
        } else if (e.key.toLowerCase() === 'u') {
            this.undo();
        }
    };

    private updateHoverPreview(): void {
        const previews = this.container.querySelectorAll('.preview-cell');
        previews.forEach((cell, index) => {
            cell.classList.remove('preview-red', 'preview-yellow');
            if (
                index === this.hoveredColumn &&
                this.state.gameStatus === 'playing' &&
                this.getDropRow(index) !== -1
            ) {
                cell.classList.add(
                    this.state.currentPlayer === 'RED' ? 'preview-red' : 'preview-yellow'
                );
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════

    private render(): void {
        const statusText = this.getStatusText();

        this.container.innerHTML = `
      <div class="connect-four">
        <header class="header">
          <h1>CONNECT FOUR</h1>
          <div class="status ${this.state.currentPlayer.toLowerCase()}">
            ${statusText}
          </div>
        </header>

        <div class="board-container">
          <div class="preview-row">
            ${Array.from({ length: COLS })
                .map((_, col) => `<div class="preview-cell" data-col="${col}"></div>`)
                .join('')}
          </div>

          <div class="board">
            ${this.state.board
                .map(
                    (row, rowIndex) => `
                  <div class="row">
                    ${row
                            .map((cell, colIndex) => {
                                const isWinning = this.state.winningCells.some(
                                    w => w.row === rowIndex && w.col === colIndex
                                );
                                return `
                          <div 
                            class="cell ${cell ? cell.toLowerCase() : 'empty'} ${isWinning ? 'winning' : ''}"
                            data-row="${rowIndex}"
                            data-col="${colIndex}"
                          >
                            <div class="piece"></div>
                          </div>
                        `;
                            })
                            .join('')}
                  </div>
                `
                )
                .join('')}
          </div>
        </div>

        <div class="controls">
          <button class="restart-btn">Restart</button>
          <button class="undo-btn" ${this.state.moveHistory.length === 0 ? 'disabled' : ''}>
            Undo
          </button>
        </div>
      </div>
    `;

        this.updateHoverPreview();
    }

    private getStatusText(): string {
        if (this.state.gameStatus === 'won') {
            return `🎉 ${this.state.winner} Wins!`;
        }
        if (this.state.gameStatus === 'draw') {
            return "🤝 It's a Draw!";
        }
        return `${this.state.currentPlayer === 'RED' ? '🔴' : '🟡'} ${this.state.currentPlayer}'s Turn`;
    }

    // ═══════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════

    destroy(): void {
        this.container.removeEventListener('click', this.handleClick);
        this.container.removeEventListener('mousemove', this.handleMouseMove);
        this.container.removeEventListener('mouseleave', this.handleMouseLeave);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
}
