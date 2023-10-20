import { UserUploadedImagesPage } from "@/client/pageComponents/UserUploadedImagesPage/UserUploadedImagesPage";
import { withReactQueryGetServerSideProps } from "@/server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "@/share/routes";
import { NextPage } from "next";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session, trpcStore }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }

    await trpcStore.user.getUserUploadedImages.prefetch();
  }
);

const UserUploadedImages: NextPage = () => {
  return <UserUploadedImagesPage />;
};

export default UserUploadedImages;
