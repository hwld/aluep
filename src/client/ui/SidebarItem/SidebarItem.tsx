import { AppTooltip } from "@/client/ui/AppTooltip";
import { Box, Button } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import React, { ComponentProps, SVGProps, SyntheticEvent } from "react";
import classes from "./SidebarItem.module.css";

type Props = {
  icon: React.FC<SVGProps<SVGSVGElement>>;
  active?: boolean;
  label: string;
  tooltip?: boolean;
  onClick?: (e: SyntheticEvent) => void;
} & (
  | { asLink?: false }
  | { asLink: true; href: string; target?: React.HTMLAttributeAnchorTarget }
);

export const SidebarItem: React.FC<Props> = ({
  label,
  icon: Icon,
  active,
  tooltip = false,
  onClick,
  ...others
}) => {
  return (
    <AppTooltip label={label} hidden={!tooltip} position="right-start">
      {/* Button<typeof Link>とButton<"button">をいい感じに切り替えれくれないので・・・ */}
      {/* @ts-ignore */}
      <Button
        {...(others.asLink
          ? {
              component: Link,
              ...({
                href: others.href,
                target: others.target,
              } satisfies ComponentProps<typeof Link>),
            }
          : {})}
        onClick={onClick}
        classNames={{
          root: clsx(classes.root, { [classes["root-active"]]: active }),
          inner: classes.inner,
          label: clsx(classes.label, { [classes["label-active"]]: active }),
        }}
      >
        <Box
          w={30}
          h={30}
          className={clsx(classes["icon-wrapper"], {
            [classes.active]: active,
          })}
        >
          <Icon width="100%" height="100%" />
        </Box>
        {label}
      </Button>
    </AppTooltip>
  );
};
