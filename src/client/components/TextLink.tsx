import { Box } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { stopPropagation } from "../utils";
type Props = { href: string } & PropsWithChildren;

export const TextLink: React.FC<Props> = ({ href, children }) => {
  return (
    <Box
      component={Link}
      href={href}
      sx={(theme) => ({
        textDecoration: "none",
        "&:hover": {
          textDecorationLine: "underline",
          textDecorationColor: theme.colors.red[7],
          textUnderlineOffset: "3px",
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
