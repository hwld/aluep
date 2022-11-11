import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { prisma } from "./prismadb";

// ログインしているユーザーを取得する
export const getLoggedInUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | undefined> => {
  // セッション情報を取得
  const session = await unstable_getServerSession(req, res, authOptions);

  // ログインしていない場合
  const sessoinUser = session?.user;
  if (sessoinUser === undefined) {
    return;
  }

  // ログインユーザーが存在しない場合
  const user = await prisma.user.findUnique({ where: { id: sessoinUser?.id } });
  if (user === null) {
    return;
  }

  return user;
};
