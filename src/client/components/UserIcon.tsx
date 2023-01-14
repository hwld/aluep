import { Avatar, AvatarProps } from "@mantine/core";
import React from "react";

export type UserIconProps = {
  iconSrc?: string | null;
  interactive?: boolean;
  size?: AvatarProps["size"];
  withBorder?: boolean;
};
export const UserIcon: React.FC<UserIconProps> = ({
  iconSrc,
  interactive = false,
  size,
  withBorder = true,
}) => {
  return (
    <Avatar
      // スタイルを当てるのにも使用している
      aria-label="user-icon"
      src={iconSrc}
      size={size}
      sx={(theme) => ({
        borderRadius: "100%",
        transition: "all 150ms",
        ...(withBorder
          ? {
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
            }
          : {}),
        ...(interactive
          ? { "&:hover": { borderColor: theme.colors.red[8] } }
          : {}),
      })}
    />
  );
};
