import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../client/features/idea/useIdeaQuery";
import { ideaLikingUsersPerPageQueryKey } from "../../../client/features/user/useIdeaLikingUsersPerPage";
import { IdeaLikingUsersPage } from "../../../client/pageComponents/IdeaLikingUsersPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { paginatedPageSchema } from "../../../share/schema";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
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

    await queryClient.prefetchQuery(ideaQueryKey(ideaId), () =>
      caller.idea.get({ ideaId: ideaId })
    );
    await queryClient.prefetchQuery(
      ideaLikingUsersPerPageQueryKey(ideaId, page),
      () => caller.user.getIdeaLikingUsers({ ideaId, page })
    );
  }
);

/**
 * お題にいいねしているユーザー一覧を表示するページ
 */
const IdeaLikingUsers: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery(ideaId);

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaLikingUsersPage idea={idea} />;
};
export default IdeaLikingUsers;
