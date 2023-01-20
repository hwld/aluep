import { ActionIcon, ActionIconProps } from "@mantine/core";
import { ComponentPropsWithoutRef } from "react";
import { OmitStrict } from "../types/OmitStrict";

type Props = OmitStrict<ActionIconProps, "sx"> &
  ComponentPropsWithoutRef<"button">;
export const CardActionIcon: React.FC<Props> = ({ children, ...props }) => {
  return (
    <ActionIcon
      {...props}
      sx={(theme) => ({
        transition: "background-color 250ms",
        "&:hover": {
          backgroundColor: theme.fn.rgba(theme.colors.gray[5], 0.1),
        },
      })}
    >
      {children}
    </ActionIcon>
  );
};
