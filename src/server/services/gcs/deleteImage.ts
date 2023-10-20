import {
  extractGcsFilePathFromUrl,
  gcsBucketPath,
  gcsUploadBucket,
} from "@/server/services/gcs";

type DeleteImageOptiosn = { imageUrl: string; loggedInUserId: string };
export const deleteImage = async ({
  imageUrl,
  loggedInUserId,
}: DeleteImageOptiosn) => {
  if (!imageUrl.startsWith(`${gcsBucketPath}/${loggedInUserId}`)) {
    throw new Error("not allowed");
  }

  const filePath = extractGcsFilePathFromUrl(imageUrl);
  await gcsUploadBucket.file(filePath).delete();
};
