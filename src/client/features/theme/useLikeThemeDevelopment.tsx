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
    // 楽観的UIによって、成功する前にいいねを反映させる
    onMutate: async ({ developmentId }) => {
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
                likes: development.likes + 1,
                likedByLoggedInUser: true,
              };
            }
          );

          return { ...oldPaginatedDevelopments, list: newDevelopments };
        }
      );

      return { previousDevelopments };
    },
    onError: (_, __, contexts) => {
      queryClient.setQueryData(
        developmentsPerPageQueryKey(themeId, page),
        contexts?.previousDevelopments
      );

      showErrorNotification({
        title: `開発へのいいね`,
        message: `開発へいいねができませんでした。`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentsPerPageQueryKey(themeId, page));
    },
  });

  // TODO: 共通化について考える
  const unlikeDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["development"]["unlike"]) => {
      return trpc.development.unlike.mutate(data);
    },
    // 楽観的UIによって、成功する前にいいね解除を反映させる
    onMutate: async ({ developmentId }) => {
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
                likes: development.likes - 1,
                likedByLoggedInUser: false,
              };
            }
          );

          return { ...oldPaginatedDevelopments, list: newDevelopments };
        }
      );

      return { previousDevelopments };
    },
    onError: (_, __, contexts) => {
      queryClient.setQueryData(
        developmentsPerPageQueryKey(themeId, page),
        contexts?.previousDevelopments
      );

      showErrorNotification({
        title: `開発へのいいね解除`,
        message: `開発へのいいね解除ができませんでした。`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentsPerPageQueryKey(themeId, page));
    },
  });

  return { likeDevelopmentMutation, unlikeDevelopmentMutation };
};
