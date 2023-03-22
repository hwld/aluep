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
    onMutate: async () => {
      return await optimisticUpdate({ like: true });
    },
    onError: (_, __, context) => {
      cancelOptimisticUpdate({
        like: true,
        previousTheme: context?.previousTheme,
      });
    },
    onSettled: () => {
      // お題のいいね数を更新する
      // themeLikedQueryKeyの先頭がthemeQuerykeyになっているので、自分のいいね状況も更新される
      // themeLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  const unlikeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["unlike"]) => {
      return trpc.theme.unlike.mutate(data);
    },
    onMutate: async () => {
      return await optimisticUpdate({ like: false });
    },
    onError: (_, __, context) => {
      cancelOptimisticUpdate({
        like: false,
        previousTheme: context?.previousTheme,
      });
    },
    onSettled: () => {
      // お題のいいね数を更新する
      // themeLikedQueryKeyの先頭がthemeQuerykeyになっているので、自分のいいね状況も更新される
      // themeLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(themeQueryKey(themeId));
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({ like }: { like: boolean }) => {
    await queryClient.cancelQueries(themeQueryKey(themeId));

    // お題(いいね数を含む)
    const previousTheme = queryClient.getQueryData<Theme>(
      themeQueryKey(themeId)
    );

    // いいねを反映させる
    queryClient.setQueryData<boolean>(
      themeLikedQueryKey(themeId, session?.user.id),
      () => like
    );

    // いいね数を変える
    queryClient.setQueryData<Theme>(themeQueryKey(themeId), (old) => {
      if (!old) {
        return old;
      }

      return { ...old, likes: old.likes + (like ? 1 : -1) };
    });

    return { previousTheme };
  };

  /** 楽観的更新を取り消す */
  const cancelOptimisticUpdate = ({
    like,
    previousTheme,
  }: {
    like: boolean;
    previousTheme: Theme | undefined;
  }) => {
    queryClient.setQueryData(
      themeLikedQueryKey(themeId, session?.user.id),
      !like
    );
    queryClient.setQueryData(themeQueryKey(themeId), previousTheme);

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `お題への${action}`,
      message: `お題への${action}ができませんでした。`,
    });
  };

  return {
    likedByLoggedInUser: likedByLoggedInUser ?? false,
    likeThemeMutation,
    unlikeThemeMutation,
  };
};
