import { z } from "zod";

///////////////////////////////////////////////////////////////////////////////////
// フォーム

// お題のフォームデータ
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

export const ideaCommentFormSchema = z.object({
  ideaId: z.string().min(1),
  comment: z
    .string()
    .min(1, "コメントを入力してください。")
    .max(2000, "コメントは2000文字以下で入力してください。"),
  inReplyToCommentId: z.string().min(1).optional(),
});
export type IdeaCommentFormData = z.infer<typeof ideaCommentFormSchema>;

// 更新するときにはidが必要なのでお題のフォームにそれを追加する
export const ideaUpdateFormSchema = z
  .object({ ideaId: z.string().min(1).max(100) })
  .and(ideaFormSchema);

export type DevelopmentFormData = z.infer<typeof developmentFormSchema>;
export const developmentFormSchema = z
  .object({
    ideaId: z.string().min(1).max(100),
    comment: z
      .string()
      .max(300, "コメントは300文字以下で入力してください。")
      .optional(),
    developedItemUrl: z
      .string()
      .startsWith("https://", {
        message: "httpsから始まるリンクを入力してください。",
      })
      .optional(),
  })
  .and(
    z.union([
      // 同時にGitHubリポジトリを作成する
      z.object({
        type: z.literal("createRepository"),
        githubRepositoryName: z
          .string({ required_error: "リポジトリ名を入力してください。" })
          .min(1, "リポジトリ名を入力して下さい。")
          .max(30, "リポジトリ名は30文字以下で入力してください。"),
        githubRepositoryDescription: z
          .string()
          .max(200, "説明は200文字以下で入力してください。")
          .optional(),
      }),
      // すでにあるGitHubリポジトリを入力する
      z.object({
        type: z.literal("referenceRepository"),
        githubRepositoryUrl: z
          .string({ required_error: "リポジトリのURLを入力してください。" })
          .min(1, "リポジトリのURLを入力してください。")
          .max(120, "リポジトリのURLは120文字以下で入力してください。")
          .regex(
            /^https:\/\/github.com\/[^\/]+\/[^\/\?&]+$/,
            "https://から始まる有効なGitHubリポジトリのURLを入力してください。"
          ),
        developmentStatusId: z
          .string({
            required_error: "開発状況を入力してください。",
          })
          .min(1, "開発状況を入力してください。"),
      }),
    ])
  );

export const developmentMemoFormSchema = z.object({
  developmentId: z.string().min(1),
  memo: z
    .string()
    .min(1, "メモを入力してください。")
    .max(2000, "メモは2000文字以下で入力してください。"),
  parentMemoId: z.string().min(1).optional(),
});
export type DevelopmentMemoFormData = z.infer<typeof developmentMemoFormSchema>;

export const updateDevelopFormSchema = developmentFormSchema.and(
  z.object({ developmentId: z.string() })
);

/** DevelopFormのtype="createRepository"情報をURLパラメータに持たせたときに使う */
export const createRepositoryURLParamSchema = z
  .object({
    developmentComment: z.string(),
    developedItemUrl: z.string(),
    repositoryName: z.string(),
    repositoryDesc: z.string(),
  })
  .partial();
export type CreateRepositoryData = z.infer<
  typeof createRepositoryURLParamSchema
>;

export type DevelopedData =
  | { developed: false }
  | { developed: true; developmentId: string };

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

// プロフィールのフォームデータ
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(50, "ユーザー名は50文字以内で入力してください。"),
  profile: z.string().max(200, "自己紹介文は200文字以内で入力してください。"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

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

const userDetailPageTabSchema = z.union([
  z.literal("postedIdeas"),
  z.literal("developments"),
  z.literal("likedIdeas"),
  z.literal("likedDevelopments"),
]);
export type UserDetailPageTab = z.infer<typeof userDetailPageTabSchema>;

///////////////////////////////////////////////////////////////////////////////////
// ページスキーマ - ページのURLSearchParamsのためのスキーマ

/** ページングのある画面用のスキーマ */
export const paginatedPageSchema = z.object({ page: pagingSchema.default(1) });

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

/** ユーザー詳細画面用のスキーマ */
export const userDetailPageSchame = z.object({
  tab: userDetailPageTabSchema.default("postedIdeas"),
  page: pagingSchema.default(1),
});

///////////////////////////////////////////////////////////////////////////////////
// 通報フォーム

export const reportBaseFormSchema = z.object({
  reportDetail: z
    .string()
    .min(1, "通報の内容を入力してください。")
    .max(2000, "通報の内容は2000文字以下で入力してください。"),
});
export type ReportBaseForm = z.infer<typeof reportBaseFormSchema>;

export const reportIdeaFormSchema = reportBaseFormSchema.and(
  z.object({ targetIdea: z.object({ url: z.string(), title: z.string() }) })
);
export type ReportIdeaForm = z.infer<typeof reportIdeaFormSchema>;

export const reportIdeaCommentFormSchema = reportBaseFormSchema.and(
  z.object({ targetCommentUrl: z.string() })
);
export type ReportIdeaCommentForm = z.infer<typeof reportIdeaCommentFormSchema>;

export const reportDevelopmentFormSchema = reportBaseFormSchema.and(
  z.object({
    targetDeveloepr: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportDevelopmentForm = z.infer<typeof reportDevelopmentFormSchema>;

export const reportUserFormSchema = reportBaseFormSchema.and(
  z.object({
    targetUser: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportUserForm = z.infer<typeof reportUserFormSchema>;
