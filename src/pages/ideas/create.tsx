import { IdeaCreate } from "@/client/pageComponents/IdeaCreate/IdeaCreate";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    await trpcStore.idea.getAllTags.prefetch();
  }
);

const IdeaCreatePage: NextPage = () => {
  return <IdeaCreate />;
};

export default IdeaCreatePage;
