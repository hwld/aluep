import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronsRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="chevrons-right_svg__icon chevrons-right_svg__icon-tabler chevrons-right_svg__icon-tabler-chevrons-right"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m7 7 5 5-5 5M13 7l5 5-5 5" />
  </svg>
);
export default SvgChevronsRight;
