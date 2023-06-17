import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import {
  DevelopmentsPerPageData,
  developmentsPerPageQueryKey,
} from "./useDevelopmentsPerPage";

/**
 * ページングされた開発情報のリスト上で開発情報にいいねを行う。
 *
 *  pageは楽観的更新で特定のページのクエリキャッシュを書き換えるために使う
 */
export const useDevelopmentLikeOnList = (ideaId: string, page: number) => {
  const queryClient = useQueryClient();

  const likeDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["development"]["like"]) => {
      return trpc.development.like.mutate(data);
    },
    onMutate: async ({ developmentId }) => {
      return await optimisticUpdate({ developmentId, like: true });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDevelopments: contexts?.previousDevelopments,
        like: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentsPerPageQueryKey(ideaId, page));
    },
  });

  const unlikeDevelopmentMutation = useMutation({
    mutationFn: (data: RouterInputs["development"]["unlike"]) => {
      return trpc.development.unlike.mutate(data);
    },
    onMutate: async ({ developmentId }) => {
      return await optimisticUpdate({ developmentId, like: false });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDevelopments: contexts?.previousDevelopments,
        like: false,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentsPerPageQueryKey(ideaId, page));
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({
    developmentId,
    like,
  }: {
    developmentId: string;
    like: boolean;
  }): Promise<{
    previousDevelopments: DevelopmentsPerPageData | undefined;
  }> => {
    await queryClient.cancelQueries(developmentsPerPageQueryKey(ideaId, page));

    const previousDevelopments =
      queryClient.getQueryData<DevelopmentsPerPageData>(
        developmentsPerPageQueryKey(ideaId, page)
      );

    // 指定されたdevelopmentの状態だけを書き換える
    queryClient.setQueryData<DevelopmentsPerPageData>(
      developmentsPerPageQueryKey(ideaId, page),
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
  };

  /**　楽観的更新をキャンセルする */
  const cancelOptimisticUpdate = ({
    previousDevelopments,
    like,
  }: {
    previousDevelopments: DevelopmentsPerPageData | undefined;
    like: boolean;
  }) => {
    queryClient.setQueryData(
      developmentsPerPageQueryKey(ideaId, page),
      previousDevelopments
    );

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `開発への${action}`,
      message: `開発への${action}ができませんでした。`,
    });
  };

  return { likeDevelopmentMutation, unlikeDevelopmentMutation };
};