import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { uploadAvatar } from "../../server/lib/uploadAvatar";
import { prisma } from "../../server/prismadb";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }

  const avatarUrl = await uploadAvatar(req, session.user.id);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: avatarUrl },
  });

  res.json({ status: "ok", avatarUrl });
};

export default handler;
