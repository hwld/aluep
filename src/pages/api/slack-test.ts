import { IncomingWebhook } from "@slack/webhook";
import { HttpsProxyAgent } from "https-proxy-agent";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    return res.status(500).end();
  }

  const httpProxy = process.env.HTTP_PROXY;
  const proxy = httpProxy ? new HttpsProxyAgent(httpProxy) : undefined;

  const webhook = new IncomingWebhook(url, { agent: proxy });
  await webhook.send({
    text: "通報テスト\nhttps://app-theme-post-27mtrxrx4a-an.a.run.app/themes/cldwkjevq001cs601pso3wgfr",
  });
  res.status(200).end();
};

export default handler;
