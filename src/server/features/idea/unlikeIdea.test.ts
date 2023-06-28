import { TestHelpers } from "@/server/tests/helper";

describe("お題へいいね解除API", () => {
  it("いいね解除できる", async () => {
    const { caller, loginUserId } =
      await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    await caller.idea.like({ ideaId: idea.id });

    await caller.idea.unlike({ ideaId: idea.id });

    const liked = await caller.idea.isLikedByUser({
      userId: loginUserId ?? null,
      ideaId: idea.id,
    });
    expect(liked).toBe(false);
  });
});
