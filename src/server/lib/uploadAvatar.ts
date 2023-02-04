import { Storage } from "@google-cloud/storage";
import formidable from "formidable";
import { NextApiRequest } from "next";
import path from "path";

const storage = new Storage({
  keyFilename: `${__dirname}/../../../../gcs-key.json`,
});

type UploadAvatar = (
  req: NextApiRequest,
  loggedInUserId: string
) => Promise<string>;

// 開発環境ではローカルストレージにアバター画像を保存したいから実装を切り替える
// 他に良い方法が思いつかなかった・・・
export const uploadAvatar: UploadAvatar = async (...params) => {
  if (process.env.STORAGE_TYPE === "local") {
    return await uploadAvatarOnDevelop(...params);
  } else {
    return await uploadAvatarOnProduct(...params);
  }
};

// 仮実装
const uploadAvatarOnProduct: UploadAvatar = async (req, loggedInUserId) => {
  const bucket = storage.bucket("aptose-user-upload");
  const filePath = `avatars/${loggedInUserId}`;
  const file = bucket.file(filePath);
  const writableStream = file.createWriteStream();

  const form = formidable({ fileWriteStreamHandler: () => writableStream });

  const { mimeType, ext } = await new Promise<{
    mimeType: string | null;
    ext: string;
  }>((resolve, reject) => {
    form.parse(req, (error, _, files) => {
      if (!Object.hasOwn(files, "icon")) {
        reject(new Error("icon not specified"));
      }

      const icon = files.icon as formidable.File;
      const ext = path.extname(icon.originalFilename || "");
      resolve({ mimeType: icon.mimetype, ext });
    });
  });

  await file.setMetadata({ cacheControl: "no-cache", contentType: mimeType });
  await file.rename(`${filePath}${ext}`);

  return `https://storage.googleapis.com/${bucket.name}/${filePath}${ext}`;
};

const uploadAvatarOnDevelop: UploadAvatar = async (req, loggedInUserId) => {
  return "";
};
