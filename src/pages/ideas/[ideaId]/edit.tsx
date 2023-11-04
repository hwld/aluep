import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { IdeaEdit } from "@/client/pageComponents/IdeaEdit/IdeaEdit";
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

    // お題が存在しないか、お題の作成者とログインユーザーが異なれば404にする
    if (idea === undefined || idea.user.id !== session.user.id) {
      console.trace(
        "指定されたお題が存在しない、または作成者とログインユーザーが異なる"
      );
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.idea.getAllTags.prefetch(),
    ]);
  }
);

const IdeaEditPage: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);
  const { idea, isLoading } = useIdeaQuery({ ideaId });

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaEdit idea={idea} />;
};

export default IdeaEditPage;
