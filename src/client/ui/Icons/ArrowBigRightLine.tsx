import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowBigRightLine = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="arrow-big-right-line_svg__icon arrow-big-right-line_svg__icon-tabler arrow-big-right-line_svg__icon-tabler-arrow-big-right-line"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 9V5.414a1 1 0 0 1 1.707-.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586A1 1 0 0 1 12 18.586V15H6V9h6zM3 9v6" />
  </svg>
);
export default SvgArrowBigRightLine;