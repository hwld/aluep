import { DevStatus } from "@/models/developmentStatus";
import { z } from "zod";

export type Development = {
  id: string;
  ideaId: string;
  ideaTitle: string;
  developer: { id: string; name: string | null; imageUrl: string | null };
  githubUrl: string;
  comment: string;
  developedItemUrl: string;
  likes: number;
  likedByLoggedInUser: boolean;
  createdAt: string;
  updatedAt: string;
  status: DevStatus;
  allowOtherUserMemos: boolean;
};
const DevelopmentFields = {
  comment: { maxLength: 300 },
  repoUrl: { maxLength: 120 },
};
const { comment, repoUrl } = DevelopmentFields;

export const developmentFormSchema = z.object({
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
  developmentStatusId: z
    .string({
      required_error: "開発状況を入力してください。",
    })
    .min(1, "開発状況を入力してください。"),
});

export type DevelopmentFormData = z.infer<typeof developmentFormSchema>;

export const createDevelopmentInputSchema = developmentFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100) })
);
export const updateDevelopmentInputSchema = developmentFormSchema.and(
  z.object({ ideaId: z.string().min(1).max(100), developmentId: z.string() })
);

export type DevelopedData =
  | { developed: false }
  | { developed: true; developmentId: string };
