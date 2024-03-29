import { TestHelpers } from "@/server/tests/helper";

describe("お題の削除API", () => {
  it("他人が投稿したお題を削除することはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.idea.delete({ ideaId: idea.id });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはお題を削除することはできない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.idea.delete({ ideaId: idea.id });

    await expect(promise).rejects.toThrow();
  });

  it("存在するお題を削除することができる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { ideaId } = await caller.idea.create({
      title: "title",
      descriptionHtml: "<p>body</p>",
      tags: [],
    });

    await caller.idea.delete({ ideaId });

    const promise = caller.idea.get({ ideaId });
    await expect(promise).rejects.toThrow();
  });
});
