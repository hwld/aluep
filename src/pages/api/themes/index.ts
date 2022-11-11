import { NextApiHandler } from "next";
import { getLoggedInUser } from "../../../server/session";

// お題の投稿用API
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const user = await getLoggedInUser(req, res);
  return res.status(200).end();
};
export default handler;
