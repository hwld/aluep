import { formidable } from "formidable";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
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

  const form = formidable({
    // TODO: 開発用サーバ用
    uploadDir: `${__dirname}/../../../../public/users`,
    filename: (name, ext) => {
      console.log(name, ext);
      return `${session.user.id}`;
    },
  });

  await new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      // parseに成功するとデフォルトではtmpディレクトリが保存される
      // formidableのoptionsのuploadDirで書き換えられる
      // TODO: Cloud Storageにアップロードし直したい。
      console.log(files);
      resolve(undefined);
    });
  });

  res.json({ status: "ok" });
};

export default handler;
