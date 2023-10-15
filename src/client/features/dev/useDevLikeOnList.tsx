import { DevsData } from "@/client/features/dev/useDevsByIdea";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";

/**
 * ページングされた開発情報のリスト上で開発情報にいいねを行う。
 *
 *  pageは楽観的更新で特定のページのクエリキャッシュを書き換えるために使う
 */
export const useDevLikeOnList = (ideaId: string, page: number) => {
  const utils = trpc.useContext();

  const likeDevMutation = trpc.dev.like.useMutation({
    onMutate: async ({ devId }) => {
      return await optimisticUpdate({ devId: devId, like: true });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDevs: contexts?.previousDev,
        like: true,
      });
    },
    onSettled: () => {
      utils.invalidate();
    },
  });

  const unlikeDevMutation = trpc.dev.unlike.useMutation({
    onMutate: async ({ devId }) => {
      return await optimisticUpdate({ devId, like: false });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDevs: contexts?.previousDev,
        like: false,
      });
    },
    onSettled: () => {
      utils.invalidate();
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({
    devId,
    like,
  }: {
    devId: string;
    like: boolean;
  }): Promise<{
    previousDev: DevsData | undefined;
  }> => {
    await utils.dev.getManyByIdea.cancel({ ideaId, page });

    const previousDevs = utils.dev.getManyByIdea.getData({
      ideaId,
      page,
    });

    utils.dev.getManyByIdea.setData({ ideaId, page }, (oldPaginatedDevs) => {
      if (!oldPaginatedDevs) {
        return undefined;
      }

      const newDevs = oldPaginatedDevs.list.map((dev) => {
        if (devId !== dev.id) {
          return { ...dev };
        }

        return {
          ...dev,
          likes: dev.likes + (like ? 1 : -1),
          likedByLoggedInUser: like,
        };
      });

      return { ...oldPaginatedDevs, list: newDevs };
    });

    return { previousDev: previousDevs };
  };

  /**　楽観的更新をキャンセルする */
  const cancelOptimisticUpdate = ({
    previousDevs,
    like,
  }: {
    previousDevs: DevsData | undefined;
    like: boolean;
  }) => {
    utils.dev.getManyByIdea.setData({ ideaId, page }, previousDevs);

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `開発への${action}`,
      message: `開発への${action}ができませんでした。`,
    });
  };

  return {
    likeDevMutation,
    unlikeDevMutation,
  };
};
