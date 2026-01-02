"use client";

import { type FC, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type BlurIntensity = "sm" | "md" | "lg" | "xl";
type GlowIntensity = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type ShadowIntensity = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  blurIntensity?: BlurIntensity;
  borderRadius?: string;
  glowIntensity?: GlowIntensity;
  shadowIntensity?: ShadowIntensity;
  enableDistortion?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const blurStyles: Record<BlurIntensity, string> = {
  sm: "backdrop-blur-xs",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const glowShadowStyles: Record<GlowIntensity, string> = {
  none: "0 4px 4px rgba(0, 0, 0, 0.05), 0 0 12px rgba(0, 0, 0, 0.05)",
  xs: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 16px rgba(255, 255, 255, 0.05)",
  sm: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)",
  md: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 32px rgba(255, 255, 255, 0.15)",
  lg: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 40px rgba(255, 255, 255, 0.2)",
  xl: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 48px rgba(255, 255, 255, 0.25)",
  "2xl":
    "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 60px rgba(255, 255, 255, 0.3)",
};

const insetShadowStyles: Record<ShadowIntensity, string> = {
  none: "inset 0 0 0 0 rgba(255, 255, 255, 0)",
  xs: "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.1), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.1)",
  sm: "inset 2px 2px 2px 0 rgba(255, 255, 255, 0.35), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.35)",
  md: "inset 3px 3px 3px 0 rgba(255, 255, 255, 0.45), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.45)",
  lg: "inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.5)",
  xl: "inset 6px 6px 6px 0 rgba(255, 255, 255, 0.55), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.55)",
  "2xl":
    "inset 8px 8px 8px 0 rgba(255, 255, 255, 0.6), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.6)",
};

// ============================================================================
// Component
// ============================================================================

/**
 * LiquidGlassCard
 *
 * Premium glassmorphism card with multi-layer effects:
 * - SVG turbulence distortion filter
 * - Backdrop blur layer
 * - Outer glow shadow layer
 * - Inner inset shadow layer
 */
export const LiquidGlassCard: FC<LiquidGlassCardProps> = ({
  children,
  className = "",
  width,
  height,
  blurIntensity = "xl",
  borderRadius = "32px",
  glowIntensity = "sm",
  shadowIntensity = "md",
  enableDistortion = true,
  style,
  ...props
}) => {
  return (
    <>
      {/* SVG Distortion Filter */}
      {enableDistortion && (
        <svg className="hidden">
          <defs>
            <filter
              id="glass-blur"
              x="0"
              y="0"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.003 0.007"
                numOctaves={1}
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale={200}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Main Container */}
      <div
        className={cn("pointer-events-none relative", className)}
        style={{
          borderRadius,
          ...(width && { width }),
          ...(height && { height }),
          ...style,
        }}
        {...props}
      >
        {/* Layer 1: Backdrop Blur */}
        <div
          className={`absolute inset-0 ${blurStyles[blurIntensity]} pointer-events-none z-0`}
          style={{
            borderRadius,
            transition: "inherit",
            ...(enableDistortion && { filter: "url(#glass-blur)" }),
          }}
        />

        {/* Layer 2: Outer Glow Shadow */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            borderRadius,
            boxShadow: glowShadowStyles[glowIntensity],
            transition: "inherit",
          }}
        />

        {/* Layer 3: Inner Inset Shadow */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius,
            boxShadow: insetShadowStyles[shadowIntensity],
            transition: "inherit",
          }}
        />

        {/* Layer 4: Content */}
        <div className="pointer-events-auto relative z-30 h-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default LiquidGlassCard;
