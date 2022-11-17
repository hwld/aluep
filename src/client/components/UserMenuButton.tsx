import { ActionIcon, Avatar, Divider, Menu, Text } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MdLogout, MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

type Props = { user: Session["user"] };

export const UserMenuButton: React.FC<Props> = ({ user }) => {
  const handleLogOut = () => {
    signOut();
  };

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon>
          <Avatar src={user.image} radius="xl" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>ユーザー設定</Menu.Label>
        <Divider />
        <Menu.Item
          icon={<MdOutlineEdit size={20} />}
          component={Link}
          href="/users/profile"
        >
          プロフィール変更
        </Menu.Item>
        <Menu.Item icon={<MdLogout size={20} />} onClick={handleLogOut}>
          ログアウト
        </Menu.Item>
        <Menu.Item
          icon={<MdOutlineDelete size={20} />}
          color="red"
          component={Link}
          href="/users/delete"
        >
          アカウント削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
