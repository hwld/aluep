import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Theme } from "../../server/models/theme";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { showErrorNotification } from "../utils";
import { useSessionQuery } from "./useSessionQuery";
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
      return trpc.theme.liked.query({ themeId });
    },
  });

  const likeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["like"]) => {
      return trpc.theme.like.mutate(data);
    },
    //　楽観的UIによって、いいね・いいね解除が成功する前に状態を変えてしまう。
    onMutate: async (data) => {
      await queryClient.cancelQueries(themeQueryKey(themeId));

      // ユーザーがいいねしているかどうかの状況
      const previousLiked = queryClient.getQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id)
      );
      // お題(いいね数を含む)
      const previousTheme = queryClient.getQueryData<Theme | undefined>(
        themeQueryKey(themeId)
      );

      // いいね状況を反転させる
      queryClient.setQueryData<boolean>(
        themeLikedQueryKey(themeId, session?.user.id),
        (old) => !old
      );

      // いいね数を変える
      queryClient.setQueryData<Theme | undefined>(
        themeQueryKey(themeId),
        (old) => {
          if (!old) {
            return old;
          }

          return { ...old, likes: old.likes + (previousLiked ? -1 : 1) };
        }
      );

      return { previousLiked, previousTheme };
    },
    onError: (_, newLiked, context) => {
      //楽観的に更新した処理をもとに戻す
      queryClient.setQueryData(
        themeLikedQueryKey(themeId, session?.user.id),
        context?.previousLiked
      );
      queryClient.setQueryData(themeQueryKey(themeId), context?.previousTheme);

      showErrorNotification({
        title: newLiked.like ? "お題へのいいね" : "お題へのいいね解除",
        message: `お題を${
          newLiked.like ? "いいね" : "いいね解除"
        }できませんでした。`,
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
  };
};
