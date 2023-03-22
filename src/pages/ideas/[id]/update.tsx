import { NextPage } from "next";
import { useRouter } from "next/router";
import { allTagsQueryKey } from "../../../client/features/idea/useAllTagsQuery";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../client/features/idea/useIdeaQuery";
import { IdeaEditPage } from "../../../client/pageComponents/IdeaEditPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { Routes } from "../../../share/routes";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const ideaId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const idea = await caller.idea.get({ ideaId: ideaId });

    // お題が存在しないか、お題の作成者とログインユーザーが異なれば404にする
    if (idea === undefined || idea.user.id !== session.user.id) {
      return { notFound: true };
    }

    await queryClient.prefetchQuery(ideaQueryKey(ideaId), () => idea);
    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.idea.getAllTags()
    );
  }
);

const UpdateIdea: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery(ideaId);

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <IdeaEditPage idea={idea} />;
};

export default UpdateIdea;
