import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import formidable from "formidable";
import { NextApiRequest } from "next";
import path from "path";

const storage = new Storage(
  process.env.NODE_ENV === "development"
    ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
    : { keyFilename: "/gcs/key.json" }
);

const uploadBucket = storage.bucket("aluep-user-upload");
const bucketPath = `${storage.apiEndpoint}/${uploadBucket.name}`;

const extractFilePathFromUrl = (filePath: string) => {
  return filePath.split(`${bucketPath}/`)[1];
};

type UploadImageType = "avatar" | "idea-image";

type UploadImageOptions = {
  req: NextApiRequest;
  userId: string;
  imageName: string;
  type: UploadImageType;
};

export const uploadImage = async (
  opts: UploadImageOptions
): Promise<{ imageUrl: string }> => {
  const filePath = generateFilePath(opts);
  const file = uploadBucket.file(filePath);
  const writableStream = file.createWriteStream();

  const form = formidable({ fileWriteStreamHandler: () => writableStream });

  const { mimeType, ext } = await new Promise<{
    mimeType: string | null;
    ext: string;
  }>((resolve, reject) => {
    form.parse(opts.req, (_, __, files) => {
      const imageFile = files[opts.imageName];
      if (!Object.hasOwn(files, opts.imageName) || !imageFile) {
        reject(new Error(`${opts.imageName} not specified`));
        return;
      }

      const image = imageFile[0];
      const ext = path.extname(image.originalFilename || "");
      resolve({ mimeType: image.mimetype, ext });
    });
  });

  await file.setMetadata({
    cacheControl: "no-cache",
    contentType: mimeType ?? undefined,
  });
  await file.rename(`${filePath}${ext}`);

  return { imageUrl: `${bucketPath}/${filePath}${ext}` };
};

const generateFilePath = ({ type, userId }: UploadImageOptions): string => {
  switch (type) {
    case "avatar":
      return `${userId}/avatar`;
    case "idea-image":
      return `${userId}/idea-image/${randomUUID()}`;
    default:
      throw new Error(type satisfies never);
  }
};

type UploadAvatar = (
  req: NextApiRequest,
  loggedInUserId: string
) => Promise<string>;

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl.startsWith(`${bucketPath}/`)) {
    return;
  }

  const filePath = extractFilePathFromUrl(imageUrl);
  await uploadBucket.file(filePath).delete();
};
