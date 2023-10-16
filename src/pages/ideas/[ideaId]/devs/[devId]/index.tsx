import { useDevQuery } from "@/client/features/dev/useDevQuery";
import { useIdeaQuery } from "@/client/features/idea/useIdeaQuery";
import { DevDetailPage } from "@/client/pageComponents/DevDetailPage/DevDetailPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { assertString } from "@/share/utils";
import { useRouter } from "next/router";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ gsspContext: { query }, trpcStore }) => {
    const ideaId = assertString(query.ideaId);
    const devId = assertString(query.devId);

    const [idea, dev, devMemos] = await Promise.all([
      trpcStore.idea.get.fetch({ ideaId }),
      trpcStore.dev.get.fetch({ devId }),
      trpcStore.devMemo.getAll.fetch({ devId }),
    ]);

    if (!idea || !dev || !devMemos) {
      console.trace("指定されたお題、開発情報、メモのいずれかが存在しない");
      return { notFound: true };
    }

    await Promise.all([
      trpcStore.idea.get.prefetch({ ideaId }),
      trpcStore.dev.get.prefetch({
        devId: devId,
      }),
      trpcStore.devMemo.getAll.prefetch({
        devId: devId,
      }),
    ]);
  }
);

const DevDetail = () => {
  const router = useRouter();
  const devId = assertString(router.query.devId);
  const ideaId = assertString(router.query.ideaId);
  const { dev, isLoading: loadingDev } = useDevQuery({ devId });
  const { idea, isLoading: loadingIdea } = useIdeaQuery({ ideaId });

  if (loadingDev || loadingIdea) {
    return <></>;
  } else if (!dev || !idea) {
    return <NotFoundPage />;
  }

  return <DevDetailPage dev={dev} idea={idea} />;
};
export default DevDetail;
