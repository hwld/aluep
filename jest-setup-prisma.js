// prismaのディレクトリが変わるたびに書き換えなくちゃいけない
jest.mock("./src/server/prismadb", () => {
  return {
    prisma: jestPrisma.client,
  };
});
