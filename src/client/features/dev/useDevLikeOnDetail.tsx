import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { Dev } from "@/models/dev";

/**
 * 開発情報詳細画面で開発情報にいいねを行う
 */
export const useDevLikeOnDetail = (devId: string) => {
  const utils = trpc.useUtils();

  const likeDevMutation = trpc.dev.like.useMutation({
    onMutate: async ({ devId }) => {
      return await optimisticUpdate({ devId: devId, like: true });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDev: contexts?.previousDev,
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
        previousDev: contexts?.previousDev,
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
    previousDev: Dev | undefined;
  }> => {
    await utils.dev.get.cancel({ devId: devId });

    const previousDev = utils.dev.get.getData({
      devId: devId,
    });

    utils.dev.get.setData({ devId: devId }, (dev) => {
      if (dev === undefined) {
        return undefined;
      }

      return {
        ...dev,
        likes: dev.likes + (like ? 1 : -1),
        likedByLoggedInUser: like,
      };
    });

    return { previousDev: previousDev };
  };

  /**　楽観的更新をキャンセルする */
  const cancelOptimisticUpdate = ({
    previousDev,
    like,
  }: {
    previousDev: Dev | undefined;
    like: boolean;
  }) => {
    utils.dev.get.setData({ devId: devId }, previousDev);

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
