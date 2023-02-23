import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "../../../share/routes";

export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query } }) => {
    const userId = query.id;

    if (typeof userId !== "string") {
      return { notFound: true };
    }

    return {
      redirect: {
        destination: Routes.userWithPostedThemes(userId),
        permanent: true,
      },
    };
  }
);

/**
 *  ユーザーの詳細ページ
 *  リダイレクトするのでここには到達しない
 */
function UserDetail() {
  return null;
}
export default UserDetail;
