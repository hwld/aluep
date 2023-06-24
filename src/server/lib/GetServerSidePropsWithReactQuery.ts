import { sessionKeys } from "@/client/features/session/queryKeys";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { TRPCContext } from "@/server/lib/trpc";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { Session, getServerSession } from "next-auth";
import superjson from "superjson";

export type PageProps = { stringifiedDehydratedState?: string };

type Callback = (args: {
  gsspContext: GetServerSidePropsContext;
  queryClient: QueryClient;
  session: Session | null;
  callerContext: TRPCContext;
}) => Promise<GetServerSidePropsResult<PageProps> | void>;

export const withReactQueryGetServerSideProps = (
  callback: Callback
): GetServerSideProps<PageProps> => {
  return async (args) => {
    const queryClient = new QueryClient();
    const session = await getServerSession(args.req, args.res, authOptions);

    // セッション情報をプリフェッチする
    queryClient.setQueryData(sessionKeys.session, session);

    const result = await callback({
      gsspContext: args,
      queryClient,
      session,
      callerContext: { session, req: args.req },
    });

    // callbackが戻り値を持っていればそれをそのまま返す
    if (result) {
      return result;
    }

    return {
      props: {
        stringifiedDehydratedState: superjson.stringify(dehydrate(queryClient)),
      },
    };
  };
};
