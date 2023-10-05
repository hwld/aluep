import { developmentKeys } from "@/client/features/dev/queryKeys";
import { ideaKeys } from "@/client/features/idea/queryKeys";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopmentsPage as DevelopmentsPageComponent } from "@/client/pageComponents/DevelopmentsPage/DevelopmentsPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "@/server/router";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";

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
    await queryClient.prefetchQuery(
      developmentKeys.listByIdea(ideaId, page),
      () => caller.development.getManyByIdea({ ideaId: ideaId, page })
    );
  }
);

const DevelopmentsPage: NextPage = () => {
  const router = useRouter();
  const ideaId = assertString(router.query.id);
  const { idea, isLoading } = useIdeaQuery({ ideaId });

  if (isLoading) {
    return <></>;
  } else if (!idea) {
    return <NotFoundPage />;
  }

  return <DevelopmentsPageComponent idea={idea} />;
};
export default DevelopmentsPage;
