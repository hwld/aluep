import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import {
  SvgLogout2,
  SvgTrash,
  SvgUserCircle,
  SvgUserHeart,
} from "@/client/ui/Icons";
import { Routes } from "@/share/routes";
import { BadgeProps, Menu } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import classes from "./LoggedInUserMenu.module.css";

type Props = Omit<
  { user: Session["user"]; trigger: ReactNode } & BadgeProps,
  "children"
>;

export const LoggedInUserMenu: React.FC<Props> = ({ user, trigger }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <AppMenu offset={10} position="right-end">
      <Menu.Target>{trigger}</Menu.Target>
      <AppMenuDropdown maw={180} className={classes.dropdown}>
        <AppMenuLinkItem
          leftSection={<SvgUserCircle />}
          href={Routes.user(user.id)}
        >
          プロフィール
        </AppMenuLinkItem>
        <AppMenuLinkItem
          leftSection={<SvgUserHeart />}
          href={Routes.userFavorites(user.id)}
        >
          お気に入りユーザー
        </AppMenuLinkItem>
        <AppMenuItem leftSection={<SvgLogout2 />} onClick={handleLogOut}>
          ログアウト
        </AppMenuItem>
        <AppMenuLinkItem
          leftSection={<SvgTrash />}
          href={Routes.userDelete}
          red
        >
          アカウント削除
        </AppMenuLinkItem>
      </AppMenuDropdown>
    </AppMenu>
  );
};
