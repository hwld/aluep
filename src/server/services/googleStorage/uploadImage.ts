import { GCSFileType, googleStorage } from "@/server/services/googleStorage";
import { calcMaxUploadFileSize } from "@/server/services/googleStorage/calcMaxUploadFileSize";
import { getTotalUploadedImageSize } from "@/server/services/googleStorage/getTotalUploadedImageSize";
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
  const maxFileSize = calcMaxUploadFileSize({
    uploadedBytes: totalUploaded,
    limits: {
      totalBytes: TOTAL_UPLOAD_IMAGE_LIMIT_MB * Bytes.MB,
      fileBytes: UPLOAD_IMAGE_LIMIT_MB * Bytes.MB,
    },
  });

  const { file, writableStream } = googleStorage.createFile(
    opts.type,
    opts.userId
  );

  const form = formidable({
    maxFileSize,
    fileWriteStreamHandler: () => writableStream,
  });
  const [, files] = await form.parse(opts.req);

  const uploadedImage = files[opts.imageName]?.[0];
  if (!uploadedImage) {
    throw new Error();
  }
  const ext = path.extname(uploadedImage.originalFilename || "");

  const { renamedFileUrl } = await googleStorage.setFileMetaData(file, {
    mimetype: uploadedImage.mimetype,
    ext,
  });

  return { imageUrl: renamedFileUrl };
};
