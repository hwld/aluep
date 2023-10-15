import { TestHelpers } from "@/server/tests/helper";

describe("開発情報へのいいね解除API", () => {
  it("いいねを解除できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    await caller.dev.like({ devId: dev.id });

    await caller.dev.unlike({ devId: dev.id });

    const gettedDev = await caller.dev.get({ devId: dev.id });
    expect(dev).not.toBeUndefined();
    const liked = gettedDev!.likedByLoggedInUser;
    expect(liked).toBe(false);
  });
});
