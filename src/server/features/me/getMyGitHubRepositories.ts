import { requireLoggedInProcedure } from "@/server/lib/trpc";

export const getMyGitHubRepositories = requireLoggedInProcedure.query(
  async () => {
    // const loggedInUserId = ctx.session.user.id;
    // // GitHubのアクセストークンを取得する
    // const account = await db.account.findFirst({
    //   where: { userId: loggedInUserId, provider: "github" },
    // });
    // if (!account?.access_token) {
    //   throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    // }
    // const repositories = await fetchGitHubRepositories({
    //   accessToken: account.access_token,
    // });
    // return repositories;
    return [];
  }
);
