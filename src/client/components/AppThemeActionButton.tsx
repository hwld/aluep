import { ActionIcon, Menu } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";

type Props = { theme: Theme };
export const AppThemeActionButton: React.FC<Props> = ({ theme }) => {
  const { session } = useSessionQuery();

  const queryClient = useQueryClient();

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["delete"]) => {
      return trpc.theme.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["themes"]);
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleDeleteTheme = (e: SyntheticEvent) => {
    e.stopPropagation();
    deleteThemeMutation.mutate({ themeId: theme.id });
  };

  return (
    <Menu width={100}>
      <Menu.Target>
        <ActionIcon
          size={40}
          color="gray.0"
          radius="xl"
          sx={(theme) => ({
            color: theme.colors.gray[0],
            backgroundColor: theme.colors.red[7],
            boxShadow: theme.shadows.md,
            transition: "all 150ms",
            "&:hover": {
              color: theme.colors.gray[1],
              backgroundColor: theme.colors.red[8],
            },
          })}
          onClick={stopPropagation}
        >
          <BsThreeDots size="60%" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {session?.user.id === theme.user.id && (
          <div>
            <Menu.Item
              icon={<RiEdit2Fill size={20} />}
              onClick={stopPropagation}
              component={Link}
              href={`/themes/${theme.id}/update`}
            >
              更新
            </Menu.Item>
            <Menu.Item icon={<FaTrash size={18} />} onClick={handleDeleteTheme}>
              削除
            </Menu.Item>
          </div>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
