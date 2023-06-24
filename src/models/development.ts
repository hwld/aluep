import { DevelopmentStatus } from "@/models/developmentStatus";
import { z } from "zod";

export type Development = {
  id: string;
  ideaId: string;
  ideaTitle: string;
  developerUserId: string;
  developerUserName: string | null;
  developerUserImage: string | null;
  githubUrl: string;
  comment: string;
  developedItemUrl: string;
  likes: number;
  likedByLoggedInUser: boolean;
  createdAt: string;
  updatedAt: string;
  status: DevelopmentStatus;
  allowOtherUserMemos: boolean;
};

export const developmentFormSchema = z
  .object({
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
export type DevelopmentFormData = z.infer<typeof developmentFormSchema>;

export const createDevelopmentInputSchema = developmentFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100) })
);
export const updateDevelopmentInputSchema = developmentFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100), developmentId: z.string() })
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
