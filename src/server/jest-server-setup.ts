import { faker } from "@faker-js/faker";

// prismaのディレクトリが変わるたびに書き換えなくちゃいけない
jest.mock("./lib/prismadb", () => {
  return {
    db: jestPrisma.client,
  };
});

// faker.jsのseedを固定する方法を用意する
const seed = process.env.FAKER_SEED
  ? faker.seed(Number(process.env.FAKER_SEED))
  : faker.seed();
console.log(`faker's seed: ${seed}`);
