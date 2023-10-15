import { TestHelpers } from "@/server/tests/helper";

describe("開発情報メモの削除API", () => {
  it("自分が投稿したメモを削除できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev, developerCaller } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { memoId } = await developerCaller.devMemo.create({
      devId: dev.id,
      text: "memo",
    });

    await developerCaller.devMemo.delete({ devMemoId: memoId });

    const memos = await developerCaller.devMemo.getAll({
      devId: dev.id,
    });
    expect(memos.length).toBe(0);
  });

  it("自分以外が投稿したコメントは削除できない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev, developerCaller } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { memoId } = await developerCaller.devMemo.create({
      devId: dev.id,
      text: "memo",
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const promise = caller.devMemo.delete({
      devMemoId: memoId,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはメモを削除できない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { memo } = await TestHelpers.createDevMemoAndUser({
      devId: dev.id,
    });
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.devMemo.delete({
      devMemoId: memo.id,
    });

    await expect(promise).rejects.toThrow();
  });
});
