import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../server/trpc";
import { trpc } from "../trpc";
import { themeQueryKey } from "./useThemeQuery";

//TODO: ページング

export const themeDevelopersQueryKey = (themeId: string) =>
  [...themeQueryKey(themeId), "develoeprs"] as const;

export const useThemeDevelopersQuery = (themeId: string) => {
  const queryClient = useQueryClient();

  const { data: developers, ...others } = useQuery({
    queryKey: themeDevelopersQueryKey(themeId),
    queryFn: () => {
      return trpc.theme.getAllDevelopers.query({ themeId });
    },
    initialData: [],
  });

  const likeDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["like"]) => {
      return trpc.themeDeveloper.like.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themeDevelopersQueryKey(themeId));
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "開発者へのいいね",
        message: "開発者にいいねできませんでした。",
      });
    },
  });

  return { developers, ...others, likeDeveloperMutation };
};
