import { z } from "zod";

export const pagingSchema = z.coerce.number().transform((page) => {
  if (isNaN(page) || page < 0) {
    return 1;
  }
  return page;
});

/** ページングのある画面用のスキーマ */
export const paginatedPageSchema = z.object({ page: pagingSchema.default(1) });
