import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenu/AppMenuLinkItem/AppMenuLinkItem";
import { Routes } from "@/share/routes";
import { BadgeProps, Menu } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { BiBookmarkHeart } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
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
          leftSection={<RiAccountCircleLine size={20} />}
          href={Routes.user(user.id)}
        >
          プロフィール
        </AppMenuLinkItem>
        <AppMenuLinkItem
          leftSection={<BiBookmarkHeart size={20} />}
          href={Routes.userFavorites(user.id)}
        >
          お気に入り
        </AppMenuLinkItem>
        <AppMenuItem
          leftSection={<MdLogout size={20} />}
          onClick={handleLogOut}
        >
          ログアウト
        </AppMenuItem>
        <AppMenuLinkItem
          leftSection={<FaTrash size={16} />}
          href={Routes.userDelete}
          red
        >
          アカウント削除
        </AppMenuLinkItem>
      </AppMenuDropdown>
    </AppMenu>
  );
};
