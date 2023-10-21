import { deleteUploadedImage } from "@/server/features/uploadedImage/deleteUploadedImage";
import { getAllUploadedImages } from "@/server/features/uploadedImage/getAllUploadedImage";
import { getTotalUploadedImageSize } from "@/server/features/uploadedImage/getTotalUploadedImageSize";
import { router } from "@/server/lib/trpc";

export const uploadedImageRoute = router({
  /** アップロードした画像一覧を取得する */
  getAll: getAllUploadedImages,

  /** アップロードした画像を削除する */
  delete: deleteUploadedImage,

  /** アップロードした画像の合計サイズを取得する */
  getTotalSize: getTotalUploadedImageSize,
});
