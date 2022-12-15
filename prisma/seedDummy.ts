import { faker } from "@faker-js/faker/locale/ja";
import { PrismaClient } from "@prisma/client";
import { Presets, SingleBar } from "cli-progress";

const prisma = new PrismaClient();

const bar = new SingleBar(
  { format: "{bar} | {percentage}% | {value}/{total}" },
  Presets.shades_classic
);

main();

async function main() {
  // シードを固定して、実行のたびに同じ値が生成されるようにする
  faker.seed(2);

  // ユーザーの作成
  const userIds = await createUsers(100);

  // お題の作成
  const themeIds = await createThemes(userIds, 50);

  // お題へのいいねの追加
  await createThemeLike({
    userIds,
    themeIds,
    // いいねされるお題の数
    likeThemeCounts: 25,
    // お題へのいいねの最大数 (自分の投稿にいいねができないので(ユーザー数 - お題の数) < いいねの最大数　の場合にはエラーが出る可能性がある
    maxThemeLikeCounts: 10,
  });

  // 開発者の作成
  const developerIds = await createDevelopers({
    userIds,
    themeIds,
    // 開発されるお題の数
    developThemeCounts: 25,
    // 開発に参加するユーザーの最大数
    maxDeveloperCounts: 15,
  });

  // 開発者へのいいねを追加
  await createDeveloperLikes({
    userIds,
    developerIds,
    // いいねされる開発者の数
    likeDeveloperCounts: 25,
    // 開発者へのいいねの最大数 (自分にいいねができないので(ユーザー数 - 一つのお題の最大開発者) < いいねの最大数　の場合にはエラーになる可能性がある)
    maxDeveloperLikeCounts: 10,
  });
}

/**
 * 指定された数のユーザーを作成する
 * @returns 作成したユーザーのIDのリスト
 */
async function createUsers(counts: number): Promise<string[]> {
  console.log("ユーザーの作成");

  bar.start(counts, 0);
  const userIds = [];

  for (let i = 0; i < counts; i++) {
    const id = faker.datatype.uuid();
    // 既に存在すれば作成日だけ更新する作成しない
    const user = await prisma.user.upsert({
      where: { id },
      create: { id, name: faker.name.fullName() },
      update: { createdAt: new Date() },
    });
    userIds.push(user.id);
    bar.increment();
  }
  bar.stop();
  console.log("");

  return userIds;
}

/**
 * お題を作成する
 * @return 作成したお題のIDのリスト
 */
async function createThemes(
  userIds: string[],
  counts: number
): Promise<string[]> {
  console.log("お題の作成");

  bar.start(counts, 0);
  const themeIds = [];

  for (let i = 0; i < counts; i++) {
    const id = faker.datatype.uuid();
    const theme = await prisma.appTheme.upsert({
      where: { id },
      create: {
        id,
        title: faker.lorem.words(3),
        description: faker.lorem.lines(),
        // 先頭のユーザーから投稿していく
        userId: userIds[i],
      },
      update: { createdAt: new Date() },
    });

    themeIds.push(theme.id);
    bar.increment();
  }
  bar.stop();
  console.log("");

  return themeIds;
}

type CreateThemeLikeParams = {
  userIds: string[];
  themeIds: string[];
  /** いいねされるお題の数 */
  likeThemeCounts: number;
  /** 一つのお題の最大のいいね数  */
  maxThemeLikeCounts: number;
};
/**
 * お題のいいねを追加する
 */
async function createThemeLike({
  userIds,
  themeIds,
  likeThemeCounts,
  maxThemeLikeCounts,
}: CreateThemeLikeParams) {
  console.log("お題にいいねを追加");

  // いいねされるお題をランダムで選択する
  const likeThemeIds = faker.helpers.arrayElements(themeIds, likeThemeCounts);

  // お題それぞれに何個いいねをつけるかを決めておく
  const themeLikeCountsList = [...new Array(likeThemeIds.length)].map(() =>
    faker.datatype.number({
      min: 1,
      max: maxThemeLikeCounts,
    })
  );

  // 何個のいいねを作成するか数える
  const sumThemeLikes = themeLikeCountsList.reduce(
    (prev, curr) => prev + curr,
    0
  );
  bar.start(sumThemeLikes, 0);

  for (let i = 0; i < likeThemeIds.length; i++) {
    // いいねをつけるお題のid
    const themeId = likeThemeIds[i];
    // いいねを何個つけるか
    const likeCounts = themeLikeCountsList[i];

    // ユーザーを後ろから走査していいねをつけていく。
    for (let userIndex = 0; userIndex < likeCounts; userIndex++) {
      const id = faker.datatype.uuid();
      await prisma.appThemeLike.upsert({
        where: { id },
        create: {
          id,
          appThemeId: themeId,
          userId: userIds[userIds.length - 1 - userIndex],
        },
        update: { createdAt: new Date() },
      });
      bar.increment();
    }
  }
  bar.stop();
  console.log("");
}

