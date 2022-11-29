import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { HomePage } from "../client/components/HomePage";
import { sessionQuerykey } from "../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/routers/_app";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  // trpcのapiをサーバー側から呼び出すために、コンテキストを指定してcallerを作る
  const caller = appRouter.createCaller({ session: null });

  const session = await unstable_getServerSession(req, res, authOptions);
  const themes = await caller.theme.getAll();

  // react-queryを使用してデータを渡し、dehydrateしてクライアントに送る
  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuerykey, session);
  // TODO: ページング
  queryClient.setQueryData(["themes"], themes);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

const Home: NextPage = () => {
  return <HomePage />;
};
export default Home;
