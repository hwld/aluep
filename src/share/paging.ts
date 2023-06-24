import { z } from "zod";

export const pagingSchema = z
  .string()
  .or(z.number())
  .transform((page) => {
    const p = Number(page);
    if (isNaN(p) || p < 0) {
      return 1;
    }
    return p;
  });

/** ページングのある画面用のスキーマ */
export const paginatedPageSchema = z.object({ page: pagingSchema.default(1) });
