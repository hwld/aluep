import { UserUploadedImages } from "@/client/pageComponents/UserUploadedImages/UserUploadedImages";
import { PageLayout } from "@/client/ui/PageLayout";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    await trpcStore.uploadedImage.getAll.prefetch();
  }
);

const UserUploadedImagesPage: NextPage = () => {
  return <UserUploadedImages />;
};

export default UserUploadedImagesPage;

UserUploadedImagesPage.getLayout = (page, { isSideBarOpen }) => {
  return <PageLayout isSideBarOpen={isSideBarOpen}>{page}</PageLayout>;
};
