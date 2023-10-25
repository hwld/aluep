import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevEditPage } from "@/client/pageComponents/DevEditPage/DevEditPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { assertString } from "@/share/utils";
import { TRPCError } from "@trpc/server";
import { NextPage } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const devId = assertString(query.devId);
    let ideaId;
    try {
      const dev = await trpcStore.dev.get.fetch({ devId });
      ideaId = dev.idea.id;
    } catch (e) {
      if (e instanceof TRPCError && e.code === "NOT_FOUND") {
        return { notFound: true };
      }
      throw e;
    }

    await Promise.all([
      trpcStore.dev.get.prefetch({ devId }),
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.me.getMyGitHubRepositories.prefetch(),
    ]);
  }
);

const DevUpdate: NextPage = () => {
  const router = useRouter();
  const devId = assertString(router.query.devId);

  const { dev, isLoading: devLoading } = useDevQuery({ devId });
  const { idea, isLoading: ideaLoading } = useIdeaQuery({
    ideaId: dev?.idea.id,
  });

  // テーマが取得できないときはサーバーでエラーが出るから
  // ここには到達しない
  if (devLoading || ideaLoading) {
    return <></>;
  } else if (!dev || !idea) {
    return <NotFoundPage />;
  }

  return <DevEditPage idea={idea} dev={dev} />;
};
export default DevUpdate;
