import { Divider, Menu, Text, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { AppMenu } from "../AppMenu/AppMenu";
import { MenuDropdown } from "../AppMenu/MenuDropdown";
import { MenuItem } from "../AppMenu/MenuItem";
import { MenuLinkItem } from "../AppMenu/MenuLinkItem";
import { UserIcon } from "../UserIcon";

type Props = { user: Session["user"] };

export const UserMenuButton: React.FC<Props> = ({ user }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <AppMenu>
      <Menu.Target>
        <UnstyledButton>
          <UserIcon iconSrc={user.image} withBorder={false} />
        </UnstyledButton>
      </Menu.Target>
      <MenuDropdown maw={180}>
        <Menu.Label>
          <Text
            align="center"
            sx={() => {
              return {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              };
            }}
          >
            {user.name}
          </Text>
        </Menu.Label>
        <Divider color="gray.3" />
        <MenuLinkItem
          icon={<VscAccount size={20} />}
          href={`/users/${user.id}`}
        >
          プロフィール
        </MenuLinkItem>
        <MenuLinkItem icon={<RiEdit2Line size={20} />} href="/users/profile">
          プロフィール変更
        </MenuLinkItem>
        <MenuItem icon={<MdLogout size={20} />} onClick={handleLogOut}>
          ログアウト
        </MenuItem>
        <MenuLinkItem icon={<FaTrash size={16} />} href="/users/delete" red>
          アカウント削除
        </MenuLinkItem>
      </MenuDropdown>
    </AppMenu>
  );
};
