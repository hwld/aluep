import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { getUploadedImages } from "@/server/services/gcs/getUploadedImages";

export const getAllUploadedImages = requireLoggedInProcedure.query(
  async ({ ctx }) => {
    const images = await getUploadedImages({
      type: "idea-image",
      userId: ctx.session.user.id,
    });

    return images;
  }
);
