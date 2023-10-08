import { DevelopmentsData } from "@/client/features/dev/useDevsByIdea";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";

/**
 * ページングされた開発情報のリスト上で開発情報にいいねを行う。
 *
 *  pageは楽観的更新で特定のページのクエリキャッシュを書き換えるために使う
 */
export const useDevLikeOnList = (ideaId: string, page: number) => {
  const utils = trpc.useContext();

  const likeDevelopmentMutation = trpc.development.like.useMutation({
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
      utils.invalidate();
    },
  });

  const unlikeDevelopmentMutation = trpc.development.unlike.useMutation({
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
      utils.invalidate();
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
    previousDevelopments: DevelopmentsData | undefined;
  }> => {
    await utils.development.getManyByIdea.cancel({ ideaId, page });

    const previousDevelopments = utils.development.getManyByIdea.getData({
      ideaId,
      page,
    });

    utils.development.getManyByIdea.setData(
      { ideaId, page },
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
    previousDevelopments: DevelopmentsData | undefined;
    like: boolean;
  }) => {
    utils.development.getManyByIdea.setData(
      { ideaId, page },
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
