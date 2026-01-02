import { type FC, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const CheckIcon: FC<IconProps> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

CheckIcon.displayName = "CheckIcon";

export default CheckIcon;
