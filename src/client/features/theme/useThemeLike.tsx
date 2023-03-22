import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { Theme } from "../../../server/models/theme";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { useSessionQuery } from "../session/useSessionQuery";
import { themeQueryKey } from "./useThemeQuery";

// themeQueryKeyが無効になった時には、themeLikedQueryKeyが変更されている可能性がある?
export const themeLikedQueryKey = (
  themeId: string,
  loggedInUserId: string | undefined
) => [...themeQueryKey(themeId), "user", loggedInUserId ?? "", "liked"];

// ログインユーザーと指定されたお題とのいいね状況
export const useThemeLike = (themeId: string) => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: likedByLoggedInUser } = useQuery({
    queryKey: themeLikedQueryKey(themeId, session?.user.id),
    queryFn: () => {
      return trpc.theme.isLikedByLoggedInUser.query({ themeId });
    },
  });

  const likeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["like"]) => {
      return trpc.theme.like.mutate(data);
    },
    //　楽観的UIによって、いいねが成功する前に状態を変えてしまう。
    onMutate: async () => {
      await queryClient.cancelQueries(themeQueryKey(themeId));

      // ユーザーがいいねしているかどうかの状況
      const previousLiked = queryClient.getQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id)
      );
      // お題(いいね数を含む)
      const previousTheme = queryClient.getQueryData<Theme>(
        themeQueryKey(themeId)
      );

      // いいねを反映させる
      queryClient.setQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id),
        () => true
      );

      // いいね数を変える
      queryClient.setQueryData<Theme>(themeQueryKey(themeId), (old) => {
        if (!old) {
          return old;
        }

        return { ...old, likes: old.likes + 1 };
      });

      return { previousLiked, previousTheme };
    },
    onError: (_, __, context) => {
      //楽観的に更新した処理をもとに戻す
      queryClient.setQueryData(
        themeLikedQueryKey(themeId, session?.user.id),
        context?.previousLiked
      );
      queryClient.setQueryData(themeQueryKey(themeId), context?.previousTheme);

      showErrorNotification({
        title: "お題へのいいね",
        message: `お題をいいねできませんでした。`,
      });
    },
    onSettled: () => {
      // お題のいいね数を更新する
      // themeLikedQueryKeyの先頭がthemeQuerykeyになっているので、自分のいいね状況も更新される
      // themeLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  // TODO: 共通化を考える
  const unlikeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["unlike"]) => {
      return trpc.theme.unlike.mutate(data);
    },
    //　楽観的UIによって、いいね解除が成功する前に状態を変えてしまう。
    onMutate: async () => {
      await queryClient.cancelQueries(themeQueryKey(themeId));

      // ユーザーがいいねしているかどうかの状況
      const previousLiked = queryClient.getQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id)
      );
      // お題(いいね数を含む)
      const previousTheme = queryClient.getQueryData<Theme>(
        themeQueryKey(themeId)
      );

      // いいね解除を反映させる
      queryClient.setQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id),
        () => false
      );

      // いいね数を変える
      queryClient.setQueryData<Theme>(themeQueryKey(themeId), (old) => {
        if (!old) {
          return old;
        }

        return { ...old, likes: old.likes - 1 };
      });

      return { previousLiked, previousTheme };
    },
    onError: (_, __, context) => {
      //楽観的に更新した処理をもとに戻す
      queryClient.setQueryData(
        themeLikedQueryKey(themeId, session?.user.id),
        context?.previousLiked
      );
      queryClient.setQueryData(themeQueryKey(themeId), context?.previousTheme);

      showErrorNotification({
        title: "お題へのいいね解除",
        message: `お題をいいね解除できませんでした。`,
      });
    },
    onSettled: () => {
      // お題のいいね数を更新する
      // themeLikedQueryKeyの先頭がthemeQuerykeyになっているので、自分のいいね状況も更新される
      // themeLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  return {
    likedByLoggedInUser: likedByLoggedInUser ?? false,
    likeThemeMutation,
    unlikeThemeMutation,
  };
};
