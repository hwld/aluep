import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { GitHubErrors } from "../../../share/errors";
import { db } from "../../lib/prismadb";

type Args = {
  repositoryName: string;
  repositoryDescription: string;
  userId: string;
};

/**
 * @returns 作成したGitHubリポジトリのURLを返す
 */
export const createGitHubRepository = async ({
  repositoryName,
  repositoryDescription,
  userId,
}: Args): Promise<string> => {
  // アクセストークンを取得する
  const account = await db.account.findFirst({
    where: { userId: userId, provider: "github" },
  });
  if (!account) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  // GitHub APIを使ってPublicリポジトリを作成する。
  // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${account.access_token}`,
    },
    body: JSON.stringify({
      name: repositoryName,
      description: repositoryDescription,
      private: false,
    }),
  });

  // エラー処理
  switch (response.status) {
    case 401:
      // アクセストークンが古い場合に401を返す
      throw new TRPCError({ code: "UNAUTHORIZED" });
    case 422:
      // 422のときには名前が存在すると解釈する。他にも理由はありそうだけど
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: GitHubErrors.NAME_ALREADY_EXISTS,
      });
    case 201:
      break;
    default:
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  const json = await response.json();
  const parseRepoUrlResult = z.string().safeParse(json.html_url);
  if (!parseRepoUrlResult.success) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  return parseRepoUrlResult.data;
};
