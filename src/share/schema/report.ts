import { z } from "zod";

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

export const reportDevelopmentMemoFormSchema = reportBaseFormSchema.and(
  z.object({ targetMemoUrl: z.string() })
);

export type ReportDevelopmentMemoForm = z.infer<
  typeof reportDevelopmentMemoFormSchema
>;
