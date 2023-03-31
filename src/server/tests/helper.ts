import { addYears } from "date-fns";
import { createRequest } from "node-mocks-http";
import { db } from "../lib/prismadb";
import { appRouter } from "../router";

export const TestHelpers = {
  createCaller: async (
    args:
      | { isLoginSession: true; userName: string | null }
      | { isLoginSession: false }
  ) => {
    const loginUser =
      args.isLoginSession === true
        ? await db.user.create({ data: { name: args.userName } })
        : undefined;

    const caller = appRouter.createCaller({
      session: loginUser
        ? { user: loginUser, expires: addYears(new Date(), 1).toUTCString() }
        : null,
      req: createRequest(),
    });

    return { caller, loginUserId: loginUser?.id };
  },

  createUserAndIdea: async () => {
    const ideator = await db.user.create({ data: { name: "ideator" } });
    const idea = await db.idea.create({
      data: { title: "title", description: "<p>body</p>", userId: ideator.id },
    });

    return idea;
  },
};