type CreateDevelopersParams = {
  themeIds: string[];
  userIds: string[];
  /** 開発されるお題の数 */
  developThemeCounts: number;
  /** 一つのお題に最大何人開発できるか */
  maxDeveloperCounts: number;
};
/** 開発者を作成 */
async function createDevelopers({
  themeIds,
  userIds,
  developThemeCounts,
  maxDeveloperCounts,
}: CreateDevelopersParams): Promise<string[]> {
  console.log("開発者の作成");

  // 開発されるお題をランダムで選択する
  const developThemeIds = faker.helpers.arrayElements(
    themeIds,
    developThemeCounts
  );
  // お題それぞれに何人参加するかを決めておく
  const themeDeveloperCountList = [...new Array(developThemeIds.length)].map(
    () => faker.datatype.number({ min: 1, max: maxDeveloperCounts })
  );

  // 開発者の総数を求める
  const sumDevelopers = themeDeveloperCountList.reduce(
    (prev, curr) => prev + curr,
    0
  );
  bar.start(sumDevelopers, 0);

  const developerIds = [];
  for (let i = 0; i < developThemeIds.length; i++) {
    // 開発されるお題のインデックス
    const themeId = developThemeIds[i];
    // 何人開発するか
    const developerCounts = themeDeveloperCountList[i];

    // ユーザーを先頭から走査して開発に参加させる。
    for (let userIndex = 0; userIndex < developerCounts; userIndex++) {
      const id = faker.datatype.uuid();
      const developer = await prisma.appThemeDeveloper.upsert({
        where: { id },
        create: {
          id,
          githubUrl: "",
          comment: faker.lorem.words(3),
          appThemeId: themeId,
          userId: userIds[userIndex],
        },
        update: { createdAt: new Date() },
      });
      developerIds.push(developer.id);
      bar.increment();
    }
  }
  bar.stop();
  console.log("");

  return developerIds;
}

type CreateDeveloperLikesParam = {
  userIds: string[];
  developerIds: string[];
  // 何人の開発者がいいねされるか
  likeDeveloperCounts: number;
  // 一人の開発者に最大何いいねされるか
  maxDeveloperLikeCounts: number;
};
/** 開発者へのいいねを追加する */
async function createDeveloperLikes({
  userIds,
  developerIds,
  likeDeveloperCounts,
  maxDeveloperLikeCounts,
}: CreateDeveloperLikesParam) {
  console.log("開発者へのいいねを追加");

  //　いいねされる開発者をランダムで選択する
  const likeDeveloperIds = faker.helpers.arrayElements(
    developerIds,
    likeDeveloperCounts
  );
  // 開発者それぞれに何個いいねをつけるかを決めておく
  const developerLikeCountsList = [...new Array(likeDeveloperIds.length)].map(
    () =>
      faker.datatype.number({
        min: 1,
        max: maxDeveloperLikeCounts,
      })
  );
  const sumDeveloperLikes = developerLikeCountsList.reduce(
    (prev, curr) => prev + curr,
    0
  );
  bar.start(sumDeveloperLikes, 0);
  for (let i = 0; i < likeDeveloperIds.length; i++) {
    // いいねをつける開発者のid
    const developerId = likeDeveloperIds[i];
    // いいねを何個つけるか
    const likeCounts = developerLikeCountsList[i];

    // ユーザーを後ろから走査していいねをつけていく
    for (let userIndex = 0; userIndex < likeCounts; userIndex++) {
      const id = faker.datatype.uuid();
      await prisma.appThemeDeveloperLike.upsert({
        where: { id },
        create: {
          id,
          developerId,
          userId: userIds[userIds.length - 1 - userIndex],
        },
        update: { createdAt: new Date() },
      });
      bar.increment();
    }
  }
  bar.stop();
  console.log("");
}
