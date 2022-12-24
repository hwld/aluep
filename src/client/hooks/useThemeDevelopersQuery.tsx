import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { showErrorNotification } from "../utils";
import { themeDevelopersQueryKey } from "./usePaginatedDeveloperQueery";

// TODO: いいねするだけのhookにする
export const useThemeDevelopersQuery = (themeId: string) => {
  const queryClient = useQueryClient();

  const likeDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["like"]) => {
      return trpc.themeDeveloper.like.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themeDevelopersQueryKey(themeId));
    },
    onError: () => {
      showErrorNotification({
        title: "開発者へのいいね",
        message: "開発者にいいねできませんでした。",
      });
    },
  });

  return { likeDeveloperMutation };
};
