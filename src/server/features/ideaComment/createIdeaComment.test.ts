import { TestHelpers } from "@/server/tests/helper";
import { faker } from "@faker-js/faker";

describe("お題のコメントAPI", () => {
  it("お題にコメントできる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const text = "comment";

    const { commentId } = await caller.ideaComment.create({
      ideaId: idea.id,
      text,
    });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(1);
    expect(comments[0].id).toBe(commentId);
    expect(comments[0].text).toBe(text);
  });

  it("お題に返信できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { commentId: parentCommentId } = await caller.ideaComment.create({
      ideaId: idea.id,
      text: "first",
    });

    await caller.ideaComment.create({
      ideaId: idea.id,
      text: "comment",
      inReplyToCommentId: parentCommentId,
    });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(2);
    expect(comments[1].inReplyToComment?.id).toBe(parentCommentId);
  });

  describe("バリデーションが失敗する入力", () => {
    it.each([
      ["空のコメント", { comment: "", replyToId: "" }],
      ["2001文字のコメント", { comment: faker.string.sample(2001) }],
    ])("%s", async (_, { comment }) => {
      const { caller } = await TestHelpers.createNewUserSessionCaller();
      const { idea } = await TestHelpers.createIdeaAndUser();

      const promise = caller.ideaComment.create({
        ideaId: idea.id,
        text: comment,
      });

      await expect(promise).rejects.toThrow();
    });
  });
});
