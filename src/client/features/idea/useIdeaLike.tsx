import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/notification";
import { Idea } from "@/models/idea";

type UseIdeaLikeArgs = { ideaId: string };

/**
 * お題をいいね・いいね解除するためのhooks
 */
export const useIdeaLike = ({ ideaId }: UseIdeaLikeArgs) => {
  const utils = trpc.useUtils();

  const likeIdeaMutation = trpc.idea.like.useMutation({
    onMutate: async () => {
      return await optimisticUpdate({ like: true });
    },
    onError: (_, __, context) => {
      cancelOptimisticUpdate({
        like: true,
        previousIdea: context?.previousIdea,
      });
    },
    onSettled: () => {
      utils.invalidate();
    },
  });

  const unlikeIdeaMutation = trpc.idea.unlike.useMutation({
    onMutate: async () => {
      return await optimisticUpdate({ like: false });
    },
    onError: (_, __, context) => {
      cancelOptimisticUpdate({
        like: false,
        previousIdea: context?.previousIdea,
      });
    },
    onSettled: () => {
      utils.invalidate();
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({ like }: { like: boolean }) => {
    await utils.idea.get.cancel({ ideaId });

    // お題(いいね数を含む)
    const previousIdea = utils.idea.get.getData({ ideaId });

    // いいね数といいねしたかを変える
    utils.idea.get.setData({ ideaId }, (old) => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        likes: old.likes + (like ? 1 : -1),
        likedByLoggedInUser: like,
      };
    });

    return { previousIdea };
  };

  /** 楽観的更新を取り消す */
  const cancelOptimisticUpdate = ({
    like,
    previousIdea,
  }: {
    like: boolean;
    previousIdea: Idea | undefined;
  }) => {
    utils.idea.get.setData({ ideaId }, previousIdea);

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `お題への${action}`,
      message: `お題への${action}ができませんでした。`,
    });
  };

  return {
    likeIdeaMutation,
    unlikeIdeaMutation,
  };
};
