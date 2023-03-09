import Link, { LinkProps } from "next/link";
import React, {
  forwardRef,
  HTMLAttributeAnchorTarget,
  ReactElement,
  ReactNode,
} from "react";

export type WrapperLinkProps = { children?: ReactNode } & (
  | { noWrap: true }
  | ({ noWrap?: false; target?: HTMLAttributeAnchorTarget } & LinkProps)
);
export const WrapperLink = forwardRef<HTMLElement, WrapperLinkProps>(
  ({ children, ...props }, ref) => {
    if (props.noWrap) {
      // Tooltip直下で使用すると、様々なpropsが渡されるので、それを直接childrenに渡す
      const { noWrap, ...outerProps } = props;
      return React.cloneElement(children as ReactElement, {
        ...outerProps,
        ...(children as any)?.props,
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
