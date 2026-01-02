"use client";

/**
 * NumberStepper Component
 *
 * A number input with increment/decrement buttons.
 * Matches production bundle module 894468.
 */

import { type FC, type ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

interface NumberStepperProps {
  value: number;
  onChange: (value: number, rawValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// NumberStepper Component
// ============================================================================

export const NumberStepper: FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  className = "",
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue, newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue, newValue);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value, 10);
    if (isNaN(rawValue)) {
      onChange(min, 0);
      return;
    }
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, rawValue));
    onChange(clampedValue, rawValue);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
        </svg>
      </Button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className="bg-surface-secondary h-8 w-14 rounded-lg border-none text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Number value"
      />

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Button>
    </div>
  );
};

export default NumberStepper;
