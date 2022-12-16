import { ActionIcon, Menu, Text } from "@mantine/core";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyntheticEvent, useId } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../../server/models/theme";
import { themesQueryKey } from "../../hooks/usePaginatedThemesQuery";
import { useSessionQuery } from "../../hooks/useSessionQuery";
import { trpc } from "../../trpc";
import { AppMenu } from "../AppMenu/AppMenu";
import { MenuDropdown } from "../AppMenu/MenuDropdown";
import { MenuItem } from "../AppMenu/MenuItem";
import { MenuLinkItem } from "../AppMenu/MenuLinkItem";

type Props = { theme: Theme };
export const ThemeMenuButton: React.FC<Props> = ({ theme }) => {
  const { session } = useSessionQuery();
  const queryClient = useQueryClient();

  // TODO: hookに切り出したい
  const deleteNotificationId = useId();
  const deleteThemeMutation = useMutation({
    mutationFn: () => {
      return trpc.theme.delete.mutate({ themeId: theme.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themesQueryKey);
      updateNotification({
        id: deleteNotificationId,
        color: "green",
        title: "お題の削除",
        message: "お題を削除しました。",
      });
    },
    onError: () => {
      updateNotification({
        id: deleteNotificationId,
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const openDeleteModal = () =>
    openConfirmModal({
      title: "アプリ開発のお題の削除",
      children: (
        <Text size="sm">
          お題を削除すると、貰った「いいね」、開発者の情報がすべて削除されます。お題を削除しますか？
        </Text>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { loading: deleteThemeMutation.isLoading },
      cancelProps: {
        variant: "outline",
        disabled: deleteThemeMutation.isLoading,
      },
      closeOnConfirm: false,
      onConfirm: () => {
        showNotification({
          id: deleteNotificationId,
          loading: true,
          title: "お題の削除",
          message: "お題の削除中です。",
        });

        deleteThemeMutation.mutate(undefined, {
          onSettled: () => {
            closeAllModals();
          },
        });
      },
    });

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
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
        {session?.user.id === theme.user.id ? (
          <>
            <MenuLinkItem
              icon={<RiEdit2Fill size={20} />}
              href={`/themes/${theme.id}/update`}
            >
              お題を更新する
            </MenuLinkItem>
            <MenuItem
              icon={<FaTrash size={18} />}
              onClick={openDeleteModal}
              red
            >
              お題を削除する
            </MenuItem>
          </>
        ) : (
          <Menu.Label>選択できる項目がありません。</Menu.Label>
        )}
      </MenuDropdown>
    </AppMenu>
  );
};
