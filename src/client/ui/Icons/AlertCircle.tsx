import * as React from "react";
import type { SVGProps } from "react";
const SvgAlertCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="alert-circle_svg__icon alert-circle_svg__icon-tabler alert-circle_svg__icon-tabler-alert-circle"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v4M12 16h.01" />
  </svg>
);
export default SvgAlertCircle;
