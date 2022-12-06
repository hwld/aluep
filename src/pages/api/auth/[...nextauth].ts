import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "../../../server/prismadb";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      return session;
    },
    signIn: async ({ account }) => {
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
