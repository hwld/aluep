import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { deleteImage } from "@/server/services/gcs/deleteImage";
import { z } from "zod";

export const deleteUploadedImage = requireLoggedInProcedure
  .input(z.object({ imageUrl: z.string().url() }))
  .mutation(async ({ input, ctx }) => {
    await deleteImage({
      imageUrl: input.imageUrl,
      loggedInUserId: ctx.session.user.id,
    });
  });
