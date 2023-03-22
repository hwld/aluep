import { NextPage } from "next";
import { useRouter } from "next/router";
import { developmentsPerPageQueryKey } from "../../../../client/features/development/useDevelopmentsPerPage";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../../client/features/idea/useIdeaQuery";
import { DevelopmentPage as DevelopmentPageComponent } from "../../../../client/pageComponents/DevelopmentPage";
import { withReactQueryGetServerSideProps } from "../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../server/router";
import { paginatedPageSchema } from "../../../../share/schema";
import { assertString } from "../../../../share/utils";
import NotFoundPage from "../../../404";

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
      developmentsPerPageQueryKey(ideaId, page),
      () => caller.development.getManyByIdea({ ideaId: ideaId, page })
    );
  }
);

const DevelopmentPage: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery(ideaId);

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopmentPageComponent idea={idea} />;
};
export default DevelopmentPage;
