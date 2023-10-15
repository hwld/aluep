import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { IdeaLikersPage } from "@/client/pageComponents/IdeaLikersPage/IdeaLikersPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      console.trace("不正なクエリー");
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const ideaId = assertString(query.ideaId);

    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      console.trace("指定されたお題が存在しない");
      return { notFound: true };
    }

    const { allPages } = await trpcStore.user.getIdeaLikers.fetch({
      ideaId,
      page,
    });
    if (page > allPages) {
      console.trace("存在しないPage");
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.user.getIdeaLikers.prefetch({ ideaId, page }),
    ]);
  }
);

/**
 * お題にいいねしているユーザー一覧を表示するページ
 */
const IdeaLikers: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.ideaId);
  const { idea, isLoading } = useIdeaQuery({ ideaId });

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaLikersPage idea={idea} />;
};
export default IdeaLikers;
