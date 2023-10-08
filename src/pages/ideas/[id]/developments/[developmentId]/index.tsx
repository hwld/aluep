import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevelopmentDetailPage } from "@/client/pageComponents/DevelopmentDetailPage/DevelopmentDetailPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { assertString } from "@/share/utils";
import { useRouter } from "next/router";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const ideaId = assertString(query.id);
    const developmentId = assertString(query.developmentId);

    const [idea, development, developmentMemos] = await Promise.all([
      trpcStore.idea.get.fetch({ ideaId: ideaId }),
      trpcStore.development.get.fetch({
        developmentId: developmentId,
      }),
      trpcStore.developmentMemo.getAll.fetch({
        developmentId: developmentId,
      }),
    ]);

    if (!idea || !development || !developmentMemos) {
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId: ideaId }),
      trpcStore.development.get.prefetch({
        developmentId: developmentId,
      }),
      trpcStore.developmentMemo.getAll.prefetch({
        developmentId: developmentId,
      }),
    ]);
  }
);

const DevelopmentDetail = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const ideaId = assertString(router.query.id);
  const { development: development, isLoading: loadingDevelopment } =
    useDevQuery({ developmentId });
  const { idea, isLoading: loadingIdea } = useIdeaQuery({ ideaId });

  if (loadingDevelopment || loadingIdea) {
    return <></>;
  } else if (!development || !idea) {
    return <NotFoundPage />;
  }

  return <DevelopmentDetailPage development={development} idea={idea} />;
};
export default DevelopmentDetail;
