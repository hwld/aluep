import { addYears } from "date-fns";
import { createRequest } from "node-mocks-http";
import { prisma } from "../prismadb";
import { appRouter } from "./_app";

describe("server/routers/theme.ts", () => {
  it("お題を作成し、作成したお題を取得することができる", async () => {
    const createdUser = await prisma.user.create({ data: { name: "user" } });

    const caller = appRouter.createCaller({
      session: {
        user: createdUser,
        expires: addYears(new Date(), 1).toUTCString(),
      },
      req: createRequest(),
    });

    const title = "test-title";
    const description = "test-description";
    const { themeId } = await caller.theme.create({
      title,
      description,
      tags: [],
    });

    const theme = await caller.theme.get({ themeId });

    expect(theme?.title).toStrictEqual(title);
    expect(theme?.description).toStrictEqual(description);
  });
});
