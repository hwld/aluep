import { developmentMemoKeys } from "@/client/features/devMemo/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { RouterInputs } from "@/server/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

type DevelopmentMemoThreads = {
  rootMemo: DevelopmentMemo;
  /** 前の要素が次の要素の親になっている。 */
  children: DevelopmentMemo[];
};

type UseDevelopmentMemoArgs = { developmentId: string };
export const useDevMemos = ({ developmentId }: UseDevelopmentMemoArgs) => {
  const queryClient = useQueryClient();

  const { data: developmentMemos } = useQuery({
    queryKey: developmentMemoKeys.listByDevelopment(developmentId),
    queryFn: () => {
      return __trpc_old.developmentMemo.getAll.query({ developmentId });
    },
    initialData: [],
  });

  const developmentMemoThreads = useMemo(() => {
    if (!developmentMemos) {
      return [];
    }

    const roots = developmentMemos.filter((memo) => memo.parentMemoId === null);
    return roots.map((root): DevelopmentMemoThreads => {
      const children: DevelopmentMemo[] = [];
      let parentMemoId: string = root.id;

      while (true) {
        const child = developmentMemos.find(
          (memo) => memo.parentMemoId === parentMemoId
        );

        if (!child) {
          break;
        }

        children.push(child);
        parentMemoId = child.id;
      }

      return { rootMemo: root, children: children };
    });
  }, [developmentMemos]);

  const createMemoMutation = useMutation({
    mutationFn: async (data: RouterInputs["developmentMemo"]["create"]) => {
      return __trpc_old.developmentMemo.create.mutate(data);
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
      return __trpc_old.developmentMemo.delete.mutate(data);
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

  return {
    developmentMemoThreads,
    createMemoMutation,
    deleteMemoMutation,
  };
};
