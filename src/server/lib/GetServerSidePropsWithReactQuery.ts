import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { TRPCStore } from "@/server/lib/trpcStore";
import { appRouter } from "@/server/router";
import { AppConfigCookie, getAppConfigCookie } from "@/share/cookie";
import { DehydratedState } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getServerSession, Session } from "next-auth";
import superjson from "superjson";

export type PageProps = {
  trpcState: DehydratedState;
} & Partial<AppConfigCookie>;

type Callback<Props> = (args: {
  gsspContext: GetServerSidePropsContext;
  trpcStore: TRPCStore;
  session: Session | null;
}) => Promise<GetServerSidePropsResult<Props> | void>;

export const withReactQueryGetServerSideProps = <Props>(
  callback: Callback<Props>
): GetServerSideProps<PageProps> => {
  // TODO:
  console.log("start gssp");

  return async (args) => {
    const session = await getServerSession(args.req, args.res, authOptions);

    const trpcStore = createServerSideHelpers({
      router: appRouter,
      ctx: { session, req: args.req },
      transformer: superjson,
    });

    // セッション情報をプリフェッチする
    await trpcStore.session.prefetch();

    // アプリの設定情報をcookieから読み取る
    const appConfig = getAppConfigCookie(args.req.cookies);

    const result =
      (await callback({
        gsspContext: args,
        trpcStore,
        session,
      })) ?? {};

    return {
      ...result,
      props: {
        ...("props" in result ? result.props : {})!,
        trpcState: trpcStore.dehydrate(),
        ...appConfig,
      },
    };
  };
};
