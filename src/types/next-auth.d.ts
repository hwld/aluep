import "next-auth";
import { User } from "../server/models/user";

// DBにあるuserIdをセッションに含めるための型定義
// api/auth/[...nextauth].ts でcallbackを設定して、userIdをセットしている。
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}
