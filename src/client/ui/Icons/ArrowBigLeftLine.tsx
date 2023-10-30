import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowBigLeftLine = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="arrow-big-left-line_svg__icon arrow-big-left-line_svg__icon-tabler arrow-big-left-line_svg__icon-tabler-arrow-big-left-line"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 15v3.586a1 1 0 0 1-1.707.707l-6.586-6.586a1 1 0 0 1 0-1.414l6.586-6.586A1 1 0 0 1 12 5.414V9h6v6h-6zM21 15V9" />
  </svg>
);
export default SvgArrowBigLeftLine;
