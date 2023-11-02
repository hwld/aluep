import { userDeletePageSchema } from "@/models/user";
import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { validateReCaptchaToken } from "@/server/lib/validateReCaptchaToken";
import { googleStorage } from "@/server/services/googleStorage";
import { deleteImage } from "@/server/services/googleStorage/deleteImage";
import { TRPCError } from "@trpc/server";

export const deleteMe = requireLoggedInProcedure
  .input(userDeletePageSchema)
  .mutation(async ({ ctx, input: { reCaptchaToken } }) => {
    const valid = await validateReCaptchaToken(reCaptchaToken);
    if (!valid) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const deleted = await db.user.delete({
      where: { id: ctx.session.user.id },
    });

    if (
      deleted.image &&
      googleStorage.isUploadedFileUrl(deleted.image, ctx.session.user.id)
    ) {
      await deleteImage({
        imageUrl: deleted.image,
        loggedInUserId: ctx.session.user.id,
      });
    }

    return deleted;
  });
