import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { getTotalUploadedImageSize as _getTotalUploadedImageSize } from "@/server/services/googleStorage/getTotalUploadedImageSize";

export const getTotalUploadedImageSize = requireLoggedInProcedure.query(
  async ({ ctx }) => {
    const totalUploaded = await _getTotalUploadedImageSize({
      userId: ctx.session.user.id,
    });

    return { totalSize: totalUploaded };
  }
);
