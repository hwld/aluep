import { AppRouter } from "@/server/router";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCMsw } from "msw-trpc";
import SuperJSON from "superjson";

const apiUrl = "http://localhost:6006/api/trpc";

export const mockTRPC = createTRPCReact<AppRouter>();
export const mockTRPCClient = mockTRPC.createClient({
  links: [httpLink({ url: apiUrl })],
  transformer: SuperJSON,
});

/**
 * mswのhandlerとして使用するtRPCのclient
 * 上はStorybookの上で動いているコンポーネントのtrpcをモックするが、
 * こちらはStorybookのmswのハンドラとして使用する
 */
export const trpcMsw = createTRPCMsw<AppRouter>({
  baseUrl: apiUrl,
  transformer: { output: SuperJSON, input: SuperJSON },
});

// TODO: エラーなく型を付けられなかった・・・
type InputData<Query extends any> = Parameters<
  /** @ts-ignore */
  Parameters<Parameters<Query["query"]>[0]>[2]["data"]
>[0];

// TODO: エラーなく型を付けられなかった・・・
export const mockTrpcQuery = <T>(
  route: T,
  data: InputData<T> | (() => InputData<T>)
) => {
  const query: any = (route as any).query;
  return query((req: any, res: any, ctx: any) => {
    const _data = typeof data === "function" ? (data as any)() : data;

    return res(ctx.status(200), ctx.data(_data));
  });
};

export const initialTrpcHandlers = [
  mockTrpcQuery(trpcMsw.session, null),

  mockTrpcQuery(trpcMsw.me.getMySummary, { allLikes: 10, devs: 3, ideas: 1 }),
  mockTrpcQuery(trpcMsw.me.getMyGitHubRepositories, []),

  mockTrpcQuery(trpcMsw.idea.getAllTags, []),
  mockTrpcQuery(trpcMsw.idea.search, { ideas: [], allPages: 1 }),
  mockTrpcQuery(trpcMsw.idea.getLikedIdeasByUser, { list: [], allPages: 1 }),
  mockTrpcQuery(trpcMsw.idea.getPostedIdeasByUser, { list: [], allPages: 1 }),
  mockTrpcQuery(trpcMsw.idea.getRecommendedIdeas, []),

  mockTrpcQuery(trpcMsw.ideaComment.getAll, []),

  mockTrpcQuery(trpcMsw.dev.getInProgresDevsByUser, []),
  mockTrpcQuery(trpcMsw.dev.getDevsByUser, { list: [], allPages: 1 }),
  mockTrpcQuery(trpcMsw.dev.getLikedDevsByUser, { list: [], allPages: 1 }),

  mockTrpcQuery(trpcMsw.devMemo.getAll, []),

  mockTrpcQuery(trpcMsw.user.getFavoritedUsers, { list: [], allPages: 1 }),
  mockTrpcQuery(trpcMsw.user.search, []),
  mockTrpcQuery(trpcMsw.user.isFavoritedByLoggedInUser, false),
  mockTrpcQuery(trpcMsw.user.getFavoriteCountByUser, 8),
  mockTrpcQuery(trpcMsw.user.getReceivedLikeCount, {
    ideaLikeCount: 10,
    devLikeCount: 2,
  }),
  mockTrpcQuery(trpcMsw.user.getUserActivity, {
    devCount: 3,
    likedIdeaCount: 4,
    postedIdeaCount: 1,
  }),

  mockTrpcQuery(trpcMsw.uploadedImage.getAll, []),
  mockTrpcQuery(trpcMsw.uploadedImage.getTotalSize, { totalSize: 0 }),

  mockTrpcQuery(trpcMsw.aggregate.getTop10LikesIdeasInThisMonth, []),
  mockTrpcQuery(trpcMsw.aggregate.getTop10LikesPostersInThisMonth, []),
  mockTrpcQuery(trpcMsw.aggregate.getTop10LikesDevsInThisMonth, []),
  mockTrpcQuery(trpcMsw.aggregate.getPickedIdeas, []),
  mockTrpcQuery(trpcMsw.aggregate.getPopularIdeaTags, []),
];
