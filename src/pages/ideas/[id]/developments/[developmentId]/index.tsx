import { useRouter } from "next/router";
import {
  developmentQuerykey,
  useDevelopmentQuery,
} from "../../../../../client/features/development/useDevelopmentQuery";
import {
  ideaQueryKey,
  useIdeaQuery,
} from "../../../../../client/features/idea/useIdeaQuery";
import { DevelopmentDetailPage } from "../../../../../client/pageComponents/DevelopmentDetailPage";
import { withReactQueryGetServerSideProps } from "../../../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../../../server/router";
import { assertString } from "../../../../../share/utils";
import NotFoundPage from "../../../../404";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query }, queryClient, callerContext }) => {
    const ideaId = assertString(query.id);
    const developmentId = assertString(query.developmentId);

    const caller = appRouter.createCaller(callerContext);

    // お題と開発情報が存在しない場合は404にする
    const idea = await caller.idea.get({ ideaId: ideaId });
    const development = await caller.development.get({
      developmentId: developmentId,
    });
    if (!idea || !development) {
      return { notFound: true };
    }

    queryClient.setQueryData(ideaQueryKey(ideaId), idea);
    queryClient.setQueryData(developmentQuerykey(developmentId), development);
  }
);

const DevelopmentDetail = () => {
  const router = useRouter();
  const developmentId = assertString(router.query.developmentId);
  const ideaId = assertString(router.query.id);
  const { development: development, isLoading: loadingDevelopment } =
    useDevelopmentQuery(developmentId);
  const { idea, isLoading: loadingIdea } = useIdeaQuery(ideaId);

  if (loadingDevelopment || loadingIdea) {
    return <></>;
  } else if (!development || !idea) {
    return <NotFoundPage />;
  }

  return <DevelopmentDetailPage development={development} idea={idea} />;
};
export default DevelopmentDetail;
