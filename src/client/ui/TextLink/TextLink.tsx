import { stopPropagation } from "@/client/lib/utils";
import { Box, Flex, MantineStyleProp } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren, SyntheticEvent } from "react";
import classes from "./TextLink.module.css";

type Props = {
  href: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  wrapperStyle?: MantineStyleProp;
} & PropsWithChildren;

export const TextLink: React.FC<Props> = ({
  href,
  className,
  children,
  disabled = false,
  onClick,
  wrapperStyle,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  const handleClick = (e: SyntheticEvent) => {
    stopPropagation(e);
    onClick?.();
  };

  return (
    // Flexの子になったときにもLinkの幅が伸びないようにFlexでラップしておく
    <Flex style={wrapperStyle}>
      <Box
        component={Link}
        className={`${className} ${classes.root}`}
        href={href}
        miw={0}
        onClick={handleClick}
        onMouseDown={stopPropagation}
        onMouseUp={stopPropagation}
        style={{ display: "inline-block" }}
      >
        {children}
      </Box>
    </Flex>
  );
};
