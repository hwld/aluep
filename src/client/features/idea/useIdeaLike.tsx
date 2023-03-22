import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { Idea } from "../../../server/models/idea";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { useSessionQuery } from "../session/useSessionQuery";
import { ideaQueryKey } from "./useIdeaQuery";

// ideaQueryKeyが無効になった時には、ideaLikedQueryKeyが変更されている可能性がある?
export const ideaLikedQueryKey = (
  ideaId: string,
  loggedInUserId: string | undefined
) => [...ideaQueryKey(ideaId), "user", loggedInUserId ?? "", "liked"];

// ログインユーザーと指定されたお題とのいいね状況
export const useIdeaLike = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { session } = useSessionQuery();

  const { data: likedByLoggedInUser } = useQuery({
    queryKey: ideaLikedQueryKey(ideaId, session?.user.id),
    queryFn: () => {
      return trpc.idea.isLikedByLoggedInUser.query({ ideaId });
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
      queryClient.invalidateQueries(ideaQueryKey(ideaId));
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
      queryClient.invalidateQueries(ideaQueryKey(ideaId));
    },
  });

  /** 楽観的更新のためにキャッシュを操作する */
  const optimisticUpdate = async ({ like }: { like: boolean }) => {
    await queryClient.cancelQueries(ideaQueryKey(ideaId));

    // お題(いいね数を含む)
    const previousIdea = queryClient.getQueryData<Idea>(ideaQueryKey(ideaId));

    // いいねを反映させる
    queryClient.setQueryData<boolean>(
      ideaLikedQueryKey(ideaId, session?.user.id),
      () => like
    );

    // いいね数を変える
    queryClient.setQueryData<Idea>(ideaQueryKey(ideaId), (old) => {
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
    queryClient.setQueryData(
      ideaLikedQueryKey(ideaId, session?.user.id),
      !like
    );
    queryClient.setQueryData(ideaQueryKey(ideaId), previousIdea);

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
