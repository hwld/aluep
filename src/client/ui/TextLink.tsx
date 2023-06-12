import { Box } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { stopPropagation } from "../lib/utils";
type Props = {
  href: string;
  width?: string;
  className?: string;
} & PropsWithChildren;

export const TextLink: React.FC<Props> = ({
  href,
  width,
  className,
  children,
}) => {
  return (
    <Box
      component={Link}
      className={className}
      href={href}
      miw={0}
      w={width}
      sx={(theme) => ({
        textDecoration: "none",
        "&:hover": {
          textDecorationLine: "underline",
          textDecorationColor: theme.colors.red[7],
          textUnderlineOffset: "3px",
          "*": { color: theme.colors.red[7] },
        },
      })}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {children}
    </Box>
  );
};
