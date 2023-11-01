import { DevMemo } from "@/models/devMemo";
import { DbArgs, DbPayload, __new_db__ } from "@/server/lib/db";

type FindManyArgs = DbArgs<"developmentMemos", "findMany">;
const devMemoArgs = {
  with: { fromUser: { columns: { id: true, name: true, image: true } } },
} satisfies FindManyArgs;

const convertDevMemo = (
  raw: DbPayload<
    typeof __new_db__.query.developmentMemos.findFirst<typeof devMemoArgs>
  >
): DevMemo => {
  return {
    id: raw.id,
    devId: raw.developmentId,
    text: raw.text,
    fromUser: {
      id: raw.fromUser.id,
      name: raw.fromUser.name,
      imageUrl: raw.fromUser.image,
    },
    parentMemoId: raw.parentCommentId,
    createdAt: new Date(raw.createdAt),
  };
};

export const findManyDevMemos = async (
  args: FindManyArgs
): Promise<DevMemo[]> => {
  const raws = await __new_db__.query.developmentMemos.findMany({
    ...args,
    ...devMemoArgs,
  });

  const memos = raws.map((r) => convertDevMemo(r));
  return memos;
};
