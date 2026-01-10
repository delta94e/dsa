"use client";

/**
 * PromptTextArea Component
 *
 * Auto-expanding textarea for prompt input.
 */

import { type ReactNode, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useEnterKey } from "../../hooks";
import { IMAGE_GENERATION_PROMPT_MAX_LENGTH } from "../../constants";

export interface PromptTextAreaProps {
  /**
   * Current prompt value
   */
  value: string;
  /**
   * Change handler
   */
  onChange: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Element to render before the textarea
   */
  startDecorator?: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Input ID
   */
  id?: string;
  /**
   * Whether container is expanded
   */
  isExpanded?: boolean;
  /**
   * Max character length
   */
  maxLength?: number;
  /**
   * Focus handler
   */
  onFocus?: () => void;
  /**
   * Blur handler
   */
  onBlur?: () => void;
  /**
   * Submit handler (called on Enter)
   */
  onSubmit?: () => void;
}

export function PromptTextArea({
  value,
  onChange,
  placeholder = "Type a prompt...",
  startDecorator,
  className,
  id,
  isExpanded = true,
  maxLength = IMAGE_GENERATION_PROMPT_MAX_LENGTH,
  onFocus,
  onBlur,
  onSubmit,
}: PromptTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleEnterKey } = useEnterKey();

  // Focus and set cursor at end when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isExpanded]);

  return (
    <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
      {startDecorator}
      <TextareaAutosize
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (onSubmit) {
            handleEnterKey(e, onSubmit);
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        minRows={1}
        maxRows={isExpanded ? 6 : 1}
        className={cn(
          "pointer-events-auto w-full resize-none",
          "bg-transparent text-sm leading-[1.3521rem] font-normal text-white md:text-base md:leading-[1.35]",
          "placeholder:text-tertiary-foreground",
          "focus-visible:outline-none",
          "border-none",
          isExpanded
            ? "max-h-32.5 overflow-y-auto"
            : "overflow-hidden text-ellipsis whitespace-nowrap"
        )}
      />
    </div>
  );
}

export default PromptTextArea;
