import { DefaultUser } from "next-auth";

// DBにあるuserIdをセッションに含めるための型定義
// api/auth/[...nextauth].ts でcallbackを設定して、userIdをセットしている。
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultUser & {
      id: string;
      profile?: string | null;
    };
  }
}
