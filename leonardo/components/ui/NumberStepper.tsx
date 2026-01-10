"use client";

/**
 * NumberStepper Component
 *
 * A number input with increment/decrement buttons.
 * Matches production bundle module 894468.
 */

import { type FC, useState, useEffect } from "react";

import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { MinusIcon, PlusIcon } from "@/components/icons";

// ============================================================================
// Types
// ============================================================================

interface NumberStepperProps {
  value: number;
  min?: number;
  max?: number;
  precision?: number;
  step?: number;
  onChange?: (normalizedValue: number, rawValue: number) => void;
  isDisabled?: boolean;
}

// ============================================================================
// NumberStepper Component
// ============================================================================

export const NumberStepper: FC<NumberStepperProps> = ({
  value,
  min,
  max,
  precision = 0,
  step = 1,
  onChange,
  isDisabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const normalize = (input: number): number => {
    if (!Number.isFinite(input)) {
      console.warn("NumberStepper: input must be a finite number");
      return value;
    }

    if (
      !(
        (min === undefined || Number.isFinite(min)) &&
        (max === undefined || Number.isFinite(max))
      ) ||
      (min !== undefined && max !== undefined && max < min)
    ) {
      return value;
    }

    let result = input;

    if (min !== undefined && Number.isFinite(min)) {
      result = Math.max(min, result);
    }
    if (max !== undefined && Number.isFinite(max)) {
      result = Math.min(max, result);
    }

    const precisionValue =
      precision === undefined || !Number.isFinite(precision) || precision < 0
        ? 0
        : Math.floor(precision);
    const factor = Math.pow(10, precisionValue);
    result = Math.round(result * factor) / factor;

    if (!Number.isFinite(result)) {
      console.warn(
        "NumberStepper: normalization resulted in a non-finite number"
      );
      return value;
    }

    return result;
  };

  const handleChange = (input: number) => {
    const normalized = normalize(input);
    onChange?.(normalized, input);
  };

  const handleIncrement = () => {
    setIsEditing(false);
    handleChange(value + step);
  };

  const handleDecrement = () => {
    setIsEditing(false);
    handleChange(value - step);
  };

  return (
    <div className="group flex w-fit items-stretch">
      <IconButton
        className="rounded-r-none border-r-0"
        variant="secondary"
        size="sm"
        aria-label={`Decrease by ${step}`}
        onClick={handleDecrement}
        disabled={isDisabled}
        type="button"
      >
        <MinusIcon />
      </IconButton>

      <Input
        type="number"
        role="spinbutton"
        size="sm"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={
          (min !== undefined && value < min) ||
          (max !== undefined && value > max)
        }
        aria-label="Number stepper"
        value={inputValue}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val);
          setIsEditing(true);

          if (val === "" || val === "-") {
            return;
          }

          const parsed = parseFloat(val);
          if (!isNaN(parsed)) {
            handleChange(parsed);
          }
        }}
        onBlur={() => {
          setIsEditing(false);

          if (inputValue === "" || inputValue === "-") {
            handleChange(0);
          } else {
            const parsed = parseFloat(inputValue);
            if (!isNaN(parsed)) {
              handleChange(parsed);
            }
          }

          setInputValue(value.toString());
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          switch (e.key) {
            case "ArrowUp":
              e.preventDefault();
              setIsEditing(false);
              handleIncrement();
              break;
            case "ArrowDown":
              e.preventDefault();
              setIsEditing(false);
              handleDecrement();
              break;
            case "Home":
              e.preventDefault();
              setIsEditing(false);
              if (min !== undefined) {
                handleChange(min);
              }
              break;
            case "End":
              e.preventDefault();
              setIsEditing(false);
              if (max !== undefined) {
                handleChange(max);
              }
              break;
          }
        }}
        disabled={isDisabled}
        className="w-12 min-w-12 [appearance:textfield] rounded-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <IconButton
        className="rounded-l-none border-l-0"
        variant="secondary"
        size="sm"
        aria-label={`Increase by ${step}`}
        onClick={handleIncrement}
        disabled={isDisabled}
        type="button"
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
};

export default NumberStepper;
