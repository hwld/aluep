import { Avatar, AvatarProps } from "@mantine/core";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import classes from "./UserIcon.module.css";

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
  const iconWrapperRef = useRef<HTMLImageElement | null>(null);

  // SSRを使用していると、imgのonErrorが補足されない (https://github.com/facebook/react/issues/15446)
  // そのため、クライアント側でsrcを再設定してエラーがあればエラーを発生させる
  useEffect(() => {
    const icon = iconWrapperRef.current?.querySelector("img");
    if (!icon) {
      return;
    }
    icon.src = icon.src;
  }, [iconSrc]);

  return (
    <>
      <Avatar
        ref={iconWrapperRef}
        src={iconSrc}
        size={size}
        imageProps={{ "aria-label": "ユーザーのアイコン" }}
        className={clsx(classes.root, {
          [classes.withBorder]: withBorder,
          [classes.interactive]: interactive,
        })}
      />
    </>
  );
};
