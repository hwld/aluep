import { TestHelpers } from "../../tests/helper";

describe("お題へのいいねAPI", () => {
  it("いいねができる", async () => {
    const { caller, loginUserId } = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const createdIdea = await TestHelpers.createUserAndIdea();

    await caller.idea.like({ ideaId: createdIdea.id });

    const liked = await caller.idea.isLikedByUser({
      userId: loginUserId ?? null,
      ideaId: createdIdea.id,
    });
    expect(liked).toBe(true);
  });

  it("自分が投稿したお題にいいねはできない", async () => {
    const { caller } = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const createdIdea = await caller.idea.create({
      title: "title",
      descriptionHtml: "<p>body</p>",
      tags: [],
    });

    const promise = caller.idea.like({ ideaId: createdIdea.ideaId });

    expect(promise).rejects.toThrow();
  });
});
