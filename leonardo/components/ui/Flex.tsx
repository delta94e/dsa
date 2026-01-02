"use client";

/**
 * Flex Component
 *
 * Flexbox layout component matching Chakra UI's Flex.
 * Matches production bundle module 635515.
 */

import { forwardRef, type HTMLAttributes, type CSSProperties } from "react";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type AlignItems = "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
type Display =
  | "none"
  | "flex"
  | { base?: string; md?: string; md_next?: string; lg?: string };

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: number;
  display?: Display;
  mb?: number;
  px?: number;
  py?: number;
  p?: number;
  w?: string | number;
  h?: string | number;
  as?: keyof JSX.IntrinsicElements;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      wrap = "nowrap",
      justifyContent,
      alignItems,
      gap,
      display = "flex",
      mb,
      px,
      py,
      p,
      w,
      h,
      className = "",
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Handle responsive display
    let displayValue: string = "flex";
    let responsiveClass = "";

    if (typeof display === "object") {
      displayValue = display.base || "flex";
      if (display.md_next === "none" || display.md === "none") {
        responsiveClass = "md:hidden";
      }
    } else {
      displayValue = display;
    }

    const flexStyle: CSSProperties = {
      display: displayValue,
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent,
      alignItems,
      gap: gap ? `${gap * 4}px` : undefined,
      marginBottom: mb ? `${mb * 4}px` : undefined,
      paddingLeft: px ? `${px * 4}px` : undefined,
      paddingRight: px ? `${px * 4}px` : undefined,
      paddingTop: py ? `${py * 4}px` : undefined,
      paddingBottom: py ? `${py * 4}px` : undefined,
      padding: p ? `${p * 4}px` : undefined,
      width: typeof w === "number" ? `${w * 4}px` : w,
      height: typeof h === "number" ? `${h * 4}px` : h,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={`${responsiveClass} ${className}`.trim()}
        style={flexStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

export default Flex;
