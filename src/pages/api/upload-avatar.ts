import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/server/lib/prismadb";
import { uploadImage } from "@/server/services/gcs/uploadImage";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }

  const { imageUrl: avatarUrl } = await uploadImage({
    type: "avatar",
    req,
    userId: session.user.id,
    imageName: "avatar",
  });
  await db.user.update({
    where: { id: session.user.id },
    data: { image: avatarUrl },
  });

  res.json({ status: "ok", avatarUrl });
};

export default handler;
