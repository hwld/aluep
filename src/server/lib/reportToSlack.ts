import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";
import { IncomingMessage } from "http";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Routes } from "../../share/routes";
import { ReportBaseForm } from "../../share/schema";

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
        url: `${req.headers.origin}/${Routes.user(user.id)}`,
        name: user.name || "不明なユーザー名",
      }
    : undefined;
};

type TemplateArgs = ReportBaseForm & {
  reportedUser: ReportedUser;
  title: string;
  fields: { name: string; value: string }[];
};
export const buildReportTemplate = ({
  title,
  reportDetail,
  reportedUser,
  fields,
}: TemplateArgs): IncomingWebhookSendArguments => {
  const sections = fields.map((field) => {
    return {
      type: "section",
      text: { type: "mrkdwn", text: `*${field.name}:* ${field.value}` },
    };
  });

  return {
    attachments: [
      {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: title,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*通報者:* ${
                reportedUser
                  ? `<${reportedUser.url}|${reportedUser.name}>`
                  : "未ログインユーザー"
              }`,
            },
          },
          ...sections,
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*通報内容:*\n${reportDetail}`,
            },
          },
        ],
      },
    ],
  };
};

export const reportToSlack = async (args: TemplateArgs) => {
  const url = process.env.SLACK_WEBHOOK_URL || "";
  const httpProxy = process.env.HTTP_PROXY;
  const proxy = httpProxy ? new HttpsProxyAgent(httpProxy) : undefined;

  const webhook = new IncomingWebhook(url, { agent: proxy });
  await webhook.send(buildReportTemplate(args));
};
