import {
  gcsBucketPath,
  gcsUploadBucket,
  generateGcsFilePath,
  UploadImageType,
} from "@/server/services/gcs";
import { getTotalUploadedImageSize } from "@/server/services/gcs/getTotalUploadedImageSize";
import {
  Bytes,
  TOTAL_UPLOAD_IMAGE_LIMIT_MB,
  UPLOAD_IMAGE_LIMIT_MB,
} from "@/share/consts";
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
  const totalUploaded = await getTotalUploadedImageSize({
    userId: opts.userId,
  });
  const availableBytes = TOTAL_UPLOAD_IMAGE_LIMIT_MB * Bytes.MB - totalUploaded;

  let maxFileSize = UPLOAD_IMAGE_LIMIT_MB * Bytes.MB;
  if (availableBytes < maxFileSize) {
    maxFileSize = availableBytes;
  }

  const filePath = generateGcsFilePath(opts);
  const file = gcsUploadBucket.file(filePath);
  const writableStream = file.createWriteStream();

  const form = formidable({
    maxFileSize,
    fileWriteStreamHandler: () => writableStream,
  });

  let files: formidable.Files<string>;
  [, files] = await form.parse(opts.req);

  // ファイル名を変える

  const imageFile = files[opts.imageName];
  if (!imageFile) {
    throw new Error();
  }

  const image = imageFile[0];
  const ext = path.extname(image.originalFilename || "");

  await file.setMetadata({
    cacheControl: "no-cache",
    contentType: image.mimetype ?? undefined,
  });
  await file.rename(`${filePath}${ext}`);

  return { imageUrl: `${gcsBucketPath}/${filePath}${ext}` };
};
