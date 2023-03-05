import Link, { LinkProps } from "next/link";
import React, { forwardRef, ReactElement, ReactNode } from "react";

type Props = { children: ReactNode } & (
  | { noWrap: true }
  | ({ noWrap?: false } & LinkProps)
);
export const WrapperLink = forwardRef<HTMLElement, Props>(
  ({ children, ...props }, ref) => {
    if (props.noWrap) {
      // Tooltip直下で使用すると、様々なpropsが渡されるので、それを直接childrenに渡す
      const { noWrap, ...outerProps } = props;
      return React.cloneElement(children as ReactElement, {
        ...outerProps,
        ref,
      });
    } else {
      const { noWrap, ...linkProps } = props;
      return (
        <Link ref={ref as any} {...linkProps}>
          {children}
        </Link>
      );
    }
  }
);
WrapperLink.displayName = "WrapperLink";
