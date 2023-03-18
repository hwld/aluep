import { allTagsQueryKey } from "../../client/features/theme/useAllTagsQuery";
import { ThemeCreatePage } from "../../client/pageComponents/ThemeCreatePage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../server/router";
import { Routes } from "../../share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ queryClient, session, callerContext }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    const caller = appRouter.createCaller(callerContext);
    await queryClient.prefetchQuery(allTagsQueryKey, () =>
      caller.theme.getAllTags()
    );
  }
);

export default function CreateTheme() {
  return <ThemeCreatePage />;
}
