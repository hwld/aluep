import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { ThemeJoinPage } from "../../../client/components/ThemeJoinPage";
import { themeQueryKey } from "../../../client/hooks/useThemeQuery";
import { appRouter } from "../../../server/routers/_app";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  const caller = appRouter.createCaller({ session });
  const theme = await caller.theme.get({ themeId });

  const queryClient = new QueryClient();
  // TODO hook化
  queryClient.prefetchQuery(themeQueryKey(themeId), () => theme);
  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

const JoinTheme: NextPage = () => {
  return <ThemeJoinPage />;
};
export default JoinTheme;
