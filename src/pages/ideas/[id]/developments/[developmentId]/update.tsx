import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  developmentQuerykey,
  useDevelopmentQuery,
} from "../../../../../client/features/development/useDevelopmentQuery";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../../../client/features/idea/useIdeaQuery";
import { DevelopmentEditPage } from "../../../../../client/pageComponents/DevelopmentEditPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/router";
import { Routes } from "../../../../../share/routes";
import { createRepositoryURLParamSchema } from "../../../../../share/schema";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const ideaId = assertString(query.id);
    const developmentId = assertString(query.developmentId);

    const caller = appRouter.createCaller(callerContext);
    const idea = await caller.idea.get({ ideaId: ideaId });
    const development = await caller.development.get({
      developmentId: developmentId,
    });

    //　お題か開発者が存在しない、または開発者とログインユーザーが異なれば404にする
    if (
      !idea ||
      !development ||
      development?.developerUserId !== session.user.id
    ) {
      return { notFound: true };
    }

    queryClient.setQueryData(ideaQueryKey(ideaId), idea);
    queryClient.setQueryData(developmentQuerykey(developmentId), development);
  }
);

const DevelopmentUpdate: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const developmentId = assertString(router.query.developmentId);
  const createRepositoryData = createRepositoryURLParamSchema.parse(
    router.query
  );

  const { idea } = useIdeaQuery(ideaId);
  const { development: development } = useDevelopmentQuery(developmentId);

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (!idea || !development) {
    return <NotFoundPage />;
  }

  return (
    <DevelopmentEditPage
      idea={idea}
      development={development}
      restoredValues={createRepositoryData}
    />
  );
};
export default DevelopmentUpdate;
