import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { Idea } from "@/models/idea";

type UseIdeaLikeArgs = { ideaId: string };

// ログインユーザーと指定されたお題とのいいね状況
export const useIdeaLike = ({ ideaId }: UseIdeaLikeArgs) => {
  const utils = trpc.useContext();
  const { session } = useSessionQuery();

  const { data: likedByLoggedInUser } = trpc.idea.isLikedByUser.useQuery({
    ideaId,
    userId: session?.user.id ?? null,
  });

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
    await utils.idea.isLikedByUser.cancel({
      ideaId,
      userId: session?.user.id ?? null,
    });

    // お題(いいね数を含む)
    const previousIdea = utils.idea.get.getData({ ideaId });

    // いいねを反映させる
    utils.idea.isLikedByUser.setData(
      { ideaId, userId: session?.user.id ?? null },
      like
    );

    // いいね数を変える
    utils.idea.get.setData({ ideaId }, (old) => {
      if (!old) {
        return old;
      }

      return { ...old, likes: old.likes + (like ? 1 : -1) };
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
    utils.idea.isLikedByUser.setData(
      { ideaId, userId: session?.user.id ?? null },
      !like
    );
    utils.idea.get.setData({ ideaId }, previousIdea);

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `お題への${action}`,
      message: `お題への${action}ができませんでした。`,
    });
  };

  return {
    likedByLoggedInUser: likedByLoggedInUser ?? false,
    likeIdeaMutation,
    unlikeIdeaMutation,
  };
};
