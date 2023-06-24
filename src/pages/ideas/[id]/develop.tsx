import { NextPage } from "next";
import { useRouter } from "next/router";
import { ideaKeys } from "../../../client/features/idea/queryKeys";
import { useIdeaQuery } from "../../../client/features/idea/useIdeaQuery";
import { DevelopIdeaPage } from "../../../client/pageComponents/DevelopPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { Routes } from "../../../share/routes";
import { createRepositoryURLParamSchema } from "../../../share/schema/development";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const ideaId = assertString(query.id);

    const caller = appRouter.createCaller(callerContext);
    const idea = await caller.idea.get({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    // すでに開発している場合はお題にリダイレクトする
    const developedData = await caller.development.isDevelopedByUser({
      ideaId: idea.id,
      userId: session.user.id,
    });
    if (developedData.developed) {
      return {
        redirect: { destination: Routes.idea(ideaId), permanent: false },
      };
    }

    queryClient.setQueryData(ideaKeys.detail(ideaId), idea);
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
