import * as React from "react";
import type { SVGProps } from "react";
const SvgMedal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="medal_svg__icon medal_svg__icon-tabler medal_svg__icon-tabler-medal"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M12 4v3M8 4v6m8-6v6M12 18.5 9 20l.5-3.5-2-2 3-.5 1.5-3 1.5 3 3 .5-2 2L15 20z" />
  </svg>
);
export default SvgMedal;
