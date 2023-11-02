import { DevMemo } from "@/models/devMemo";
import { FindManyArgs } from "@/server/finders";
import { db } from "@/server/lib/prismadb";
import { Prisma } from "@prisma/client";

const devMemoArgs = {
  select: {
    id: true,
    developmentId: true,
    text: true,
    fromUser: { select: { id: true, name: true, image: true } },
    parentMemoId: true,
    createdAt: true,
  },
} satisfies Prisma.DevelopmentMemoDefaultArgs;

const convertDevMemo = (
  raw: Prisma.DevelopmentMemoGetPayload<typeof devMemoArgs>
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
    parentMemoId: raw.parentMemoId,
    createdAt: raw.createdAt,
  };
};

type FindDevMemosArgs = FindManyArgs<"developmentMemo">;

export const findManyDevMemos = async (
  args: FindDevMemosArgs
): Promise<DevMemo[]> => {
  const rawMemos = await db.developmentMemo.findMany({
    ...devMemoArgs,
    ...args,
    orderBy: { createdAt: "asc" },
  });

  const memos = rawMemos.map((raw) => convertDevMemo(raw));

  return memos;
};
