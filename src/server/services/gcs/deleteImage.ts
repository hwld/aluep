import { GCS } from "@/server/services/gcs";

type DeleteImageOptiosn = { imageUrl: string; loggedInUserId: string };
export const deleteImage = async ({
  imageUrl,
  loggedInUserId,
}: DeleteImageOptiosn) => {
  if (!GCS.isUploadedFileUrl(imageUrl, loggedInUserId)) {
    throw new Error("not allowed");
  }

  await GCS.deleteFile(imageUrl, loggedInUserId);
};
