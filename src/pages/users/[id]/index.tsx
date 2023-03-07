import { withReactQueryGetServerSideProps } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { Routes } from "../../../share/routes";
import { assertString } from "../../../share/utils";
import NotFoundPage from "../../404";

// TODO: 現在は投稿したお題、開発したお題、いいねしたお題タブでページを切り替えるようにしている。
// なので各ページでコードの重複が見られて保守性があまり高くなさそう。クエリパラメータで切り替えたい。
export const getServerSideProps = withReactQueryGetServerSideProps(
  async ({ params: { query } }) => {
    const userId = assertString(query.id);

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
  return <NotFoundPage />;
}
export default UserDetail;
