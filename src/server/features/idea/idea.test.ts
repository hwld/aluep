import { addYears } from "date-fns";
import { createRequest } from "node-mocks-http";
import { db } from "../../lib/prismadb";
import { appRouter } from "../../router";

describe("server/routers/idea.ts", () => {
  it("お題を作成し、作成したお題を取得することができる", async () => {
    const createdUser = await db.user.create({ data: { name: "user" } });

    const caller = appRouter.createCaller({
      session: {
        user: createdUser,
        expires: addYears(new Date(), 1).toUTCString(),
      },
      req: createRequest(),
    });

    const title = "test-title";
    const description = "test-description";
    const { ideaId } = await caller.idea.create({
      title,
      descriptionHtml: description,
      tags: [],
    });

    const idea = await caller.idea.get({ ideaId: ideaId });

    expect(idea?.title).toStrictEqual(title);
    expect(idea?.descriptionHtml).toStrictEqual(description);
  });
});
