import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../lib/utils";
import { useSessionQuery } from "../session/useSessionQuery";
import { themeQueryKey } from "./useThemeQuery";

export const themeDevelopedQueryKey = (
  themeId: string,
  loggedInUserId: string | undefined
) =>
  [
    ...themeQueryKey(themeId),
    "user",
    loggedInUserId ?? "",
    "developed",
  ] as const;

export const useThemeDevelop = (themeId: string) => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: developedData, ...others } = useQuery({
    queryKey: themeDevelopedQueryKey(themeId, session?.user.id),
    queryFn: () => {
      return trpc.theme.developed.query({ themeId });
    },
  });

  // お題を開発する
  const developMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["develop"]) => {
      return trpc.theme.develop.mutate(data);
    },
    onSuccess: async () => {
      // 開発状況のキャッシュを無効にする
      await queryClient.invalidateQueries(
        themeDevelopedQueryKey(themeId, session?.user.id)
      );

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

  // お題の開発をキャンセルする
  const cancelDevelopMutation = useMutation({
    mutationFn: ({ developmentId }: { developmentId: string }) => {
      return trpc.development.delete.mutate({ developmentId: developmentId });
    },
    onSuccess: async () => {
      // 特定のテーマのキャッシュを無効にする
      await queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  return {
    data: { developedData, ...others },
    mutations: { developMutation, cancelDevelopMutation },
  };
};
