import { devStatusSchema } from "@/models/devStatus";
import { DevelopmentStatus } from "@prisma/client";
import { z } from "zod";

export type Dev = {
  id: string;
  title: string;
  // 開発しているお題が消された場合にnullになる
  idea: { id: string; title: string } | null;
  developer: { id: string; name: string | null; imageUrl: string | null };
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
const DevFields = {
  title: { maxLength: 60 },
  comment: { maxLength: 300 },
  repoUrl: { maxLength: 120 },
};
const { title, comment, repoUrl } = DevFields;

export const devFormSchema = z.object({
  title: z
    .string()
    .min(1, "プロジェクト名を入力してください。")
    .max(
      title.maxLength,
      `プロジェクト名は${title.maxLength}文字以下で入力してください。`
    ),
  comment: z
    .string()
    .max(
      comment.maxLength,
      `コメントは${comment.maxLength}文字以下で入力してください。`
    )
    .optional(),
  developedItemUrl: z
    .string()
    .startsWith("https://", {
      message: "httpsから始まるリンクを入力してください。",
    })
    .optional()
    .or(z.literal("")),
  githubRepositoryUrl: z
    .string({ required_error: "リポジトリを選択してください。" })
    .min(1, "リポジトリを選択してください。")
    .max(
      repoUrl.maxLength,
      `リポジトリのURLは${repoUrl.maxLength}文字以下で入力してください。`
    )
    .regex(
      /^https:\/\/github.com\/[^\/]+\/[^\/\?&]+$/,
      "https://から始まる有効なGitHubリポジトリのURLを入力してください。"
    ),
  status: devStatusSchema,
});

export type DevFormData = z.infer<typeof devFormSchema>;

export const createDevInputSchema = devFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100) })
);
export const updateDevInputSchema = devFormSchema.and(
  z.object({ devId: z.string() })
);
