import * as React from "react";
import type { SVGProps } from "react";
const SvgUserEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="user-edit_svg__icon user-edit_svg__icon-tabler user-edit_svg__icon-tabler-user-edit"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h3.5M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97L18 22h-3v-3l3.42-3.39z" />
  </svg>
);
export default SvgUserEdit;
