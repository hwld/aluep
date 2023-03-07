import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import {
  DevelopersPerPageData,
  developersPerPageQueryKey,
} from "../developer/useDevelopersPerPage";

// 開発情報のいいねは、ページングされた開発情報のリストに対して行うので、
// ページ番号を取得して、そのページの開発情報のみを扱えるようにする
export const useLikeThemeDeveloper = (themeId: string, page: number) => {
  const queryClient = useQueryClient();

  const likeDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["developer"]["like"]) => {
      return trpc.developer.like.mutate(data);
    },
    // 楽観的UIによって、成功する前にいいね・いいね解除を反映させる
    onMutate: async ({ developerId, like }) => {
      await queryClient.cancelQueries(developersPerPageQueryKey(themeId, page));

      const previousDevelopers =
        queryClient.getQueryData<DevelopersPerPageData>(
          developersPerPageQueryKey(themeId, page)
        );

      // 指定されたdeveloperの状態だけを書き換える
      queryClient.setQueryData<DevelopersPerPageData>(
        developersPerPageQueryKey(themeId, page),
        (oldPaginatedDevelopers) => {
          if (!oldPaginatedDevelopers) {
            return undefined;
          }

          const newDevelopers = oldPaginatedDevelopers.list.map((developer) => {
            if (developerId !== developer.id) {
              return { ...developer };
            }
            return {
              ...developer,
              likes: developer.likes + (like ? 1 : -1),
              likedByLoggedInUser: like,
            };
          });

          return { ...oldPaginatedDevelopers, list: newDevelopers };
        }
      );

      return { previousDevelopers };
    },
    onError: (_, newLiked, contexts) => {
      queryClient.setQueryData(
        developersPerPageQueryKey(themeId, page),
        contexts?.previousDevelopers
      );

      showErrorNotification({
        title: `開発者への${newLiked.like ? "いいね" : "いいね解除"}`,
        message: `開発者を${
          newLiked.like ? "いいね" : "いいね解除"
        }できませんでした。`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developersPerPageQueryKey(themeId, page));
    },
  });

  return { likeDeveloperMutation };
};
