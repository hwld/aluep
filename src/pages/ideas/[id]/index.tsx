import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { IdeaDetailPage } from "@/client/pageComponents/IdeaDetailPage/IdeaDetailPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { assertString } from "@/share/utils";
import { useRouter } from "next/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, session, trpcStore }) => {
    const userId = session?.user.id ?? null;
    const ideaId = assertString(query.id);

    // テーマがなければ404に飛ばす
    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.idea.isLikedByUser.prefetch({ ideaId, userId }),
      trpcStore.development.isDevelopedByUser.prefetch({ ideaId, userId }),
      trpcStore.ideaComment.getAll.prefetch({ ideaId }),
    ]);
  }
);

const IdeaDetail = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery({ ideaId });

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaDetailPage idea={idea} />;
};
export default IdeaDetail;
