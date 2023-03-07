import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/features/theme/useThemeQuery";
import { ThemeJoinPage } from "../../../client/pageComponents/ThemeJoinPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers";
import { Routes } from "../../../share/routes";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const themeId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    if (!theme) {
      return { notFound: true };
    }

    // すでに参加している場合はお題にリダイレクトする
    const joinData = await caller.theme.joined({ themeId: theme.id });
    if (joinData.joined) {
      return {
        redirect: { destination: Routes.theme(themeId), permanent: false },
      };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
  }
);

//TODO
const JoinTheme: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
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
