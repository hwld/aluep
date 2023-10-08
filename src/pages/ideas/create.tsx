import { IdeaCreatePage } from "@/client/pageComponents/IdeaCreatePage/IdeaCreatePage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    await trpcStore.idea.getAllTags.prefetch();
  }
);

export default function CreateIdea() {
  return <IdeaCreatePage />;
}
