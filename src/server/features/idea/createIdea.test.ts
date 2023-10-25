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
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const title = "test-title";
    const descriptionHtml =
      "<html><head></head><body><p>test-description</p></body></html>";

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
      [
        '<html><head></head><body><script>alert("XSS")</script></body></html>',
        "<html><head></head><body></body></html>",
      ],
      [
        '<html><head></head><body><a href="javascript:alert("XSS")" target="_blank" rel="noopener noreferrer">link</a></body></html>',
        '<html><head></head><body><a target="_blank" rel="noopener noreferrer">link</a></body></html>',
      ],
    ])('"%s" -> "%s"', async (input, expected) => {
      const { caller } = await TestHelpers.createNewUserSessionCaller();

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
        { title: faker.string.sample(51), body: "<p>body</p>", tags: [] },
      ],
      ["未入力の説明", { title: "title", body: "<p></p>", tags: [] }],
      [
        "10001文字の説明",
        {
          title: "title",
          body: `<p>${faker.string.sample(10001 - 7)}</p>`,
          tags: [],
        },
      ],
      [
        "101文字のタグID",
        {
          title: "title",
          body: "<p>body</p>",
          tags: [faker.string.sample(101)],
        },
      ],
      [
        "51個のタグ",
        {
          title: "title",
          body: "<p>body</p>",
          tags: [...new Array(51)].map((_) => faker.string.sample(10)),
        },
      ],
    ])("%s", async (_, { title, body, tags }) => {
      const { caller } = await TestHelpers.createNewUserSessionCaller();
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
