import { ActionIcon, Menu, Text } from "@mantine/core";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { SyntheticEvent, useId } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { AppMenu } from "./AppMenu/AppMenu";
import { MenuDropdown } from "./AppMenu/MenuDropdown";
import { MenuItem } from "./AppMenu/MenuItem";
import { MenuLinkItem } from "./AppMenu/MenuLinkItem";

type Props = { developer: ThemeDeveloper };
export const DeveloperMenuButton: React.FC<Props> = ({ developer }) => {
  const { session } = useSessionQuery();

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  const {
    mutations: { cancelJoinMutation },
  } = useThemeJoin(developer.themeId);

  // TODO
  // ネスト深くて何やってるかわかりずらいからhookに分けたい
  const deleteNotificatoinId = useId();
  const openDeleteModal = () => {
    openConfirmModal({
      title: "開発情報の削除",
      children: (
        <Text size="sm">
          開発情報を削除すると、貰った「いいね」がすべて削除されます。開発情報を削除しますか?
        </Text>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { loading: cancelJoinMutation.isLoading },
      cancelProps: {
        variant: "outline",
        disabled: cancelJoinMutation.isLoading,
      },
      closeOnConfirm: false,
      onConfirm: () => {
        showNotification({
          id: deleteNotificatoinId,
          loading: true,
          title: "開発情報の削除",
          message: "開発情報の削除中です。",
        });

        cancelJoinMutation.mutate(
          { developerId: developer.id },
          {
            onSuccess: () => {
              updateNotification({
                id: deleteNotificatoinId,
                color: "green",
                title: "開発情報の削除",
                message: "開発情報を削除しました。",
              });
              closeAllModals();
            },
            onError: () => {
              updateNotification({
                id: deleteNotificatoinId,
                color: "red",
                title: "開発情報の削除",
                message: "開発情報を削除できませんでした。",
              });
            },
          }
        );
      },
    });
  };

  return (
    <AppMenu>
      <Menu.Target>
        <ActionIcon
          size={30}
          color="gray"
          sx={(theme) => ({
            transition: "all 150ms",
            "&:hover": {
              backgroundColor: theme.fn.rgba(theme.colors.gray[5], 0.1),
            },
          })}
          onClick={stopPropagation}
        >
          <BsThreeDots size="70%" />
        </ActionIcon>
      </Menu.Target>

      <MenuDropdown>
        {session?.user.id === developer.userId ? (
          <>
            <MenuLinkItem
              icon={<RiEdit2Fill size={20} />}
              href={`/themes/${developer.themeId}/developers/${developer.id}/update`}
            >
              参加情報を更新する
            </MenuLinkItem>
            <MenuItem
              icon={<FaTrash size={18} />}
              onClick={openDeleteModal}
              red
            >
              参加情報を削除する
            </MenuItem>
          </>
        ) : (
          <Menu.Label>選択できる項目がありません。</Menu.Label>
        )}
      </MenuDropdown>
    </AppMenu>
  );
};
