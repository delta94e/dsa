import { memo } from 'react';
import { TileState, WORD_LENGTH, MAX_ATTEMPTS } from '../types';
import './Board.css';

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  evaluations: TileState[][];
  currentRow: number;
  shakeRow: boolean;
  bounceRow: boolean;
  flipTiles: number[];
}

export const Board = memo(function Board({
  guesses,
  currentGuess,
  evaluations,
  currentRow,
  shakeRow,
  bounceRow,
  flipTiles,
}: BoardProps) {
  return (
    <div className="board">
      {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          guess={rowIndex < guesses.length ? guesses[rowIndex] : rowIndex === currentRow ? currentGuess : ''}
          evaluation={evaluations[rowIndex]}
          isCurrentRow={rowIndex === currentRow}
          isBouncing={bounceRow && rowIndex === currentRow - 1}
          isShaking={shakeRow && rowIndex === currentRow}
          flipTiles={rowIndex === currentRow ? flipTiles : []}
        />
      ))}
    </div>
  );
});

interface RowProps {
  rowIndex: number;
  guess: string;
  evaluation?: TileState[];
  isCurrentRow: boolean;
  isBouncing: boolean;
  isShaking: boolean;
  flipTiles: number[];
}

const Row = memo(function Row({
  guess,
  evaluation,
  isBouncing,
  isShaking,
  flipTiles,
}: RowProps) {
  const rowClasses = `row ${isShaking ? 'shake' : ''} ${isBouncing ? 'bounce' : ''}`;

  return (
    <div className={rowClasses}>
      {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
        const letter = guess[colIndex] || '';
        const state = evaluation?.[colIndex] || (letter ? 'tbd' : 'empty');
        const isFlipping = flipTiles.includes(colIndex);

        return (
          <Tile
            key={colIndex}
            letter={letter}
            state={state}
            isFlipping={isFlipping}
            delay={colIndex * 100}
          />
        );
      })}
    </div>
  );
});

interface TileProps {
  letter: string;
  state: TileState;
  isFlipping: boolean;
  delay: number;
}

const Tile = memo(function Tile({ letter, state, isFlipping, delay }: TileProps) {
  const classes = `tile tile-${state} ${isFlipping ? 'flip' : ''} ${letter && state === 'tbd' ? 'pop' : ''}`;

  return (
    <div 
      className={classes} 
      style={{ animationDelay: isFlipping ? `${delay}ms` : undefined }}
    >
      {letter}
    </div>
  );
});
