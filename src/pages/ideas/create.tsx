import { ideaKeys } from "../../client/features/idea/queryKeys";
import { IdeaCreatePage } from "../../client/pageComponents/IdeaCreatePage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/router";
import { Routes } from "../../share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const caller = appRouter.createCaller(callerContext);
    await queryClient.prefetchQuery(ideaKeys.allTags, () =>
      caller.idea.getAllTags()
    );
  }
);

export default function CreateIdea() {
  return <IdeaCreatePage />;
}
