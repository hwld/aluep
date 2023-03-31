import { TestHelpers } from "../../tests/helper";

describe("お題へいいね解除API", () => {
  it("いいね解除できる", async () => {
    const { caller, loginUserId } = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const createdIdea = await TestHelpers.createUserAndIdea();
    await caller.idea.like({ ideaId: createdIdea.id });

    await caller.idea.unlike({ ideaId: createdIdea.id });

    const liked = await caller.idea.isLikedByUser({
      userId: loginUserId ?? null,
      ideaId: createdIdea.id,
    });
    expect(liked).toBe(false);
  });
});
