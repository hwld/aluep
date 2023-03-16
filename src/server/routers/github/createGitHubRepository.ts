import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { GitHubErrors } from "../../../share/errors";
import { repositoryFormSchema } from "../../../share/schema";
import { assertNever } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

type Params = {
  repositoryName: string;
  repositoryDescription: string;
  userId: string;
};
type Result =
  | { success: true; githubRepositoryUrl: string }
  | {
      success: false;
      error: "UNAUTHORIZED" | "NAME_ALREADY_EXISTS" | "SERVER_ERROR";
    };
export const createGitHubRepository = async ({
  repositoryName,
  repositoryDescription,
  userId,
}: Params): Promise<Result> => {
  // アクセストークンを取得する
  const account = await db.account.findFirst({
    where: { userId: userId, provider: "github" },
  });
  if (!account) {
    return { success: false, error: "SERVER_ERROR" };
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
      return { success: false, error: "UNAUTHORIZED" };
    case 422:
      return { success: false, error: "NAME_ALREADY_EXISTS" };
    case 201:
      break;
    default:
      return { success: false, error: "SERVER_ERROR" };
  }

  const json = await response.json();
  const parseRepoUrlResult = z.string().safeParse(json.html_url);
  if (!parseRepoUrlResult.success) {
    return { success: false, error: "SERVER_ERROR" };
  }

  return { success: true, githubRepositoryUrl: parseRepoUrlResult.data };
};

export const createGitHubRepositoryRoute = requireLoggedInProcedure
  .input(repositoryFormSchema)
  .mutation(async ({ input, ctx }) => {
    const createResult = await createGitHubRepository({
      repositoryName: input.repoName,
      repositoryDescription: input.repoDescription,
      userId: ctx.session.user.id,
    });

    if (!createResult.success) {
      switch (createResult.error) {
        case "UNAUTHORIZED":
          throw new TRPCError({ code: "UNAUTHORIZED" });
        case "NAME_ALREADY_EXISTS":
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: GitHubErrors.NAME_ALREADY_EXISTS,
          });
        case "SERVER_ERROR":
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        default:
          assertNever(createResult.error);
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    return { repoUrl: createResult.githubRepositoryUrl };
  });
