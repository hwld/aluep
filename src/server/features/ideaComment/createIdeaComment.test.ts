import { faker } from "@faker-js/faker";
import { TestHelpers } from "../../tests/helper";

describe("お題のコメントAPI", () => {
  it("お題にコメントできる", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();
    const comment = "comment";

    await caller.ideaComment.create({ ideaId: idea.id, comment });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(1);
    expect(comments[0].comment).toBe(comment);
  });

  it("お題に返信できる", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { commentId: parentCommentId } = await caller.ideaComment.create({
      ideaId: idea.id,
      comment: "first",
    });

    await caller.ideaComment.create({
      ideaId: idea.id,
      comment: "comment",
      inReplyToCommentId: parentCommentId,
    });

    const comments = await caller.ideaComment.getAll({ ideaId: idea.id });
    expect(comments.length).toBe(2);
    expect(comments[1].inReplyToComment?.id).toBe(parentCommentId);
  });

  describe("バリデーションが失敗する入力", () => {
    it.each([
      ["空のコメント", { comment: "", replyToId: "" }],
      ["2001文字のコメント", { comment: faker.datatype.string(2001) }],
    ])("%s", async (_, { comment }) => {
      const { caller } = await TestHelpers.createSessionCaller({
        userName: "user",
      });
      const { idea } = await TestHelpers.createIdeaAndUser();

      const promise = caller.ideaComment.create({ ideaId: idea.id, comment });

      await expect(promise).rejects.toThrow();
    });
  });
});
