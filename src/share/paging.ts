import { z } from "zod";

// queryとして数字を渡せないのでGSSP用にstring()を追加する
// URLのパース以外では手動で文字列を渡さないようにする。
// TODO: coerce使えば入力をnumberに制限しながら、stringが渡ってきたときもNumber(string)でnumberにできそう
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
