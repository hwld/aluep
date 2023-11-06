import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { useQueryClient } from "@tanstack/react-query";

/**
 * お題の開発情報を操作するhooks
 */
export const useDevMutations = () => {
  const client = useQueryClient();

  const developMutation = useMutationWithNotification(trpc.dev.create, {
    succsesNotification: {
      title: "お題の開発",
      message: "お題の開発を開始しました。",
    },
    errorNotification: {
      title: "お題の開発",
      message: "お題の開発を開始できませんでした。",
    },
  });

  const updateDevMutation = useMutationWithNotification(trpc.dev.update, {
    succsesNotification: {
      title: "お題開発情報の更新",
      message: "開発情報を更新しました。",
    },
    errorNotification: {
      title: "お題開発情報の更新",
      message: "お題開発情報を更新できませんでした。",
    },
  });

  const deleteDevMutation = useMutationWithNotification(trpc.dev.delete, {
    succsesNotification: {
      title: "開発情報の削除",
      message: "開発情報を削除しました。",
    },
    errorNotification: {
      title: "開発情報の削除",
      message: "開発情報を削除できませんでした。",
    },
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
