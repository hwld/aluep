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
  const iconRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof iconSrc !== "string") {
      return;
    }

    const image = new Image();
    image.src = iconSrc;

    // SSRを使用していると、imgのonErrorが補足されない (https://github.com/facebook/react/issues/15446)
    // そのため、iconSrcが変わるたびにimg要素を作成して、読み込みを試す
    // ただ、UserIconが使われるたびに画像を読み込むので、リクエストが多くなってしまう。
    // GCSのキャッシュを工夫する必要がある？
    image.onerror = () => {
      if (!iconRef.current) {
        return;
      }

      // mantineのAvatarはimgをBoxでラップしてるので、img子要素をみつけてエラーイベントを手動で投げる
      iconRef.current.querySelector("img")?.dispatchEvent(new Event("error"));
    };
  }, [iconSrc]);

  return (
    <>
      <Avatar
        ref={iconRef}
        src={iconSrc}
        size={size}
        bg="gray.1"
        imageProps={{ "aria-label": "ユーザーのアイコン" }}
        className={clsx(classes.root, {
          [classes.withBorder]: withBorder,
          [classes.interactive]: interactive,
        })}
      />
    </>
  );
};
