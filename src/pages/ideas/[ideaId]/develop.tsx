import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopIdea } from "@/client/pageComponents/DevelopIdea/DevelopIdea";
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
    if (idea.loggedInUserDevId) {
      return {
        redirect: { destination: Routes.idea(ideaId), permanent: false },
      };
    }

    await Promise.all([trpcStore.idea.get.prefetch({ ideaId })]);
  }
);

const DevelopIdeaPage: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);

  const { idea } = useIdeaQuery({ ideaId });
  if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopIdea idea={idea} />;
};
export default DevelopIdeaPage;
