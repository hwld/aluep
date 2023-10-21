import { googleStorage } from "@/server/services/googleStorage";

type DeleteImageOptiosn = { imageUrl: string; loggedInUserId: string };
export const deleteImage = async ({
  imageUrl,
  loggedInUserId,
}: DeleteImageOptiosn) => {
  if (!googleStorage.isUploadedFileUrl(imageUrl, loggedInUserId)) {
    throw new Error("not allowed");
  }

  await googleStorage.deleteFile(imageUrl, loggedInUserId);
};
