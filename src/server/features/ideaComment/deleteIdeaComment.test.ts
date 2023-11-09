import { TestHelpers } from "@/server/tests/helper";

describe("お題コメント削除API", () => {
  it("コメントを削除できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { commentId } = await caller.ideaComment.create({
      ideaId: idea.id,
      text: "commet",
    });

    await caller.ideaComment.delete({ commentId });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(0);
  });

  it("自分以外のコメントは削除できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
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

  it("返信元のコメントが削除されたら返信元がnullになる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { comment: parentComment, commenterCaller: parentCaller } =
      await TestHelpers.createIdeaCommentAndUser({
        ideaId: idea.id,
      });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const { commentId } = await caller.ideaComment.create({
      ideaId: idea.id,
      text: "comment",
      parentCommentId: parentComment.id,
    });
    await parentCaller.ideaComment.delete({ commentId: parentComment.id });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(1);
    expect(comments[0].id).toBe(commentId);
    expect(comments[0].parentComment).toBeNull();
  });
});
