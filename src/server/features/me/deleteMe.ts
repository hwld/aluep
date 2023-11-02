import { userDeletePageSchema } from "@/models/user";
import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const deleteMe = requireLoggedInProcedure
  .input(userDeletePageSchema)
  .mutation(async () => {
    // const valid = await validateReCaptchaToken(reCaptchaToken);
    // if (!valid) {
    //   throw new TRPCError({ code: "BAD_REQUEST" });
    // }
    // const deleted = await db.user.delete({
    //   where: { id: ctx.session.user.id },
    // });
    // if (
    //   deleted.image &&
    //   googleStorage.isUploadedFileUrl(deleted.image, ctx.session.user.id)
    // ) {
    //   await deleteImage({
    //     imageUrl: deleted.image,
    //     loggedInUserId: ctx.session.user.id,
    //   });
    // }
    // return deleted;
  });
