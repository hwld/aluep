import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export type Idea = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likes: number;
  id: string;
  title: string;
  descriptionHtml: string;
  tags: {
    id: string;
    name: string;
  }[];
  devs: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  /** 作成してから取得するまでの経過時間 */
  elapsedSinceCreation: string;
};

const IdeaFields = {
  title: {
    maxLength: 50,
  },
  descriptionHtml: {
    maxLength: 10000,
  },
};
const { title, descriptionHtml } = IdeaFields;

// TODO: 最大・最小文字数などを定数として管理したい。
export const ideaFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください。")
    .max(
      title.maxLength,
      `タイトルは${title.maxLength}文字以下で入力してください。`
    ),
  descriptionHtml: z
    .string()
    // htmlを受け取るので、文字数を指定するのは難しそうなのでとりあえず
    .max(descriptionHtml.maxLength, "もう少し短い説明を入力してください。")
    // htmlタグの最後の文字(>)のあとにhtmlタグの最初の文字(<)が来ていなければ文字が入力されているとみなす
    .refine((value) => />[^<]/.test(value), "お題の説明を入力してください。"),
  tags: z
    .array(z.string().min(1).max(100))
    .max(50, "タグは最大50個までしかつけることができません。"),
});
export type IdeaFormData = z.infer<typeof ideaFormSchema>;

export const createIdeaInputSchema = ideaFormSchema;
export const updateIdeaInputSchema = ideaFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100) })
);

// お題の並び順
export const ideaOrderSchema = z.union([
  z.literal("createdDesc"),
  z.literal("createdAsc"),
  z.literal("likeDesc"),
  z.literal("devDesc"),
]);
export type IdeaOrder = z.infer<typeof ideaOrderSchema>;

// お題の期間
export const ideaPeriodSchema = z.union([
  z.literal("all"),
  z.literal("monthly"),
]);
export type IdeaPeriod = z.infer<typeof ideaPeriodSchema>;

// お題検索画面のパラメータ
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
