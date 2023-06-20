import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { developmentMemoKeys } from "./queryKeys";

type UseDevelopmentMemoArgs = { developmentId: string };
export const useDevelopmentMemos = ({
  developmentId,
}: UseDevelopmentMemoArgs) => {
  const queryClient = useQueryClient();

  const { data: developmentMemos } = useQuery({
    queryKey: developmentMemoKeys.listByDevelopment(developmentId),
    queryFn: () => {
      return trpc.developmentMemo.getAll.query({ developmentId });
    },
  });

  const createMemoMutation = useMutation({
    mutationFn: async (data: RouterInputs["developmentMemo"]["create"]) => {
      return trpc.developmentMemo.create.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        developmentMemoKeys.listByDevelopment(developmentId)
      );
    },
    onError: () => {
      showErrorNotification({
        title: "開発メモの作成",
        message: "開発メモを作成できませんでした。",
      });
    },
  });

  const deleteMemoMutation = useMutation({
    mutationFn: (data: RouterInputs["developmentMemo"]["delete"]) => {
      return trpc.developmentMemo.delete.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        developmentMemoKeys.listByDevelopment(developmentId)
      );
    },
    onError: () => {
      showErrorNotification({
        title: "メモの削除",
        message: "メモを削除できませんでした。",
      });
    },
  });

  return { developmentMemos, createMemoMutation, deleteMemoMutation };
};
