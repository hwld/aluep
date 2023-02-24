import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../server/lib/prismadb";
import { uploadAvatar } from "../../server/lib/uploadAvatar";
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
  await db.user.update({
    where: { id: session.user.id },
    data: { image: avatarUrl },
  });

  res.json({ status: "ok", avatarUrl });
};

export default handler;
