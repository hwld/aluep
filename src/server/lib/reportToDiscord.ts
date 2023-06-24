import {
  ReportDevelopmentInput,
  ReportDevelopmentMemoInput,
  ReportIdeaCommentInput,
  ReportIdeaInput,
  ReportUserInput,
} from "@/models/report";
import { Routes } from "@/share/routes";
import { OmitStrict } from "@/types/OmitStrict";
import { APIEmbed, APIEmbedField, WebhookClient } from "discord.js";
import { IncomingMessage } from "http";

type ReportedUser = { url: string; name: string } | undefined;
export const buildReportedUser = (
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  },
  user?: { id: string; name?: string | undefined | null } | undefined
): ReportedUser => {
  return user
    ? {
        url: `${req.headers.origin}${Routes.user(user.id)}`,
        name: user.name || "不明なユーザー名",
      }
    : undefined;
};

type Args = {
  reportedUser: ReportedUser;
} & (
  | { type: "idea"; report: ReportIdeaInput }
  | { type: "development"; report: ReportDevelopmentInput }
  | { type: "ideaComment"; report: ReportIdeaCommentInput }
  | { type: "user"; report: ReportUserInput }
  | { type: "developmentMemo"; report: ReportDevelopmentMemoInput }
);

const buildEmbedFields = ({
  type,
  report,
}: OmitStrict<Args, "reportedUser">): {
  color: number;
  title: string;
  targetField: APIEmbedField;
} => {
  switch (type) {
    case "idea": {
      return {
        title: "お題の通報",
        color: 0xef4444,
        targetField: {
          name: ":notepad_spiral: 通報対象のお題",
          value: `[${report.targetIdea.title}](${report.targetIdea.url})`,
        },
      };
    }
    case "development": {
      return {
        title: "開発情報の通報",
        color: 0x3b82f6,
        targetField: {
          name: ":detective: 通報対象の開発情報",
          value: `[${report.targetDeveloepr.name ?? "不明なユーザー名"}](${
            report.targetDeveloepr.url
          })`,
        },
      };
    }
    case "ideaComment": {
      return {
        title: "お題コメントの通報",
        color: 0xfacc15,
        targetField: {
          name: ":speech_left: 通報対象のお題コメント",
          value: `[通報対象のコメントへのリンク](${report.targetCommentUrl})`,
        },
      };
    }
    case "user": {
      return {
        title: "ユーザーの通報",
        color: 0x22c55e,
        targetField: {
          name: ":detective: 通報対象のユーザー",
          value: `[${report.targetUser.name}](${report.targetUser.url})`,
        },
      };
    }
    case "developmentMemo": {
      return {
        title: "開発メモの通報",
        color: 0xd946ef,
        targetField: {
          name: ":tools: 通報対象の開発メモ",
          value: `[通報対象のメモへのリンク](${report.targetMemoUrl})`,
        },
      };
    }
  }
};

export const reportToDiscord = async (args: Args) => {
  const { report, reportedUser } = args;
  const { title, color, targetField: field } = buildEmbedFields(args);

  const webhookClient = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL || "",
  });

  const embed: APIEmbed = {
    title: title,
    color: color,
    fields: [
      {
        name: ":adult: 通報者",
        value: reportedUser
          ? `[${reportedUser.name}](${reportedUser.url})`
          : "未ログインユーザー",
        inline: false,
      },
      field,
      {
        name: ":triangular_flag_on_post: 通報内容",
        value: report.reportDetail,
        inline: false,
      },
    ],
  };

  await webhookClient.send({
    embeds: [embed],
  });
};
