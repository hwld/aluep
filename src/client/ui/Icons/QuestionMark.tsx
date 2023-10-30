import * as React from "react";
import type { SVGProps } from "react";
const SvgQuestionMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="question-mark_svg__icon question-mark_svg__icon-tabler question-mark_svg__icon-tabler-question-mark"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M8 8a3.5 3 0 0 1 3.5-3h1A3.5 3 0 0 1 16 8a3 3 0 0 1-2 3 3 4 0 0 0-2 4M12 19v.01" />
  </svg>
);
export default SvgQuestionMark;
