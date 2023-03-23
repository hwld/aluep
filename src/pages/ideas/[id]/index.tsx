import { useRouter } from "next/router";
import { developedQueryKey } from "../../../client/features/idea/useDevelop";
import { ideaLikedQueryKey } from "../../../client/features/idea/useIdeaLike";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../client/features/idea/useIdeaQuery";
import { ideaCommentsQueryKey } from "../../../client/features/ideaComment/useIdeaComments";
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
    queryClient.setQueryData(ideaQueryKey(ideaId), idea);

    // ログインユーザーのいいね状況のプリフェッチ
    await queryClient.prefetchQuery(
      ideaLikedQueryKey(ideaId, session?.user.id),
      () => caller.idea.isLikedByLoggedInUser({ ideaId })
    );

    // ログインユーザーの開発情報のプリフェッチ
    await queryClient.prefetchQuery(
      developedQueryKey(ideaId, session?.user.id),
      () => caller.idea.isDevelopedByLoggedInUser({ ideaId: ideaId })
    );

    // コメントのプリフェッチ
    await queryClient.prefetchQuery(ideaCommentsQueryKey(ideaId), () =>
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