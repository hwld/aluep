import { Box } from "@mantine/core";
import React, { MouseEventHandler, useMemo } from "react";
import { IconType } from "react-icons";
import { AppButton } from "../AppButton";
import { AppTooltip } from "../AppTooltip";

type Props = {
  icon: IconType;
  active?: boolean;
  label: string;
  tooltip?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ({ asLink?: false } | { asLink: true; href: string });

export const SideMenuItem: React.FC<Props> = ({
  label,
  icon: Icon,
  active,
  tooltip = false,
  onClick,
  ...linkProps
}) => {
  // リンク用のprops
  const props = useMemo(() => {
    if (linkProps.asLink) {
      return linkProps;
    }
    return {};
  }, [linkProps]);

  return (
    <AppTooltip
      label={label}
      hidden={!tooltip}
      color="gray.7"
      position="right-start"
    >
      <AppButton
        {...props}
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
      </AppButton>
    </AppTooltip>
  );
};
