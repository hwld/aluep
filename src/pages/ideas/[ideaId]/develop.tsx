import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopIdeaPage } from "@/client/pageComponents/DevelopIdeaPage/DevelopIdeaPage";
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

    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      console.trace("指定されたお題が存在しない");
      return { notFound: true };
    }

    // すでに開発している場合はお題にリダイレクトする
    const developedData = await trpcStore.dev.isDevelopedByUser.fetch({
      ideaId: idea.id,
      userId: session.user.id,
    });
    if (developedData.developed) {
      return {
        redirect: { destination: Routes.idea(ideaId), permanent: false },
      };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.me.getMyGitHubRepositories.prefetch(),
    ]);
  }
);

const DevelopIdea: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);

  const { idea } = useIdeaQuery({ ideaId });
  if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopIdeaPage idea={idea} />;
};
export default DevelopIdea;
