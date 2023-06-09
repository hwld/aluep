import { addYears } from "date-fns";
import { createRequest } from "node-mocks-http";
import { DevelopmentStatuses } from "../../share/consts";
import { db } from "../lib/prismadb";
import { appRouter } from "../router";

export const TestHelpers = {
  /** セッションのあるCallerを作成する */
  createSessionCaller: async ({ userName }: { userName: string }) => {
    const loginUser = await db.user.create({ data: { name: userName } });
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
      data: { ideaId, comment: "comment", fromUserId: commenter.id },
    });

    return { comment, commenter };
  },

  /** ユーザーを作成して、お題を開発する */
  createDevelopmentAndUser: async ({ ideaId }: { ideaId: string }) => {
    const developer = await db.user.create({ data: { name: "developer" } });
    const development = await db.development.create({
      data: {
        ideaId,
        userId: developer.id,
        comment: "",
        githubUrl: "https://github.com/hwld/aluep",
        statusId: DevelopmentStatuses.IN_PROGRESS,
      },
    });

    return { development, developer };
  },
};
