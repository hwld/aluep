import { dehydrate, QueryClient } from "@tanstack/react-query";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { Session, unstable_getServerSession } from "next-auth";
import superjson from "superjson";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export type PageProps = { stringifiedDehydratedState?: string };

type Callback = (params: {
  params: GetServerSidePropsContext;
  queryClient: QueryClient;
  session: Session | null;
}) => Promise<GetServerSidePropsResult<PageProps> | void>;

export const withReactQueryGetServerSideProps = (
  callback: Callback
): GetServerSideProps<PageProps> => {
  return async (params) => {
    const queryClient = new QueryClient();
    const session = await unstable_getServerSession(
      params.req,
      params.res,
      authOptions
    );
    queryClient.setQueryData(sessionQuerykey, session);

    const result = await callback({ params, queryClient, session });
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
