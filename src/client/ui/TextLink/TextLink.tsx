import { stopPropagation } from "@/client/lib/utils";
import { Box } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren, SyntheticEvent } from "react";
import classes from "./TextLink.module.css";

type Props = {
  href: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
} & PropsWithChildren;

export const TextLink: React.FC<Props> = ({
  href,
  className,
  children,
  disabled = false,
  onClick,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  const handleClick = (e: SyntheticEvent) => {
    stopPropagation(e);
    onClick?.();
  };

  return (
    <Box
      component={Link}
      className={`${className} ${classes.root}`}
      href={href}
      miw={0}
      onClick={handleClick}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {children}
    </Box>
  );
};
