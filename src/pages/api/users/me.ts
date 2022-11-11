import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/prismadb";
import { getLoggedInUser } from "../../../server/session";

// ユーザーの更新・削除用API
// TODO: csrf対策をしたほうが良い？
// TODO: tRPCでやってみたい
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.status(405).end();
    return;
  }

  // ログインしているユーザーを取得する
  const user = await getLoggedInUser(req, res);
  if (!user) {
    res.status(403).end();
    return;
  }

  // ユーザーの更新
  if (req.method === "PUT") {
    const { name } = req.body;
    const newUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    res.status(200).json({ name: newUser.name, image: newUser.image });
    return;
  }

  // ユーザーの削除
  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id: user.id } });
    res.status(200).end();
    return;
  }
};

export default handler;
