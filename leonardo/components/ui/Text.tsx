"use client";

import { type FC, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Text Component
// Matches Chakra UI Text component pattern
// ============================================================================

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Font size */
  fontSize?: TextSize;
  /** Font weight */
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | number;
  /** Text color (Tailwind class or CSS color) */
  color?: string;
  /** Whether to truncate text with ellipsis */
  isTruncated?: boolean;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Line height */
  lineHeight?: string;
  /** Text transform */
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  /** Render as different element */
  as?: "p" | "span" | "div" | "label";
  /** Max width */
  maxW?: string;
  /** Padding Y */
  paddingY?: string;
}

const fontSizeClasses: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const fontWeightClasses: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
};

const textAlignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const textTransformClasses: Record<string, string> = {
  none: "",
  capitalize: "capitalize",
  uppercase: "uppercase",
  lowercase: "lowercase",
};

export const Text: FC<TextProps> = ({
  fontSize = "md",
  fontWeight = "normal",
  color,
  isTruncated = false,
  textAlign = "left",
  lineHeight,
  textTransform = "none",
  as: Component = "p",
  maxW,
  paddingY,
  className,
  style,
  children,
  ...props
}) => {
  const fontWeightClass =
    typeof fontWeight === "number"
      ? fontWeightClasses[String(fontWeight)] || `font-[${fontWeight}]`
      : fontWeightClasses[fontWeight];

  // Handle color - if it's a Tailwind-like value, use it directly; otherwise use style
  const isColorClass = color?.includes(".") || color?.startsWith("text-");
  const colorStyle = isColorClass ? undefined : color;

  return (
    <Component
      className={cn(
        fontSizeClasses[fontSize],
        fontWeightClass,
        textAlignClasses[textAlign],
        textTransformClasses[textTransform],
        isTruncated && "truncate",
        maxW === "full" && "max-w-full",
        className
      )}
      style={{
        color: colorStyle,
        lineHeight,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

Text.displayName = "Text";

export default Text;
