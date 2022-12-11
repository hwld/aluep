import { NextPage } from "next";
import { ThemeJoinPage } from "../../../client/components/ThemeJoinPage";
import { themeQueryKey } from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller({ session });

    await queryClient.prefetchQuery(themeQueryKey(themeId), () =>
      caller.theme.get({ themeId })
    );
  }
);

const JoinTheme: NextPage = () => {
  return <ThemeJoinPage />;
};
export default JoinTheme;
