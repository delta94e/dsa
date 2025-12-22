import { memo } from 'react';
import { KeyState, KEYBOARD_ROWS } from '../types';
import './Keyboard.css';

interface KeyboardProps {
  keyboardState: Map<string, KeyState>;
  onKeyPress: (key: string) => void;
}

export const Keyboard = memo(function Keyboard({ keyboardState, onKeyPress }: KeyboardProps) {
  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <Key
              key={key}
              keyValue={key}
              state={keyboardState.get(key) || 'unused'}
              onPress={onKeyPress}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

interface KeyProps {
  keyValue: string;
  state: KeyState;
  onPress: (key: string) => void;
}

const Key = memo(function Key({ keyValue, state, onPress }: KeyProps) {
  const isWide = keyValue === 'ENTER' || keyValue === 'BACKSPACE';
  const display = keyValue === 'BACKSPACE' ? '⌫' : keyValue;

  return (
    <button
      className={`key key-${state} ${isWide ? 'key-wide' : ''}`}
      onClick={() => onPress(keyValue)}
    >
      {display}
    </button>
  );
});
