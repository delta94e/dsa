"use client";

/**
 * ShineBorder Component
 *
 * Animated gradient border effect with CSS variables.
 */

import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Border color
   */
  color?: string;
  /**
   * Animation speed
   */
  speed?: string;
  /**
   * Border thickness in pixels
   */
  thickness?: number;
  /**
   * Children elements
   */
  children?: ReactNode;
}

export function ShineBorder({
  className = "",
  color = "#B14BF4",
  speed = "20s",
  thickness = 1,
  children,
  style,
  ...props
}: ShineBorderProps) {
  const shineGradient = `radial-gradient(100% 100% at right, white 0%, white 5%, ${color} 35%, transparent 70%)`;
  const shineGlowGradient = `radial-gradient(circle, white 0%, ${color} 40%, transparent 70%)`;

  return (
    <div
      className={cn("shine-border-container", className)}
      style={
        {
          "--shine-gradient": shineGradient,
          "--shine-glow-gradient": shineGlowGradient,
          "--shine-speed": speed,
          "--shine-thickness": `${thickness / 16}rem`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Glow orbs */}
      <div className="shine-border-glow-orb" />
      <div className="shine-border-glow-orb" />

      {/* Border frame */}
      <div className="shine-border-frame">
        <div className="shine-border-light" />
        <div className="shine-border-light" />
      </div>

      {children}
    </div>
  );
}

export default ShineBorder;
