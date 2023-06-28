import { DevelopmentMemo } from "@/models/developmentMemo";
import { db } from "@/server/lib/prismadb";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";

const developmentMemoArgs = {
  select: {
    id: true,
    developmentId: true,
    text: true,
    fromUser: { select: { id: true, name: true, image: true } },
    parentMemoId: true,
    createdAt: true,
  },
} satisfies Prisma.DevelopmentMemoArgs;

const convertDevelopmentMemo = (
  raw: Prisma.DevelopmentMemoGetPayload<typeof developmentMemoArgs>
): DevelopmentMemo => {
  return {
    id: raw.id,
    developmentId: raw.developmentId,
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

type FindManyDevelopmentMemoArgs = OmitStrict<
  Prisma.DevelopmentMemoFindManyArgs,
  "select" | "include" | "orderBy"
>;
export const findManyDevelopmentMemos = async (
  args: FindManyDevelopmentMemoArgs
) => {
  const rawMemos = await db.developmentMemo.findMany({
    orderBy: { createdAt: "asc" },
    ...developmentMemoArgs,
    ...args,
  });

  const memos = rawMemos.map((raw) => convertDevelopmentMemo(raw));

  return memos;
};
