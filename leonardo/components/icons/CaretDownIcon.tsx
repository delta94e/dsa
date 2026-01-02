import { type FC, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const CaretDownIcon: FC<IconProps> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

CaretDownIcon.displayName = "CaretDownIcon";

export default CaretDownIcon;
