/**
 * Right Carat Icon
 *
 * Matches production bundle module 602814.
 */

import { Icon, IconProps } from "@chakra-ui/react";
import type { FC } from "react";

export const RightCaratIcon: FC<IconProps> = (props) => {
  return (
    <Icon
      width={4}
      height={4}
      viewBox="0 0 7 10"
      fill="currentColor"
      {...props}
    >
      <path d="M6.297 5.97631L2.40143 9.26122C1.74668 9.81322 0.75 9.34527 0.75 8.48577V1.51384C0.75 0.654342 1.74743 0.18639 2.40143 0.73839L6.297 4.0233C6.90075 4.53255 6.90075 5.46706 6.297 5.97631Z" />
    </Icon>
  );
};

export default RightCaratIcon;
