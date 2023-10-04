import { stopPropagation } from "@/client/lib/utils";
import { Box } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren } from "react";
import classes from "./TextLink.module.css";

type Props = {
  href: string;
  className?: string;
  disabled?: boolean;
} & PropsWithChildren;

// TODO: この名前だとリンクとしての振る舞いを持ってそうだけど持ってない
// TextLinkWrapperみたいにするべきかも
export const TextLink: React.FC<Props> = ({
  href,
  className,
  children,
  disabled = false,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Box
      component={Link}
      className={`${className} ${classes.root}`}
      href={href}
      miw={0}
      w="fit-content"
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {children}
    </Box>
  );
};
