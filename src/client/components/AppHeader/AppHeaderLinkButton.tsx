import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";

type Props = ButtonProps &
  React.ComponentPropsWithoutRef<"a"> & { href: string };

export const AppHeaderLinkButton: React.FC<Props> = ({
  children,
  href,
  ...others
}) => {
  return (
    <Button
      component={Link}
      bg="gray.0"
      c="red.7"
      sx={(theme) => ({
        "&:hover": {
          backgroundColor: theme.colors.gray[1],
        },
      })}
      href={href}
      {...others}
    >
      {children}
    </Button>
  );
};
