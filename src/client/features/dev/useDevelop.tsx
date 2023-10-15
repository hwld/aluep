import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { Routes } from "@/share/routes";
import { useRouter } from "next/router";

/**
 * お題の開発情報を操作するhooks
 */
export const useDevelop = () => {
  const router = useRouter();

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
    onSuccess: (_, fields) => {
      showSuccessNotification({
        title: "お題開発情報の更新",
        message: "開発情報を更新しました。",
      });

      router.push(Routes.dev(fields.ideaId, fields.devId));
    },
    onError: () => {
      showErrorNotification({
        title: "お題開発情報の更新",
        message: "お題開発情報を更新できませんでした。",
      });
    },
  });

  // お題の開発をキャンセルする
  const cancelDevelopMutation = trpc.dev.delete.useMutation();

  return {
    mutations: {
      developMutation,
      updateDevMutation,
      cancelDevelopMutation,
    },
  };
};
