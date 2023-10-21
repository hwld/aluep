import { GCS, GCSFileType } from "@/server/services/gcs";
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
  type: GCSFileType;
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

  const { file, writableStream } = GCS.createFile(opts.type, opts.userId);

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

  const { renamedFileUrl } = await GCS.setFileMetaData(file, {
    mimetype: image.mimetype,
    ext,
  });
  return { imageUrl: renamedFileUrl };
};
