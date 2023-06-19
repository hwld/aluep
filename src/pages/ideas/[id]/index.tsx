import { useRouter } from "next/router";
import { developmentKeys } from "../../../client/features/development/queryKeys";
import { ideaKeys } from "../../../client/features/idea/queryKeys";
import { useIdeaQuery } from "../../../client/features/idea/useIdeaQuery";
import { ideaCommentKeys } from "../../../client/features/ideaComment/queryKeys";
import { IdeaDetailPage } from "../../../client/pageComponents/IdeaDetailPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    const ideaId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);

    // テーマがなければ404に飛ばす
    const idea = await caller.idea.get({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    // お題情報のプリフェッチ
    queryClient.setQueryData(ideaKeys.detail(ideaId), idea);

    // ログインユーザーのいいね状況のプリフェッチ
    await queryClient.prefetchQuery(
      ideaKeys.isLiked(ideaId, session?.user.id),
      () =>
        caller.idea.isLikedByUser({ ideaId, userId: session?.user.id ?? null })
    );

    // ログインユーザーの開発情報のプリフェッチ
    await queryClient.prefetchQuery(
      developmentKeys.isDeveloped(ideaId, session?.user.id),
      () =>
        caller.development.isDevelopedByUser({
          ideaId: ideaId,
          userId: session?.user.id ?? null,
        })
    );

    // コメントのプリフェッチ
    await queryClient.prefetchQuery(ideaCommentKeys.listByIdea(ideaId), () =>
      caller.ideaComment.getAll({ ideaId })
    );
  }
);

const IdeaDetail = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery(ideaId);

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaDetailPage idea={idea} />;
};
export default IdeaDetail;
