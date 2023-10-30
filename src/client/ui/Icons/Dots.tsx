import * as React from "react";
import type { SVGProps } from "react";
const SvgDots = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="dots_svg__icon dots_svg__icon-tabler dots_svg__icon-tabler-dots"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M4 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M18 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0" />
  </svg>
);
export default SvgDots;
