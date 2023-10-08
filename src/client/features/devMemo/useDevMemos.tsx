import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { useMemo } from "react";

type DevelopmentMemoThreads = {
  rootMemo: DevelopmentMemo;
  /** 前の要素が次の要素の親になっている。 */
  children: DevelopmentMemo[];
};

type UseDevelopmentMemoArgs = { developmentId: string };
export const useDevMemos = ({ developmentId }: UseDevelopmentMemoArgs) => {
  const utils = trpc.useContext();

  const { data: developmentMemos } = trpc.developmentMemo.getAll.useQuery(
    { developmentId },
    { initialData: [] }
  );

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

  const createMemoMutation = trpc.developmentMemo.create.useMutation({
    onError: () => {
      showErrorNotification({
        title: "開発メモの作成",
        message: "開発メモを作成できませんでした。",
      });
    },
  });

  const deleteMemoMutation = trpc.developmentMemo.delete.useMutation({
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
