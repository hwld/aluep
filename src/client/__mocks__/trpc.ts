import { AppRouter } from "@/server/router";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCMsw } from "msw-trpc";
import { ContextWithDataTransformer, Query } from "msw-trpc/dist/types";
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

type MockData<T> = T extends Query<infer Route, infer Procedure>
  ? Parameters<ContextWithDataTransformer<Route[Procedure]>["data"]>[0]
  : never;

export const mockTrpcQuery = <T extends Query<unknown, never>>(
  route: T,
  data: MockData<T> | (() => MockData<T>) | (() => Promise<MockData<T>>)
) => {
  const query = route.query;
  return query(async (_, res, ctx) => {
    const _data = typeof data === "function" ? await data() : data;

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

  mockTrpcQuery(trpcMsw.aggregate.getPopularIdeas, []),
  mockTrpcQuery(trpcMsw.aggregate.getPopularIdeaAuthors, []),
  mockTrpcQuery(trpcMsw.aggregate.getPopularDevelopers, []),
  mockTrpcQuery(trpcMsw.aggregate.getPickedIdeas, []),
  mockTrpcQuery(trpcMsw.aggregate.getPopularIdeaTags, []),
];
