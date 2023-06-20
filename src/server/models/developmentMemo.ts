import { Prisma } from "@prisma/client";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type DevelopmentMemo = {
  id: string;
  developmentId: string;
  memo: string;
  fromUser: { id: string; name: string | null; imageUrl: string | null };
  parentMemoId: string | null;
  createdAt: Date;
};

const developmentMemoArgs = {
  select: {
    id: true,
    developmentId: true,
    memo: true,
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
    memo: raw.memo,
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
export const findManyDevelopmentMemo = async (
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
