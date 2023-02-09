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
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const { id: themeId } = query;
    if (typeof themeId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    // すでに参加している場合はお題にリダイレクトする
    const joinData = await caller.theme.joined({ themeId: theme.id });
    if (joinData.joined) {
      return {
        redirect: { destination: `/themes/${theme.id}`, permanent: false },
      };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
  }
);

const JoinTheme: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const repoUrl = router.query.repoUrl;
  const { repoName, repoDescription, comment, reRepo } = router.query;

  const { theme } = useThemeQuery(themeId);

  if (
    !theme ||
    typeof repoUrl === "object" ||
    typeof repoName === "object" ||
    typeof repoDescription === "object" ||
    typeof reRepo === "object" ||
    typeof comment === "object"
  ) {
    return <NotFoundPage />;
  }

  return (
    <ThemeJoinPage
      theme={theme}
      repoUrl={repoUrl}
      repoFormData={{
        repoName: repoName ?? "",
        repoDescription: repoDescription ?? "",
        comment: comment ?? "",
      }}
      reRepo={reRepo}
    />
  );
};
export default JoinTheme;
