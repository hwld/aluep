import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { Development } from "../../../server/models/development";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { developmentKeys } from "./queryKeys";

/**
 * 開発情報詳細画面で開発情報にいいねを行う
 */
export const useDevelopmentLikeOnDetail = (developmentId: string) => {
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
        previousDevelopment: contexts?.previousDevelopment,
        like: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentKeys.detail(developmentId));
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
        previousDevelopment: contexts?.previousDevelopment,
        like: false,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(developmentKeys.detail(developmentId));
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
    await queryClient.cancelQueries(developmentKeys.detail(developmentId));

    const previousDevelopment = queryClient.getQueryData<Development>(
      developmentKeys.detail(developmentId)
    );

    queryClient.setQueryData<Development>(
      developmentKeys.detail(developmentId),
      (development): Development | undefined => {
        if (development === undefined) {
          return undefined;
        }

        return {
          ...development,
          likes: development.likes + (like ? 1 : -1),
          likedByLoggedInUser: like,
        };
      }
    );

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
    queryClient.setQueryData(
      developmentKeys.detail(developmentId),
      previousDevelopment
    );

    const action = like ? "いいね" : "いいね解除";

    showErrorNotification({
      title: `開発への${action}`,
      message: `開発への${action}ができませんでした。`,
    });
  };

  return { likeDevelopmentMutation, unlikeDevelopmentMutation };
};
