import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopIdeaPage } from "@/client/pageComponents/DevelopIdeaPage/DevelopIdeaPage";
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

    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    // すでに開発している場合はお題にリダイレクトする
    const developedData = await trpcStore.development.isDevelopedByUser.fetch({
      ideaId: idea.id,
      userId: session.user.id,
    });
    if (developedData.developed) {
      return {
        redirect: { destination: Routes.idea(ideaId), permanent: false },
      };
    }

    await trpcStore.idea.get.prefetch({ ideaId });
  }
);

const DevelopIdea: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const createRepositoryData = createRepositoryURLParamSchema.parse(
    router.query
  );
  const { idea } = useIdeaQuery({ ideaId });

  if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopIdeaPage idea={idea} restoredValues={createRepositoryData} />;
};
export default DevelopIdea;
