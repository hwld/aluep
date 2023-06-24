import { z } from "zod";
import { pagingSchema } from "./util";

export const ideaFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください。")
    .max(50, "タイトルは50文字以下で入力してください。"),
  descriptionHtml: z
    .string()
    // htmlを受け取るので、文字数を指定するのは難しそうなのでとりあえず
    .max(10000, "もう少し短い説明を入力してください。")
    // htmlタグの最後の文字(>)のあとにhtmlタグの最初の文字(<)が来ていなければ文字が入力されているとみなす
    .refine((value) => />[^<]/.test(value), "お題の説明を入力してください。"),
  tags: z
    .array(z.string().min(1).max(100))
    .max(50, "タグは最大50個までしかつけることができません。"),
});
export type IdeaFormData = z.infer<typeof ideaFormSchema>;

// 更新するときにはidが必要なのでお題のフォームにそれを追加する
export const ideaUpdateFormSchema = z
  .object({ ideaId: z.string().min(1).max(100) })
  .and(ideaFormSchema);

// お題の並び順
export const ideaOrderSchema = z.union([
  z.literal("createdDesc"),
  z.literal("createdAsc"),
  z.literal("likeDesc"),
  z.literal("developmentDesc"),
]);
export type IdeaOrder = z.infer<typeof ideaOrderSchema>;

// お題の期間
export const ideaPeriodSchema = z.union([
  z.literal("all"),
  z.literal("monthly"),
]);
export type IdeaPeriod = z.infer<typeof ideaPeriodSchema>;

/** お題検索画面用のスキーマ */
export const searchIdeaPageSchema = z.object({
  keyword: z.string().default(""),
  tagIds: z
    .string()
    .or(z.array(z.string()))
    .transform((v) => (typeof v === "string" ? [v] : v))
    .default([]),
  order: ideaOrderSchema.default("createdDesc"),
  period: ideaPeriodSchema.default("all"),
  page: pagingSchema.default(1),
});
