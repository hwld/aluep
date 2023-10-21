import { File, GetFilesResponse, Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import internal from "stream";

const createFile = (
  type: GCSFileType,
  userId: string
): { file: File; writableStream: internal.Writable } => {
  const filePath = _generateFilePath({ type, userId });
  const file = _uploadBucket.file(filePath);
  const writableStream = file.createWriteStream();

  return { file, writableStream };
};

const setFileMetaData = async (
  file: File,
  { mimetype, ext }: { mimetype: string | null; ext: string }
) => {
  await file.setMetadata({
    cacheControl: "no-cache",
    contentType: mimetype ?? undefined,
  });
  await file.rename(`${file.name}${ext}`);

  return { renamedFileUrl: `${_bucketPath}/${file.name}${ext}` };
};

const getFiles = async (
  type: GCSFileType,
  userId: string
): Promise<GetFilesResponse> => {
  return _uploadBucket.getFiles({
    delimiter: "/",
    prefix: _generateGcsPrefix({ type, userId }),
  });
};

const deleteFile = async (url: string, userId: string) => {
  if (!isUploadedFileUrl(url, userId)) {
    throw new Error();
  }

  const filePath = url.split(`${_bucketPath}/`)[1];
  return _uploadBucket.file(filePath).delete();
};

const isUploadedFileUrl = (url: string, userId: string) => {
  return url.startsWith(`${_bucketPath}/${userId}`);
};

export type GCSFileType = "avatar" | "idea-image";

export const GCS = {
  createFile,
  setFileMetaData,
  getFiles,
  deleteFile,
  isUploadedFileUrl,
};

const _gcs = new Storage(
  process.env.NODE_ENV === "development"
    ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
    : { keyFilename: "/gcs/key.json" }
);

const _uploadBucket = _gcs.bucket("aluep-user-upload");
const _bucketPath = `${_gcs.apiEndpoint}/${_uploadBucket.name}`;

const _generateFilePath = (opts: {
  type: GCSFileType;
  userId: string;
}): string => {
  const prefix = _generateGcsPrefix(opts);

  const { type } = opts;
  switch (type) {
    case "avatar":
      return `${prefix}avatar`;
    case "idea-image":
      return `${prefix}${randomUUID()}`;
    default:
      throw new Error(type satisfies never);
  }
};

export const _generateGcsPrefix = ({
  type,
  userId,
}: {
  type: GCSFileType;
  userId: string;
}) => {
  const userDirectoryPath = `${userId}/`;

  switch (type) {
    case "avatar":
      return `${userDirectoryPath}`;
    case "idea-image":
      return `${userDirectoryPath}idea-image/`;
    default:
      throw new Error(type satisfies never);
  }
};
