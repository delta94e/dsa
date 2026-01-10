"use client";

/**
 * SpinnerIcon Component
 *
 * A spinning loading indicator icon with gradient stroke.
 * Based on Leonardo.ai module 262358.
 */

import { useId, type SVGProps } from "react";

export function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  const gradientId = useId();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10.75"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="12.48"
          y1="12.48"
          x2="18.7098"
          y2="6.73919"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.4" stopColor="currentColor" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default SpinnerIcon;
