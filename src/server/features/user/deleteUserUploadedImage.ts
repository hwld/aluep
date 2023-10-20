import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { deleteImage } from "@/server/services/gcs/deleteImage";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const deleteUserUploadedImage = requireLoggedInProcedure
  .input(z.object({ imageUrl: z.string().url() }))
  .mutation(async ({ input, ctx }) => {
    try {
      await deleteImage({
        imageUrl: input.imageUrl,
        loggedInUserId: ctx.session.user.id,
      });
    } catch (e) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: e });
    }
  });
