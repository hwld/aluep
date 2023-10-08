import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopmentEditPage } from "@/client/pageComponents/DevelopmentEditPage/DevelopmentEditPage";
import { createRepositoryURLParamSchema } from "@/models/development";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const ideaId = assertString(query.id);
    const developmentId = assertString(query.developmentId);

    const [idea, development] = await Promise.all([
      trpcStore.idea.get.fetch({ ideaId: ideaId }),
      trpcStore.development.get.fetch({
        developmentId: developmentId,
      }),
    ]);

    //　お題か開発者が存在しない、または開発者とログインユーザーが異なれば404にする
    if (
      !idea ||
      !development ||
      development?.developerUserId !== session.user.id
    ) {
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.development.get.prefetch({ developmentId }),
    ]);
  }
);

const DevelopmentUpdate: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const developmentId = assertString(router.query.developmentId);
  const createRepositoryData = createRepositoryURLParamSchema.parse(
    router.query
  );

  const { idea } = useIdeaQuery({ ideaId });
  const { development: development } = useDevQuery({ developmentId });

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
