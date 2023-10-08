import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopmentsPage as DevelopmentsPageComponent } from "@/client/pageComponents/DevelopmentsPage/DevelopmentsPage";
import NotFoundPage from "@/pages/404";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { paginatedPageSchema } from "@/share/paging";
import { assertString } from "@/share/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const parsePageResult = paginatedPageSchema.safeParse(query);
    if (!parsePageResult.success) {
      return { notFound: true };
    }
    const { page } = parsePageResult.data;

    const ideaId = assertString(query.id);

    const idea = await trpcStore.idea.get.fetch({ ideaId: ideaId });
    if (!idea) {
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.development.getManyByIdea.prefetch({ ideaId, page }),
    ]);
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
