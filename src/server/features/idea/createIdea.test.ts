import { db } from "@/server/lib/prismadb";
import { TestHelpers } from "@/server/tests/helper";
import { faker } from "@faker-js/faker";

describe("お題の作成API", () => {
  it("ログインしていないとお題を作成することはできない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.idea.create({
      title: "test-title",
      descriptionHtml: "<p>test</p>",
      tags: [],
    });

    await expect(promise).rejects.toThrow();
  });

  it("お題を作成し、作成したお題を取得することができる", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const title = "test-title";
    const descriptionHtml = "<p>test-description</p>";

    const { ideaId } = await caller.idea.create({
      title,
      descriptionHtml: descriptionHtml,
      tags: [],
    });

    const idea = await caller.idea.get({ ideaId: ideaId });
    expect(idea?.title).toBe(title);
    expect(idea?.descriptionHtml).toStrictEqual(descriptionHtml);
  });

  describe("XSS対策", () => {
    it.each([
      ['<script>alert("XSS")</script>', ""],
      [
        '<a href="javascript:alert("XSS")" target="_blank">link</a>',
        '<a target="_blank">link</a>',
      ],
    ])('"%s" -> "%s"', async (input, expected) => {
      const { caller } = await TestHelpers.createSessionCaller({
        userName: "user",
      });
      const { ideaId } = await caller.idea.create({
        title: "title",
        descriptionHtml: input,
        tags: [],
      });

      const idea = await caller.idea.get({ ideaId });
      expect(idea?.descriptionHtml).toStrictEqual(expected);
    });
  });

  describe("バリデーションが失敗する入力", () => {
    it.each([
      ["未入力のタイトル", { title: "", body: "<p>body</p>", tags: [] }],
      [
        "51文字のタイトル",
        { title: faker.datatype.string(51), body: "<p>body</p>", tags: [] },
      ],
      ["未入力の説明", { title: "title", body: "<p></p>", tags: [] }],
      [
        "10001文字の説明",
        {
          title: "title",
          body: `<p>${faker.datatype.string(10001 - 7)}</p>`,
          tags: [],
        },
      ],
      [
        "101文字のタグID",
        {
          title: "title",
          body: "<p>body</p>",
          tags: [faker.datatype.string(101)],
        },
      ],
      [
        "51個のタグ",
        {
          title: "title",
          body: "<p>body</p>",
          tags: [...new Array(51)].map((_) => faker.datatype.string(10)),
        },
      ],
    ])("%s", async (_, { title, body, tags }) => {
      const { caller } = await TestHelpers.createSessionCaller({
        userName: "user",
      });
      await db.ideaTag.createMany({
        data: tags.map((t) => ({ id: t, name: t })),
      });

      const promise = caller.idea.create({
        title,
        descriptionHtml: body,
        tags,
      });

      await expect(promise).rejects.toThrow();
    });
  });
});
