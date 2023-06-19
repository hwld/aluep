import { NextPage } from "next";
import { useRouter } from "next/router";
import { ideaKeys } from "../../../client/features/idea/queryKeys";
import { useIdeaQuery } from "../../../client/features/idea/useIdeaQuery";
import { userKeys } from "../../../client/features/user/queryKeys";
import { IdeaLikersPage } from "../../../client/pageComponents/IdeaLikersPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { paginatedPageSchema } from "../../../share/schema";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, queryClient, callerContext }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const ideaId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const idea = await caller.idea.get({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(ideaKeys.detail(ideaId), () =>
      caller.idea.get({ ideaId: ideaId })
    );
    await queryClient.prefetchQuery(userKeys.ideaLikers(ideaId, page), () =>
      caller.user.getIdeaLikers({ ideaId, page })
    );
  }
);

/**
 * お題にいいねしているユーザー一覧を表示するページ
 */
const IdeaLikers: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery({ ideaId });

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaLikersPage idea={idea} />;
};
export default IdeaLikers;
