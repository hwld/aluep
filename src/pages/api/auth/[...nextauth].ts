import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "../../../server/prismadb";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  //ここでサインアウト時に飛べるページを指定できる
  //csrfトークンを取得しないとここに飛べないっぽい？連続でやると飛べない理由はキャッシュが残っているから？

  pages: {
    signOut: "/signout",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: { params: { scope: "public_repo read:user" } },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      // TODO
      session.user.profile = (user as any)?.profile;
      return session;
    },
    signIn: async ({ account, profile, user }) => {
      //ログイン時にaccess_tokenが更新されないので、手動で更新する
      if (account) {
        try {
          await prisma.$transaction(async (tx) => {
            // 既に存在するアカウントであれば
            const existingAccount = await tx.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });
            if (!existingAccount) {
              // const githubName = await tx.user.update({
              //   where: {
              //     id: user.id,
              //   },
              //   data: {
              //     githubname: user.name,
              //   },
              // });

              return;
            }

            // 更新する
            await tx.account.update({
              where: {
                provider_providerAccountId: {
                  provider: existingAccount.provider,
                  providerAccountId: existingAccount.providerAccountId,
                },
              },
              data: { access_token: account.access_token },
            });

            return;
          });
        } catch (e) {
          console.error(e);
          // エラーメッセージが漏れてしまうので、例外を握りつぶしてnext-authが対応している
          // エラーを返す
          // https://next-auth.js.org/configuration/pages#error-page
          throw new Error("Configuration");
        }
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
