import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
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

  const { data: likedByLoggedInUser } = useQuery(
    themeLikedQueryKey(themeId, session?.user.id),
    () => {
      return trpc.theme.liked.query({ themeId });
    }
  );

  const likeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["like"]) => {
      return trpc.theme.like.mutate(data);
    },
    onSuccess: () => {
      // お題のいいね数を更新する
      // themeLikedQueryKeyの先頭がthemeQuerykeyになっているので、自分のいいね状況も更新される
      queryClient.invalidateQueries(themeQueryKey(themeId));
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題へのいいね",
        message: "お題にいいねできませんでした。",
      });
    },
  });

  return { likedByLoggedInUser, likeThemeMutation };
};
