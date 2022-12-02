import { dehydrate, QueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { DeveloperEditPage } from "../../../../../client/components/DeveloperEditPage";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/hooks/useDeveloperQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/hooks/useThemeQuery";
import { GetServerSidePropsWithReactQuery } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers/_app";
import { authOptions } from "../../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id: themeId, developerId } = query;
  if (typeof themeId !== "string" || typeof developerId !== "string") {
    return { notFound: true };
  }

  const caller = appRouter.createCaller({ session });
  const theme = await caller.theme.get({ themeId });
  const developer = await caller.themeDeveloper.get({ developerId });

  // 開発者とログインユーザーが異なれば404にする
  if (developer?.userId !== session.user.id) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(themeQueryKey(themeId), theme);
  queryClient.setQueryData(developerQuerykey(developerId), developer);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: { dehydratedState },
  };
};

const DeveloperUpdate: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const developerId = router.query.developerId as string;

  const { theme } = useThemeQuery(themeId);
  const { developer } = useDeveloperQuery(developerId);

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (!theme || !developer) {
    return <div>Error</div>;
  }

  return <DeveloperEditPage theme={theme} developer={developer} />;
};
export default DeveloperUpdate;
