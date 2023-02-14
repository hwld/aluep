import { NextPage } from "next";
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
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/routers/_app";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const { id: themeId, developerId } = query;
    if (typeof themeId !== "string" || typeof developerId !== "string") {
      return { notFound: true };
    }

    const caller = appRouter.createCaller(callerContext);
    const theme = await caller.theme.get({ themeId });
    const developer = await caller.themeDeveloper.get({ developerId });

    //　お題か開発者が存在しない、または開発者とログインユーザーが異なれば404にする
    if (!theme || !developer || developer?.userId !== session.user.id) {
      return { notFound: true };
    }

    queryClient.setQueryData(themeQueryKey(themeId), theme);
    queryClient.setQueryData(developerQuerykey(developerId), developer);
  }
);

const DeveloperUpdate: NextPage = () => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const developerId = router.query.developerId as string;
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
    return <div>Error</div>;
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
