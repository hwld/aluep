import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  developerQuerykey,
  useDeveloperQuery,
} from "../../../../../client/features/developer/useDeveloperQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../../../client/features/theme/useThemeQuery";
import { DeveloperEditPage } from "../../../../../client/pageComponents/DeveloperEditPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers";
import { Routes } from "../../../../../share/routes";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const themeId = assertString(query.id);
    const developerId = assertString(query.developerId);

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    const developer = await caller.developer.get({ developerId });

    //　お題か開発者が存在しない、または開発者とログインユーザーが異なれば404にする
    if (!theme || !developer || developer?.userId !== session.user.id) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(developerQuerykey(developerId), developer);
  }
);

// TODO
const DeveloperUpdate: NextPage = () => {
  const router = useRouter();
  const themeId = assertString(router.query.id);
  const developerId = assertString(router.query.developerId);
  const repoUrl = router.query.repoUrl;
  const { repoName, repoDescription, comment, reRepo } = router.query;

  const { theme } = useThemeQuery(themeId);
  const { developer } = useDeveloperQuery(developerId);

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (
    !theme ||
    !developer ||
    typeof repoUrl === "object" ||
    typeof repoName === "object" ||
    typeof repoDescription === "object" ||
    typeof reRepo === "object" ||
    typeof comment === "object"
  ) {
    return <NotFoundPage />;
  }

  return (
    <DeveloperEditPage
      theme={theme}
      developer={developer}
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
export default DeveloperUpdate;
