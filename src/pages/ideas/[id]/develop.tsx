import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../client/features/idea/useIdeaQuery";
import { DevelopPage } from "../../../client/pageComponents/DevelopPage";
import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/router";
import { Routes } from "../../../share/routes";
import { createRepositoryURLParamSchema } from "../../../share/schema";
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
    if (!idea) {
      return { notFound: true };
    }

    // すでに開発している場合はお題にリダイレクトする
    const developedData = await caller.idea.isDevelopedByLoggedInUser({
      ideaId: idea.id,
    });
    if (developedData.developed) {
      return {
        redirect: { destination: Routes.idea(ideaId), permanent: false },
      };
    }

    queryClient.setQueryData(ideaQueryKey(ideaId), idea);
  }
);

const Develop: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const createRepositoryData = createRepositoryURLParamSchema.parse(
    router.query
  );
  const { idea } = useIdeaQuery(ideaId);

  if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopPage idea={idea} restoredValues={createRepositoryData} />;
};
export default Develop;
