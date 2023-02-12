import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { showErrorNotification } from "../utils";
import {
  PaginatedDeveloperQueryData,
  paginatedDevelopersQueryKey,
} from "./usePaginatedDeveloperQueery";

// 開発情報のいいねは、ページングされた開発情報のリストに対して行うので、
// ページ番号を取得して、そのページの開発情報のみを扱えるようにする
export const useLikeThemeDeveloper = (themeId: string, page: number) => {
  const queryClient = useQueryClient();

  const likeDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["like"]) => {
      return trpc.themeDeveloper.like.mutate(data);
    },
    // 楽観的UIによって、成功する前にいいね・いいね解除を反映させる
    onMutate: async ({ developerId, like }) => {
      await queryClient.cancelQueries(
        paginatedDevelopersQueryKey(themeId, page)
      );

      const previousDevelopers =
        queryClient.getQueryData<PaginatedDeveloperQueryData>(
          paginatedDevelopersQueryKey(themeId, page)
        );

      // 指定されたdeveloperの状態だけを書き換える
      queryClient.setQueryData<PaginatedDeveloperQueryData>(
        paginatedDevelopersQueryKey(themeId, page),
        (old) => {
          if (!old) {
            return undefined;
          }

          const oldDevelopers = old.developers;
          const newDevelopers = oldDevelopers.map((developer) => {
            if (developerId !== developer.id) {
              return { ...developer };
            }
            return {
              ...developer,
              likes: developer.likes + (like ? 1 : -1),
              likedByLoggedInUser: like,
            };
          });

          return { ...old, developers: newDevelopers };
        }
      );

      return { previousDevelopers };
    },
    onError: (_, newLiked, contexts) => {
      queryClient.setQueryData(
        paginatedDevelopersQueryKey(themeId, page),
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
      queryClient.invalidateQueries(paginatedDevelopersQueryKey(themeId, page));
    },
  });

  return { likeDeveloperMutation };
};
