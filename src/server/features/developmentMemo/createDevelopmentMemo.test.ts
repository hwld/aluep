import { TestHelpers } from "@/server/tests/helper";
import { faker } from "@faker-js/faker/locale/ja";

describe("開発情報メモ作成API", () => {
  it("自分の開発情報にメモを残せる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({
        ideaId: idea.id,
      });
    const text = "memo";

    const { memoId } = await developerCaller.developmentMemo.create({
      developmentId: development.id,
      text,
    });

    const memos = await developerCaller.developmentMemo.getAll({
      developmentId: development.id,
    });
    expect(memos.length).toBe(1);
    expect(memos[0].id).toBe(memoId);
    expect(memos[0].text).toBe(text);
  });

  it("自分が自分のメモに返信できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({ ideaId: idea.id });
    const { memoId: parentMemoId } =
      await developerCaller.developmentMemo.create({
        developmentId: development.id,
        text: "parent",
      });

    const { memoId: childMemoId } =
      await developerCaller.developmentMemo.create({
        developmentId: development.id,
        text: "memo",
        parentMemoId: parentMemoId,
      });

    const memos = await developerCaller.developmentMemo.getAll({
      developmentId: development.id,
    });
    expect(memos.length).toBe(2);
    expect(memos[0].id).toBe(parentMemoId);
    expect(memos[1].id).toBe(childMemoId);
    expect(memos[1].parentMemoId).toBe(parentMemoId);
  });

  it("許可されている場合、他のユーザーのメモに返信できる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({
        ideaId: idea.id,
        allowOtherUserMemos: true,
      });
    const { memoId: parentMemoId } =
      await developerCaller.developmentMemo.create({
        developmentId: development.id,
        text: "parent",
      });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const { memoId: childMemoId } = await caller.developmentMemo.create({
      developmentId: development.id,
      text: "child",
      parentMemoId,
    });

    const memos = await caller.developmentMemo.getAll({
      developmentId: development.id,
    });
    expect(memos.length).toBe(2);
    expect(memos[0].id).toBe(parentMemoId);
    expect(memos[1].id).toBe(childMemoId);
    expect(memos[1].parentMemoId).toBe(parentMemoId);
  });

  it("許可されていない場合、他のユーザーのメモに返信できない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development, developerCaller } =
      await TestHelpers.createDevelopmentAndUser({
        ideaId: idea.id,
        allowOtherUserMemos: false,
      });
    const { memoId: parentMemoId } =
      await developerCaller.developmentMemo.create({
        developmentId: development.id,
        text: "parent",
      });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const promise = caller.developmentMemo.create({
      developmentId: development.id,
      text: "child",
      parentMemoId,
    });

    await expect(promise).rejects.toThrow();
  });

  it("他のユーザーの開発情報には返信ではないコメントができない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
      allowOtherUserMemos: true,
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    const promise = caller.developmentMemo.create({
      developmentId: development.id,
      text: "memo",
    });

    const memos = await caller.developmentMemo.getAll({
      developmentId: development.id,
    });
    expect(memos.length).toBe(0);
    await expect(promise).rejects.toThrow();
  });

  describe("バリデーションが失敗する入力", () => {
    it.each([
      ["空のメモ", { text: "" }],
      ["2001文字のメモ", { text: faker.datatype.string(2001) }],
    ])("%s", async (_, { text }) => {
      const { idea } = await TestHelpers.createIdeaAndUser();
      const { development, developerCaller } =
        await TestHelpers.createDevelopmentAndUser({
          ideaId: idea.id,
        });

      const promise = developerCaller.developmentMemo.create({
        developmentId: development.id,
        text,
      });

      await expect(promise).rejects.toThrow();
    });
  });
});
