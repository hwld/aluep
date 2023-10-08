import { appRouter } from "@/server/router";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { IncomingMessage } from "http";
import { Session } from "next-auth";
import { createRequest } from "node-mocks-http";
import SuperJSON from "superjson";

/**
 * SSRでデータをプリフェッチしておくためのstoreとして使う
 */

export const createTRPCStore = (
  session: Session | null,
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  }
) => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { req, session: session },
    transformer: SuperJSON,
  });
};

// createServerSideHelpersが返すオブジェクトの型が公開されていないので
// typeofで型を得るためだけにオブジェクトを生成する
const _ = createServerSideHelpers({
  router: appRouter,
  ctx: {
    req: createRequest(),
    session: null,
  },
});

export type TRPCStore = typeof _;
