import { z } from "zod";

// お題のフォームデータ
export const themeFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください。")
    .max(50, "タイトルは50文字以下で入力してください。"),
  descriptionHtml: z
    .string()
    .min(1, "説明を入力してください。")
    // htmlを受け取るので、文字数を指定するのは難しそうなのでとりあえず
    .max(10000, "もう少し短い説明を入力してください。"),
  tags: z
    .array(z.string().min(1).max(100))
    .max(50, "タグは最大50個までしかつけることができません。"),
});
export type ThemeFormData = z.infer<typeof themeFormSchema>;

export const themeCommentFormSchema = z.object({
  themeId: z.string().min(1),
  comment: z
    .string()
    .min(1, "コメントを入力してください。")
    .max(2000, "コメントは2000文字以下で入力してください"),
  inReplyToCommentId: z.string().min(1).optional(),
});
export type ThemeCommentFormData = z.infer<typeof themeCommentFormSchema>;

// 更新するときにはidが必要なのでお題のフォームにそれを追加する
export const themeUpdateFormSchema = z
  .object({ themeId: z.string().min(1).max(100) })
  .and(themeFormSchema);
export type ThemeJoinFormData = z.infer<typeof themeJoinFormSchema>;

export const themeJoinFormSchema = z.object({
  themeId: z.string().min(1).max(100),
  githubUrl: z
    .string()
    .min(1, "リポジトリのURLを入力してください。")
    .max(120, "リポジトリのURLは120文字以下で入力してください。")
    .regex(
      /^https:\/\/github.com\/[^\/]+\/[^\/\?&]+$/,
      "https://から始まる有効なGitHubリポジトリのURLを入力してください。"
    ),
  comment: z
    .string()
    .max(300, "コメントは300文字以下で入力してください。")
    .optional(),
});

export type JoinData =
  | { joined: false }
  | { joined: true; developerId: string };

// お題の並び順
export const themeOrderSchema = z.union([
  z.literal("createdDesc"),
  z.literal("createdAsc"),
  z.literal("likeDesc"),
  z.literal("developerDesc"),
]);
export type ThemeOrder = z.infer<typeof themeOrderSchema>;

// お題の期間
export const themePeriodSchema = z.union([
  z.literal("all"),
  z.literal("monthly"),
]);
export type ThemePeriod = z.infer<typeof themePeriodSchema>;

// プロフィールのフォームデータ
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名を入力してください。")
    .max(50, "ユーザー名は50文字以内で入力してください。"),
  profile: z.string().max(200, "自己紹介文は200文字以内で入力してください。"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const pageSchema = z
  .string()
  .optional()
  .transform((page) => {
    const p = Number(page);
    if (isNaN(p)) {
      return 1;
    }
    return p;
  });

export const repositoryFormSchema = z.object({
  repoName: z
    .string()
    .min(1, "リポジトリ名を入力して下さい。")
    .max(30, "リポジトリ名は30文字以下で入力してください。"),
  repoDescription: z.string().max(200, "説明は200文字以下で入力してください。"),
});
export type RepositoryFormData = z.infer<typeof repositoryFormSchema>;

///////////////////////////////////////////////////////////////////////////////////
// 通報関連

export const reportBaseFormSchema = z.object({
  reportDetail: z
    .string()
    .min(1, "通報の内容を入力してください。")
    .max(2000, "通報の内容は2000文字以下で入力してください。"),
});
export type ReportBaseForm = z.infer<typeof reportBaseFormSchema>;

export const reportThemeFormSchema = reportBaseFormSchema.and(
  z.object({ targetTheme: z.object({ url: z.string(), title: z.string() }) })
);
export type ReportThemeForm = z.infer<typeof reportThemeFormSchema>;

export const reportThemeCommentFormSchema = reportBaseFormSchema.and(
  z.object({ targetCommentUrl: z.string() })
);
export type ReportThemeFormComment = z.infer<
  typeof reportThemeCommentFormSchema
>;

export const reportDeveloperFormSchema = reportBaseFormSchema.and(
  z.object({
    targetDeveloepr: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportDeveloperForm = z.infer<typeof reportDeveloperFormSchema>;

export const reportUserSchema = reportBaseFormSchema.and(
  z.object({
    targetUser: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportUserForm = z.infer<typeof reportUserSchema>;
