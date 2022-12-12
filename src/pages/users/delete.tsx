import { NextPage } from "next";
import { UserDeletepage } from "../../client/components/UserDeletePage";
import { withReactQueryGetServerSideProps } from "../../server/lib/GetServerSidePropsWithReactQuery";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ session }) => {
    if (!session) {
      return { redirect: { destination: "/", permanent: false } };
    }
  }
);

const DeleteUser: NextPage = () => {
  return <UserDeletepage />;
};

export default DeleteUser;
