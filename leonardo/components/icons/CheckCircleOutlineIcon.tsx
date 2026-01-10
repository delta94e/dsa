"use client";

/**
 * CheckCircleOutlineIcon
 *
 * An outlined check circle icon.
 */

import type { FC, SVGProps } from "react";

interface CheckCircleOutlineIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CheckCircleOutlineIcon: FC<CheckCircleOutlineIconProps> = ({
  size = 16,
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
};

export default CheckCircleOutlineIcon;
