import * as React from "react";
import type { SVGProps } from "react";
const SvgPhoto = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="photo_svg__icon photo_svg__icon-tabler photo_svg__icon-tabler-photo"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" />
    <path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5" />
    <path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3" />
  </svg>
);
export default SvgPhoto;
