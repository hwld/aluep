import { NextPage } from "next";
import { useRouter } from "next/router";
import { ThemeJoinPage } from "../../../client/components/ThemeJoinPage";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import NotFoundPage from "../../404";

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
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
  }
);

const JoinTheme: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const repoUrl = router.query.repoUrl;

  const { theme } = useThemeQuery(themeId);

  if (!theme || typeof repoUrl === "object") {
    return <NotFoundPage />;
  }

  return <ThemeJoinPage theme={theme} repoUrl={repoUrl} />;
};
export default JoinTheme;
