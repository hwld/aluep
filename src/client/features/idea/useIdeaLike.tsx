import { ideaKeys } from "@/client/features/idea/queryKeys";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { RouterInputs } from "@/server/lib/trpc";
import { Idea } from "@/server/models/idea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseIdeaLikeArgs = { ideaId: string };

// ログインユーザーと指定されたお題とのいいね状況
export const useIdeaLike = ({ ideaId }: UseIdeaLikeArgs) => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: likedByLoggedInUser } = useQuery({
    queryKey: ideaKeys.isLiked(ideaId, session?.user.id),
    queryFn: () => {
      return trpc.idea.isLikedByUser.query({
        ideaId,
        userId: session?.user.id ?? null,
      });
    },
  });

  const likeIdeaMutation = useMutation({
    mutationFn: (data: RouterInputs["idea"]["like"]) => {
      return trpc.idea.like.mutate(data);
    },
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
      // お題のいいね数を更新する
      // ideaLikedQueryKeyの先頭がideaQuerykeyになっているので、自分のいいね状況も更新される
      // ideaLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(ideaKeys.detail(ideaId));
    },
  });

  const unlikeIdeaMutation = useMutation({
    mutationFn: (data: RouterInputs["idea"]["unlike"]) => {
      return trpc.idea.unlike.mutate(data);
    },
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
      // お題のいいね数を更新する
      // ideaLikedQueryKeyの先頭がideaQuerykeyになっているので、自分のいいね状況も更新される
      // ideaLikedQueryKeyは自分がいいねしたかの情報だけで、お題のいいね数とは関係がないのでどちらもinvalidateする必要がある。
      queryClient.invalidateQueries(ideaKeys.detail(ideaId));
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({ like }: { like: boolean }) => {
    await queryClient.cancelQueries(ideaKeys.detail(ideaId));

    // お題(いいね数を含む)
    const previousIdea = queryClient.getQueryData<Idea>(
      ideaKeys.detail(ideaId)
    );

    // いいねを反映させる
    queryClient.setQueryData<boolean>(
      ideaKeys.isLiked(ideaId, session?.user.id),
      () => like
    );

    // いいね数を変える
    queryClient.setQueryData<Idea>(ideaKeys.detail(ideaId), (old) => {
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
    queryClient.setQueryData(ideaKeys.isLiked(ideaId, session?.user.id), !like);
    queryClient.setQueryData(ideaKeys.detail(ideaId), previousIdea);

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
