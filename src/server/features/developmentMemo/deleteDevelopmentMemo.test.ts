import { TestHelpers } from "@/server/tests/helper";

describe("開発情報メモの削除API", () => {
  it("自分が投稿したメモを削除できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({
        ideaId: idea.id,
      });
    const { memoId } = await developerCaller.developmentMemo.create({
      developmentId: development.id,
      text: "memo",
    });

    await developerCaller.developmentMemo.delete({ developmentMemoId: memoId });

    const memos = await developerCaller.developmentMemo.getAll({
      developmentId: development.id,
    });
    expect(memos.length).toBe(0);
  });

  it("自分以外が投稿したコメントは削除できない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({
        ideaId: idea.id,
      });
    const { memoId } = await developerCaller.developmentMemo.create({
      developmentId: development.id,
      text: "memo",
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const promise = caller.developmentMemo.delete({
      developmentMemoId: memoId,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはメモを削除できない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });
    const { memo } = await TestHelpers.createDevelopmentMemoAndUser({
      developmentId: development.id,
    });
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.developmentMemo.delete({
      developmentMemoId: memo.id,
    });

    await expect(promise).rejects.toThrow();
  });
});
