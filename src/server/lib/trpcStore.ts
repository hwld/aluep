import { appRouter } from "@/server/router";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createRequest } from "node-mocks-http";

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
