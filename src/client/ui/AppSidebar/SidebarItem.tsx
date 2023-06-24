import { AppTooltip } from "@/client/ui/AppTooltip";
import { WrapperLink } from "@/client/ui/WrapperLink";
import { Button, Box } from "@mantine/core";
import React, { MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  icon: IconType;
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
    <AppTooltip
      label={label}
      hidden={!tooltip}
      color="gray.7"
      position="right-start"
    >
      <WrapperLink
        {...(others.asLink
          ? { noWrap: false, href: others.href, target: others.target }
          : { noWrap: true })}
      >
        <Button
          onClick={onClick}
          w="100%"
          h="45px"
          bg={active ? "gray.1" : "transparent"}
          sx={(theme) => ({
            transition: "all 150ms",
            pointerEvents: active ? "none" : "auto",
            "&:hover": {
              backgroundColor: theme.colors.red[5],
              transform: "scale(1.02)",
            },
            "& svg": {
              color: active ? theme.colors.red[7] : theme.colors.gray[1],
            },
          })}
          styles={(theme) => ({
            root: { padding: "0px 7px", overflow: "hidden" },
            inner: { justifyContent: "flex-start" },
            label: {
              gap: "7px",
              color: active ? theme.colors.red[7] : theme.colors.gray[1],
            },
          })}
        >
          <Box w={30} h={30} sx={{ flexShrink: 0 }}>
            <Icon size="100%" />
          </Box>
          {label}
        </Button>
      </WrapperLink>
    </AppTooltip>
  );
};
