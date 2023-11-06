import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { DevMemo } from "@/models/devMemo";
import { useMemo } from "react";

type DevMemoThreads = {
  rootMemo: DevMemo;
  /** 前の要素が次の要素の親になっている。 */
  children: DevMemo[];
};

type UseDevMemoArgs = { devId: string };
export const useDevMemos = ({ devId }: UseDevMemoArgs) => {
  const { data: devMemos } = trpc.devMemo.getAll.useQuery(
    { devId: devId },
    { initialData: [] }
  );

  const devMemoThreads = useMemo(() => {
    if (!devMemos) {
      return [];
    }

    const roots = devMemos.filter((memo) => memo.parentMemoId === null);
    return roots.map((root): DevMemoThreads => {
      const children: DevMemo[] = [];
      let parentMemoId: string = root.id;

      while (true) {
        const child = devMemos.find(
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
  }, [devMemos]);

  const createMemoMutation = useMutationWithNotification(trpc.devMemo.create, {
    errorNotification: {
      title: "開発メモの作成",
      message: "開発メモを作成できませんでした。",
    },
  });

  const deleteMemoMutation = useMutationWithNotification(trpc.devMemo.delete, {
    errorNotification: {
      title: "メモの削除",
      message: "メモを削除できませんでした。",
    },
  });

  return {
    devMemoThreads,
    createMemoMutation,
    deleteMemoMutation,
  };
};
