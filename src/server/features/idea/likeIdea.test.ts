import { TestHelpers } from "../../tests/helper";

describe("お題へのいいねAPI", () => {
  it("いいねができる", async () => {
    const { caller, loginUserId } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();

    await caller.idea.like({ ideaId: idea.id });

    const liked = await caller.idea.isLikedByUser({
      userId: loginUserId ?? null,
      ideaId: idea.id,
    });
    expect(liked).toBe(true);
  });

  it("自分が投稿したお題にいいねはできない", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const createdIdea = await caller.idea.create({
      title: "title",
      descriptionHtml: "<p>body</p>",
      tags: [],
    });

    const promise = caller.idea.like({ ideaId: createdIdea.ideaId });

    await expect(promise).rejects.toThrow();
  });
});
