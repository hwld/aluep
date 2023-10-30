import { AppTooltip } from "@/client/ui/AppTooltip";
import { WrapperLink } from "@/client/ui/WrapperLink";
import { Box, Button } from "@mantine/core";
import clsx from "clsx";
import React, { MouseEventHandler, SVGProps } from "react";
import classes from "./SidebarItem.module.css";

type Props = {
  icon: React.FC<SVGProps<SVGSVGElement>>;
  active?: boolean;
  label: string;
  tooltip?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
      <WrapperLink
        {...(others.asLink
          ? { noWrap: false, href: others.href, target: others.target }
          : { noWrap: true })}
      >
        <Button
          onClick={onClick}
          w="100%"
          h="45px"
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
      </WrapperLink>
    </AppTooltip>
  );
};
