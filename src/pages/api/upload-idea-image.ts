import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { uploadImage } from "@/server/lib/googleStorage";
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

  const { imageUrl } = await uploadImage({
    req,
    imageName: "image",
    userId: session.user.id,
    type: "idea-image",
  });

  res.json({
    status: "ok",
    imageUrl,
  });
};

export default handler;
