import { findUser } from "@/server/finders/user";
import { db } from "@/server/lib/prismadb";
import { appRouter } from "@/server/router";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";
import { addYears } from "date-fns";
import { createRequest } from "node-mocks-http";

export const TestHelpers = {
  /** セッションのあるCallerを作成する */
  createNewUserSessionCaller: async () => {
    // userの登録
    const loginUser = await db.user.create({ data: { name: "loginUser" } });

    // githubのアカウントの登録
    await db.account.create({
      data: {
        userId: loginUser.id,
        provider: "github",
        providerAccountId: "dummy",
        type: "dummy",
      },
    });

    const caller = appRouter.createCaller({
      session: {
        user: loginUser,
        expires: addYears(new Date(), 1).toUTCString(),
      },
      req: createRequest(),
    });

    return { caller, loginUserId: loginUser.id };
  },

  /** セッションのないCallerを作成する */
  createPublicCaller: async () => {
    const caller = appRouter.createCaller({
      session: null,
      req: createRequest(),
    });

    return { caller };
  },

  /** 指定されたユーザーでログイン済みのセッションCallerを作成する */
  createSessionCaller: async ({ userId }: { userId: string }) => {
    const loginUser = await findUser({
      where: (users, { eq }) => {
        return eq(users.id, userId);
      },
    });
    if (!loginUser) {
      throw new Error("指定されたユーザーは存在しません。");
    }

    const caller = appRouter.createCaller({
      session: {
        user: loginUser,
        expires: addYears(new Date(), 1).toUTCString(),
      },
      req: createRequest(),
    });

    return { caller };
  },

  /** ユーザーを作成して、お題を投稿する */
  createIdeaAndUser: async () => {
    const ideator = await db.user.create({ data: { name: "ideator" } });
    const idea = await db.idea.create({
      data: { title: "title", description: "<p>body</p>", userId: ideator.id },
    });

    return { idea, ideator };
  },

  /** ユーザーを作成して、お題にコメントする */
  createIdeaCommentAndUser: async ({ ideaId }: { ideaId: string }) => {
    const commenter = await db.user.create({ data: { name: "user" } });
    const comment = await db.ideaComment.create({
      data: { ideaId, text: "comment", fromUserId: commenter.id },
    });

    const { caller: commenterCaller } = await TestHelpers.createSessionCaller({
      userId: commenter.id,
    });

    return { comment, commenter, commenterCaller };
  },

  /** ユーザーを作成して、お題を開発する */
  createDevAndUser: async (
    args: Partial<
      OmitStrict<Prisma.DevelopmentUncheckedCreateInput, "ideaId">
    > & {
      ideaId: string;
    }
  ) => {
    const developer = await db.user.create({ data: { name: "developer" } });
    const dev = await db.development.create({
      data: {
        userId: developer.id,
        comment: "",
        developedItemUrl: "",
        githubUrl: "https://github.com/hwld/aluep",
        status: "IN_PROGRESS",
        ...args,
      },
    });

    const { caller: developerCaller } = await TestHelpers.createSessionCaller({
      userId: developer.id,
    });

    return { dev, developer, developerCaller };
  },

  /** 開発メモを作成する */
  createDevMemoAndUser: async ({ devId }: { devId: string }) => {
    const memoer = await db.user.create({ data: { name: "user" } });
    const memo = await db.developmentMemo.create({
      data: { developmentId: devId, text: "memo", fromUserId: memoer.id },
    });

    return { memo, memoer };
  },
};
