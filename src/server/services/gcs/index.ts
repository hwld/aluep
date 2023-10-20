import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

// TODO: クラスにする？

export const gcs = new Storage(
  process.env.NODE_ENV === "development"
    ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
    : { keyFilename: "/gcs/key.json" }
);

export const gcsUploadBucket = gcs.bucket("aluep-user-upload");
export const gcsBucketPath = `${gcs.apiEndpoint}/${gcsUploadBucket.name}`;

export const isGcsImage = (url: string) => {
  return url.startsWith(gcsBucketPath);
};

export type UploadImageType = "avatar" | "idea-image";

type GenerateGcsFilePathOptions = { type: UploadImageType; userId: string };
export const generateGcsFilePath = (
  opts: GenerateGcsFilePathOptions
): string => {
  const prefix = generateGcsPrefix(opts);

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

type GenerateGcsPrefixOptions = { type: UploadImageType; userId: string };
export const generateGcsPrefix = ({
  type,
  userId,
}: GenerateGcsPrefixOptions) => {
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

export const extractGcsFilePathFromUrl = (filePath: string) => {
  return filePath.split(`${gcsBucketPath}/`)[1];
};
