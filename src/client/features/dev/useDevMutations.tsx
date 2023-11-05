import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/notification";
import { useQueryClient } from "@tanstack/react-query";

/**
 * お題の開発情報を操作するhooks
 */
export const useDevMutations = () => {
  const client = useQueryClient();

  const developMutation = trpc.dev.create.useMutation({
    onSuccess: async () => {
      showSuccessNotification({
        title: "お題の開発",
        message: "お題の開発を開始しました。",
      });
    },
    onError: () => {
      showErrorNotification({
        title: "お題の開発",
        message: "お題の開発を開始できませんでした。",
      });
    },
  });

  // お題の開発情報を更新する
  const updateDevMutation = trpc.dev.update.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "お題開発情報の更新",
        message: "開発情報を更新しました。",
      });
    },
    onError: () => {
      showErrorNotification({
        title: "お題開発情報の更新",
        message: "お題開発情報を更新できませんでした。",
      });
    },
  });

  // お題の開発情報を削除する
  const deleteDevMutation = trpc.dev.delete.useMutation({
    onSuccess: () => {
      client.removeQueries();
    },
  });

  return {
    developMutation,
    updateDevMutation,
    deleteDevMutation,
  };
};
