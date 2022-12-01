import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { HomePage } from "../client/components/HomePage";
import { paginatedThemesQueryKey } from "../client/hooks/usePaginatedThemesQuery";
import { sessionQuerykey } from "../client/hooks/useSessionQuery";
import { GetServerSidePropsWithReactQuery } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/routers/_app";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  // trpcのapiをサーバー側から呼び出すために、コンテキストを指定してcallerを作る
  const caller = appRouter.createCaller({ session: null });

  // URLパラメータからpageを取得する。
  // pageが配列の時にエラーを出す
  const { page } = query;
  if (typeof page === "object") {
    throw new Error();
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  const themes = await caller.theme.getMany({ page });

  // react-queryを使用してデータを渡し、dehydrateしてクライアントに送る
  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuerykey, session);
  queryClient.setQueryData(paginatedThemesQueryKey(Number(page)), themes);
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
