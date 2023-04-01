import { TestHelpers } from "../../tests/helper";

describe("お題コメント削除API", () => {
  it("コメントを削除できる", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { commentId } = await caller.ideaComment.comment({
      ideaId: idea.id,
      comment: "commet",
    });

    await caller.ideaComment.delete({ commentId });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(0);
  });

  it("自分以外のコメントは削除できない", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { comment } = await TestHelpers.createIdeaCommentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.ideaComment.delete({ commentId: comment.id });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはコメントを削除できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { comment } = await TestHelpers.createIdeaCommentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.ideaComment.delete({ commentId: comment.id });

    await expect(promise).rejects.toThrow();
  });
});
