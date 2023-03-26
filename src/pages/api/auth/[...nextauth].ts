import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User as PrismaUser } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { db } from "../../../server/lib/prismadb";
import { convertUser } from "../../../server/models/user";
import { Routes } from "../../../share/routes";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signOut: Routes.signout,
    error: Routes.serverError,
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
      // PrismaAdapterを使用すると、ここのuserにはPrismaのUserモデルが入ってくる。
      // それを推論できないので強制的にキャストする。
      const prismaUser = user as PrismaUser;

      const appUser = convertUser(prismaUser);
      session.user = appUser;

      return session;
    },
    signIn: async ({ account }) => {
      //ログイン時にaccess_tokenが更新されないので、手動で更新する
      if (account) {
        try {
          await db.$transaction(async (tx) => {
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
