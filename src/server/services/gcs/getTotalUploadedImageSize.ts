import { getUploadedImages } from "@/server/services/gcs/getUploadedImages";

type GetTotalUploadedImageSizeOptions = { userId: string };
export const getTotalUploadedImageSize = async ({
  userId,
}: GetTotalUploadedImageSizeOptions): Promise<number> => {
  const images = await getUploadedImages({ userId, type: "idea-image" });

  return images.reduce((sum, file) => {
    return sum + file.size;
  }, 0);
};
