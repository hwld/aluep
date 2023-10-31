import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { Routes } from "@/share/routes";
import { BadgeProps, Menu } from "@mantine/core";
import {
  IconLogout2,
  IconTrash,
  IconUserCircle,
  IconUserHeart,
} from "@tabler/icons-react";
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
          leftSection={<IconUserCircle />}
          href={Routes.user(user.id)}
        >
          プロフィール
        </AppMenuLinkItem>
        <AppMenuLinkItem
          leftSection={<IconUserHeart />}
          href={Routes.userFavorites(user.id)}
        >
          お気に入りユーザー
        </AppMenuLinkItem>
        <AppMenuItem leftSection={<IconLogout2 />} onClick={handleLogOut}>
          ログアウト
        </AppMenuItem>
        <AppMenuLinkItem
          leftSection={<IconTrash />}
          href={Routes.userDelete}
          red
        >
          アカウント削除
        </AppMenuLinkItem>
      </AppMenuDropdown>
    </AppMenu>
  );
};
