import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import {} from "next-auth/middleware";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

// プロフィールの更新用API
// TODO: csrf対策をしたほうが良い？
// TODO: session関連を別の関数に分離させたいけど、mutableなresを取りまわすのが怖い・・・
// TODO: tRPCとか入れたほうがやりやすいか？
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.status(405).end();
    return;
  }

  // セッション情報を取得
  const session = await unstable_getServerSession(req, res, authOptions);

  // ログインユーザーではない場合
  const sessoinUser = session?.user;
  if (sessoinUser === undefined) {
    res.status(403).end();
    return;
  }

  // ログインユーザーが存在しない場合
  const user = await prisma.user.findUnique({ where: { id: sessoinUser?.id } });
  if (user === null) {
    res.status(403).end();
    return;
  }

  if (req.method === "PUT") {
    const { name } = req.body;
    const newUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    res.status(200).json({ name: newUser.name, image: newUser.image });
    return;
  }

  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id: user.id } });
    res.status(200).end();
    return;
  }
};

export default handler;
