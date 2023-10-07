import { Storage } from "@google-cloud/storage";
import formidable from "formidable";
import { NextApiRequest } from "next";
import path from "path";

const storage = new Storage(
  process.env.NODE_ENV === "development"
    ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
    : { keyFilename: "/gcs/key.json" }
);

type UploadAvatar = (
  req: NextApiRequest,
  loggedInUserId: string
) => Promise<string>;

export const uploadAvatar: UploadAvatar = async (req, loggedInUserId) => {
  const bucket = storage.bucket("aluep-user-upload");
  const filePath = `avatars/${loggedInUserId}`;
  const file = bucket.file(filePath);
  const writableStream = file.createWriteStream();

  const form = formidable({ fileWriteStreamHandler: () => writableStream });

  const { mimeType, ext } = await new Promise<{
    mimeType: string | null;
    ext: string;
  }>((resolve, reject) => {
    form.parse(req, (error, _, files) => {
      if (!Object.hasOwn(files, "avatar") || !files.avatar) {
        reject(new Error("avatar not specified"));
        return;
      }

      const icon = files.avatar[0];
      const ext = path.extname(icon.originalFilename || "");
      resolve({ mimeType: icon.mimetype, ext });
    });
  });

  await file.setMetadata({
    cacheControl: "no-cache",
    contentType: mimeType ?? undefined,
  });
  await file.rename(`${filePath}${ext}`);

  return `${storage.apiEndpoint}/${bucket.name}/${filePath}${ext}`;
};
