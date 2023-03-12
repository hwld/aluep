import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import {
  DevelopmentsPerPageData,
  developmentsPerPageQueryKey,
} from "../development/useDevelopmentsPerPage";

// 開発情報のいいねは、ページングされた開発情報のリストに対して行うので、
// ページ番号を取得して、そのページの開発情報のみを扱えるようにする
export const useLikeThemeDevelopment = (themeId: string, page: number) => {
  const queryClient = useQueryClient();

  const likeDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["development"]["like"]) => {
      return trpc.development.like.mutate(data);
    },
    // 楽観的UIによって、成功する前にいいね・いいね解除を反映させる
    onMutate: async ({ developmentId, like }) => {
      await queryClient.cancelQueries(
        developmentsPerPageQueryKey(themeId, page)
      );

      const previousDevelopments =
        queryClient.getQueryData<DevelopmentsPerPageData>(
          developmentsPerPageQueryKey(themeId, page)
        );

      // 指定されたdevelopmentの状態だけを書き換える
      queryClient.setQueryData<DevelopmentsPerPageData>(
        developmentsPerPageQueryKey(themeId, page),
        (oldPaginatedDevelopments) => {
          if (!oldPaginatedDevelopments) {
            return undefined;
          }

          const newDevelopments = oldPaginatedDevelopments.list.map(
            (development) => {
              if (developmentId !== development.id) {
                return { ...development };
              }
              return {
                ...development,
                likes: development.likes + (like ? 1 : -1),
                likedByLoggedInUser: like,
              };
            }
          );

          return { ...oldPaginatedDevelopments, list: newDevelopments };
        }
      );

      return { previousDevelopments };
    },
    onError: (_, newLiked, contexts) => {
      queryClient.setQueryData(
        developmentsPerPageQueryKey(themeId, page),
        contexts?.previousDevelopments
      );

      showErrorNotification({
        title: `開発への${newLiked.like ? "いいね" : "いいね解除"}`,
        message: `開発への${
          newLiked.like ? "いいね" : "いいね解除"
        }ができませんでした。`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentsPerPageQueryKey(themeId, page));
    },
  });

  return { likeDevelopmentMutation };
};
