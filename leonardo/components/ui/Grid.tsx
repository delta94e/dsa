"use client";

/**
 * Grid Component
 *
 * Grid layout component matching Chakra UI's Grid.
 * Matches production bundle module 120599.
 */

import { forwardRef, type HTMLAttributes, type CSSProperties } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  templateColumns?: string;
  templateRows?: string;
  gap?: number;
  alignItems?: "start" | "end" | "center" | "baseline" | "stretch";
  justifyItems?: "start" | "end" | "center" | "stretch";
  w?: string | number;
  h?: string | number;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      templateColumns,
      templateRows,
      gap,
      alignItems,
      justifyItems,
      w,
      h,
      className = "",
      style,
      children,
      ...props
    },
    ref
  ) => {
    const gridStyle: CSSProperties = {
      display: "grid",
      gridTemplateColumns: templateColumns,
      gridTemplateRows: templateRows,
      gap: gap ? `${gap * 4}px` : undefined,
      alignItems,
      justifyItems,
      width: typeof w === "number" ? `${w * 4}px` : w,
      height: typeof h === "number" ? `${h * 4}px` : h,
      ...style,
    };

    return (
      <div ref={ref} className={className} style={gridStyle} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
