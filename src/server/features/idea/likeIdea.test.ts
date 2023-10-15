import { TestHelpers } from "@/server/tests/helper";

describe("お題へのいいねAPI", () => {
  it("いいねができる", async () => {
    const { caller, loginUserId } =
      await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    await caller.idea.like({ ideaId: idea.id });

    const liked = await caller.idea.isLikedByUser({
      userId: loginUserId ?? null,
      ideaId: idea.id,
    });
    expect(liked).toBe(true);
  });

  it("未ログインユーザーはお題にいいねすることはできない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.dev.like({ devId: dev.id });

    await expect(promise).rejects.toThrow();
  });

  it("自分が投稿したお題にいいねはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const createdIdea = await caller.idea.create({
      title: "title",
      descriptionHtml: "<p>body</p>",
      tags: [],
    });

    const promise = caller.idea.like({ ideaId: createdIdea.ideaId });

    await expect(promise).rejects.toThrow();
  });

  it("2回いいねすることはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    await caller.idea.like({ ideaId: idea.id });

    const promise = caller.idea.like({ ideaId: idea.id });

    await expect(promise).rejects.toThrow();
  });
});
