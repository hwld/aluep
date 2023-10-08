import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { Development } from "@/models/development";

/**
 * 開発情報詳細画面で開発情報にいいねを行う
 */
export const useDevLikeOnDetail = (developmentId: string) => {
  const utils = trpc.useContext();

  const likeDevelopmentMutation = trpc.development.like.useMutation({
    onMutate: async ({ developmentId }) => {
      return await optimisticUpdate({ developmentId, like: true });
    },
    onError: (_, __, contexts) => {
      cancelOptimisticUpdate({
        previousDevelopment: contexts?.previousDevelopment,
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
        previousDevelopment: contexts?.previousDevelopment,
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
    previousDevelopment: Development | undefined;
  }> => {
    await utils.development.get.cancel({ developmentId });

    const previousDevelopment = utils.development.get.getData({
      developmentId,
    });

    utils.development.get.setData({ developmentId }, (development) => {
      if (development === undefined) {
        return undefined;
      }

      return {
        ...development,
        likes: development.likes + (like ? 1 : -1),
        likedByLoggedInUser: like,
      };
    });

    return { previousDevelopment };
  };

  /**　楽観的更新をキャンセルする */
  const cancelOptimisticUpdate = ({
    previousDevelopment,
    like,
  }: {
    previousDevelopment: Development | undefined;
    like: boolean;
  }) => {
    utils.development.get.setData({ developmentId }, previousDevelopment);

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `開発への${action}`,
      message: `開発への${action}ができませんでした。`,
    });
  };

  return { likeDevelopmentMutation, unlikeDevelopmentMutation };
};
