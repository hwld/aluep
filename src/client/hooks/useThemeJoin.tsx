import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { showErrorNotification, showSuccessNotification } from "../utils";
import { useSessionQuery } from "./useSessionQuery";
import { themeQueryKey } from "./useThemeQuery";

export const themeJoinQueryKey = (
  themeId: string,
  loggedInUserId: string | undefined
) =>
  [...themeQueryKey(themeId), "user", loggedInUserId ?? "", "joined"] as const;

export const useThemeJoin = (themeId: string) => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: joinData, ...others } = useQuery({
    queryKey: themeJoinQueryKey(themeId, session?.user.id),
    queryFn: () => {
      return trpc.theme.joined.query({ themeId });
    },
  });

  // お題に参加する
  const joinMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["join"]) => {
      return trpc.theme.join.mutate(data);
    },
    onSuccess: async () => {
      // 参加状況のキャッシュを無効にする
      await queryClient.invalidateQueries(
        themeJoinQueryKey(themeId, session?.user.id)
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

  // お題への参加をキャンセルする
  const cancelJoinMutation = useMutation({
    mutationFn: ({ developerId }: { developerId: string }) => {
      return trpc.themeDeveloper.delete.mutate({ developerId });
    },
    onSuccess: async () => {
      // 特定のテーマのキャッシュを無効にする
      await queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  return {
    data: { joinData, ...others },
    mutations: { joinMutation, cancelJoinMutation },
  };
};
