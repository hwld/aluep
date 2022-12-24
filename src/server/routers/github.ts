import { TRPCError } from "@trpc/server";
import { GitHubErrors } from "../../share/errors";
import { repositoryFormSchema } from "../../share/schema";
import { prisma } from "../prismadb";
import { requireLoggedInProcedure, router } from "../trpc";

export const githubRoute = router({
  createRepo: requireLoggedInProcedure
    .input(repositoryFormSchema)
    .mutation(async ({ input, ctx }) => {
      //認証済みユーザーのアカウント情報からアクセストークンを取得する、
      const account = await prisma.account.findFirst({
        where: { userId: ctx.session.user.id, provider: "github" },
      });
      if (!account) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      // GitHub APIを使って、公開リポジトリを作成する。
      const result = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${account.access_token}`,
        },
        body: JSON.stringify({
          name: input.repoName,
          description: input.repoDescription,
          private: false,
        }),
      });

      if (result.status === 401) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      } else if (result.status === 422) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: GitHubErrors.NAME_ALREADY_EXISTS,
        });
      } else if (result.status !== 201) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const json = await result.json();
      return { repoUrl: json.html_url as string };
    }),
});
