import { DevMemo } from "@/models/devMemo";
import { db } from "@/server/lib/prismadb";
import { OmitStrict } from "@/types/OmitStrict";
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

type FindManyDevMemoArgs = OmitStrict<
  Prisma.DevelopmentMemoFindManyArgs,
  "select" | "include" | "orderBy"
>;
export const findManyDevMemos = async (args: FindManyDevMemoArgs) => {
  const rawMemos = await db.developmentMemo.findMany({
    orderBy: { createdAt: "asc" },
    ...devMemoArgs,
    ...args,
  });

  const memos = rawMemos.map((raw) => convertDevMemo(raw));

  return memos;
};
