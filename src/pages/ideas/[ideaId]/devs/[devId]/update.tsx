import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevEditPage } from "@/client/pageComponents/DevEditPage/DevEditPage";
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

    const ideaId = assertString(query.ideaId);
    const devId = assertString(query.devId);

    const [idea, dev] = await Promise.all([
      trpcStore.idea.get.fetch({ ideaId }),
      trpcStore.dev.get.fetch({ devId }),
    ]);

    if (!idea || !dev || dev?.developer.id !== session.user.id) {
      console.trace(
        "お題か開発情報が存在しない、または開発者とログインユーザーが異なっている"
      );
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.dev.get.prefetch({ devId: devId }),
      trpcStore.me.getMyGitHubRepositories.prefetch(),
    ]);
  }
);

const DevUpdate: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);
  const devId = assertString(router.query.devId);

  const { idea } = useIdeaQuery({ ideaId });
  const { dev } = useDevQuery({ devId });

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (!idea || !dev) {
    return <NotFoundPage />;
  }

  return <DevEditPage idea={idea} dev={dev} />;
};
export default DevUpdate;
