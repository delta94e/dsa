import { memo, useState } from 'react';
import { Cell, Position, Player, ROWS, COLS } from '../types';
import './Board.css';

interface BoardProps {
  board: Cell[][];
  currentPlayer: Player;
  winningCells: Position[];
  droppingCell: Position | null;
  onColumnClick: (col: number) => void;
  getDropRow: (col: number) => number;
  gameStatus: 'playing' | 'won' | 'draw';
}

export const Board = memo(function Board({
  board,
  currentPlayer,
  winningCells,
  droppingCell,
  onColumnClick,
  getDropRow,
  gameStatus,
}: BoardProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const isWinningCell = (row: number, col: number): boolean => {
    return winningCells.some(c => c.row === row && c.col === col);
  };

  const isDropping = (row: number, col: number): boolean => {
    return droppingCell?.row === row && droppingCell?.col === col;
  };

  return (
    <div className="board-container">
      {/* Preview Row */}
      <div className="preview-row">
        {Array.from({ length: COLS }).map((_, col) => {
          const canDrop = getDropRow(col) !== -1 && gameStatus === 'playing';
          const showPreview = hoveredCol === col && canDrop;
          
          return (
            <div
              key={col}
              className={`preview-cell ${showPreview ? `preview-${currentPlayer.toLowerCase()}` : ''}`}
            />
          );
        })}
      </div>

      {/* Main Board */}
      <div
        className="board"
        onMouseLeave={() => setHoveredCol(null)}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell ? cell.toLowerCase() : 'empty'} ${
                  isWinningCell(rowIndex, colIndex) ? 'winning' : ''
                } ${isDropping(rowIndex, colIndex) ? 'dropping' : ''}`}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => onColumnClick(colIndex)}
                onMouseEnter={() => setHoveredCol(colIndex)}
              >
                <div className="piece" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
