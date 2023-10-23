import Linkify from "linkify-react";
import { Opts } from "linkifyjs";
import { ReactNode } from "react";
import classes from "./AppLinkify.module.css";

const options: Opts = {
  className: classes.link,
  target: "_blank",
  rel: "noopener noreferrer",
  validate: {
    url: (value) => /^https?:\/\//.test(value),
    email: false,
  },
};

type Props = { children: ReactNode };

export const AppLinkify: React.FC<Props> = ({ children }) => {
  return <Linkify options={options}>{children}</Linkify>;
};
