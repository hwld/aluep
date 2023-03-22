// prismaのディレクトリが変わるたびに書き換えなくちゃいけない
jest.mock("./src/server/lib/prismadb", () => {
  return {
    prisma: jestPrisma.client,
  };
});
