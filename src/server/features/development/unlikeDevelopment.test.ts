import { TestHelpers } from "@/server/tests/helper";

describe("開発情報へのいいね解除API", () => {
  it("いいねを解除できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    await caller.development.like({ developmentId: development.id });

    await caller.development.unlike({ developmentId: development.id });

    const dev = await caller.development.get({ developmentId: development.id });
    expect(dev).not.toBeUndefined();
    const liked = dev!.likedByLoggedInUser;
    expect(liked).toBe(false);
  });
});
