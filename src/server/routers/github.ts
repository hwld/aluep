import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prismadb";
import { requireLoggedInProcedure, router } from "../trpc";

export const githubRoute = router({
  createRepo: requireLoggedInProcedure
    .input(
      z.object({ repoName: z.string().min(1), repoDescription: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      // 認証済みユーザーのアカウント情報からアクセストークンを取得する、
      const account = await prisma.account.findFirst({
        where: { userId: ctx.loggedInUser.id, provider: "github" },
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
      const json = await result.json();

      return { repoUrl: json.html_url as string };
    }),
});
