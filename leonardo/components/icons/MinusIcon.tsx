/**
 * MinusIcon Component
 *
 * Matches production bundle module 585388.
 */

import { type FC, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const MinusIcon: FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M19 13.0039H5C4.448 13.0039 4 12.5559 4 12.0039C4 11.4519 4.448 11.0039 5 11.0039H19C19.552 11.0039 20 11.4519 20 12.0039C20 12.5559 19.552 13.0039 19 13.0039Z"
      fill="currentColor"
    />
  </svg>
);

MinusIcon.displayName = "MinusIcon";

export default MinusIcon;
