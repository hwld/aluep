import { z } from "zod";

export const reportBaseFormSchema = z.object({
  reportDetail: z
    .string()
    .min(1, "通報の内容を入力してください。")
    .max(2000, "通報の内容は2000文字以下で入力してください。"),
});
export type ReportBaseForm = z.infer<typeof reportBaseFormSchema>;

export const reportIdeaInputSchema = reportBaseFormSchema.and(
  z.object({ targetIdea: z.object({ url: z.string(), title: z.string() }) })
);
export type ReportIdeaInput = z.infer<typeof reportIdeaInputSchema>;

export const reportIdeaCommentInputSchema = reportBaseFormSchema.and(
  z.object({ targetCommentUrl: z.string() })
);
export type ReportIdeaCommentInput = z.infer<
  typeof reportIdeaCommentInputSchema
>;

export const reportDevelopmentInputSchema = reportBaseFormSchema.and(
  z.object({
    targetDeveloepr: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportDevelopmentInput = z.infer<
  typeof reportDevelopmentInputSchema
>;

export const reportUserInputSchema = reportBaseFormSchema.and(
  z.object({
    targetUser: z.object({
      url: z.string(),
      name: z.string().nullable().optional(),
    }),
  })
);
export type ReportUserInput = z.infer<typeof reportUserInputSchema>;

export const reportDevelopmentMemoInputSchema = reportBaseFormSchema.and(
  z.object({ targetMemoUrl: z.string() })
);

export type ReportDevelopmentMemoInput = z.infer<
  typeof reportDevelopmentMemoInputSchema
>;
