import { NextPage } from "next";
import { UserDeletepage } from "../../client/components/UserDeletePage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "../../share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: Routes.home, permanent: false } };
    }
  }
);

const DeleteUser: NextPage = () => {
  return <UserDeletepage />;
};

export default DeleteUser;
