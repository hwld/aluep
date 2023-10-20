import {
  gcsBucketPath,
  gcsUploadBucket,
  generateGcsFilePath,
  UploadImageType,
} from "@/server/services/gcs";
import formidable from "formidable";
import { NextApiRequest } from "next";
import path from "path";

type UploadImageOptions = {
  req: NextApiRequest;
  userId: string;
  imageName: string;
  type: UploadImageType;
};

export const uploadImage = async (
  opts: UploadImageOptions
): Promise<{ imageUrl: string }> => {
  const filePath = generateGcsFilePath(opts);
  const file = gcsUploadBucket.file(filePath);
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

  return { imageUrl: `${gcsBucketPath}/${filePath}${ext}` };
};
