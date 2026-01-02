/**
 * AngleDownIcon
 *
 * Chevron/angle down icon for dropdowns and navigation.
 * Matches production bundle module 823251.
 */

import type { FC, SVGProps } from "react";

export const AngleDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      {...props}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AngleDownIcon;
