import { faker } from "@faker-js/faker/locale/ja";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // シードを固定する
  faker.seed(1);

  const numOfUsers = 50;
  // ユーザーを作成する
  const userIds = [];
  for (let i = 0; i < numOfUsers; i++) {
    const id = faker.datatype.uuid();
    // 既に存在すれば作成日だけ更新する作成しない
    const user = await prisma.user.upsert({
      where: { id },
      create: { id, name: faker.name.fullName() },
      update: { createdAt: new Date() },
    });
    userIds.push(user.id);
    console.log(`ユーザーを追加 ${i}`);
  }

  // 各ユーザーがテーマを作成する
  const themeIds = [];
  for (let i = 0; i < userIds.length; i++) {
    const id = faker.datatype.uuid();
    const theme1 = await prisma.appTheme.upsert({
      where: { id },
      create: {
        id,
        title: faker.lorem.words(3),
        description: faker.lorem.lines(),
        userId: userIds[i],
      },
      update: { createdAt: new Date() },
    });
    console.log(`お題を追加 ${i}`);

    themeIds.push(theme1.id);
  }

  // お題に良いねする
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    // 自分よりindexが小さいユーザーが投稿したお題すべてにいいねして、いいね数に差をつける
    for (let themeIndex = 0; themeIndex < userIndex; themeIndex++) {
      const id = faker.datatype.uuid();
      await prisma.appThemeLike.upsert({
        where: { id },
        create: {
          id,
          appThemeId: themeIds[themeIndex],
          userId: userIds[userIndex],
        },
        update: { createdAt: new Date() },
      });
      console.log(
        `お題へのいいねを追加 ユーザー:${userIndex} お題:${themeIndex}`
      );
    }
  }

  const developerIds = [];
  const userDeveloperMap = new Map(
    userIds.map((_, userIndex) => [userIndex, [] as string[]])
  );
  const themeDeveloperMap = new Map(
    themeIds.map((_, themeIndex) => [themeIndex, [] as string[]])
  );

  // お題に参加する
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    // 自分よりindexが小さいユーザーが投稿したお題すべてに参加する
    for (let themeIndex = 0; themeIndex < userIndex; themeIndex++) {
      const id = faker.datatype.uuid();
      const developer = await prisma.appThemeDeveloper.upsert({
        where: { id },
        create: {
          id,
          githubUrl: "",
          comment: faker.lorem.words(3),
          appThemeId: themeIds[themeIndex],
          userId: userIds[userIndex],
        },
        update: { createdAt: new Date() },
      });
      console.log(`お題に参加 ユーザー:${userIndex} お題:${themeIndex}`);

      developerIds.push(developer.id);
      userDeveloperMap.set(userIndex, [
        ...(userDeveloperMap.get(userIndex) ?? []),
        developer.id,
      ]);
      themeDeveloperMap.set(themeIndex, [
        ...(themeDeveloperMap.get(themeIndex) ?? []),
        developer.id,
      ]);
    }
  }

  // 自分よりindexが小さいユーザーが投稿したお題の自分以外の最初の開発者にいいねする。
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    for (let themeIndex = 0; themeIndex < userIndex; themeIndex++) {
      // お題の最初の開発者のidを取得する
      const firstDeveloperId =
        themeDeveloperMap.get(themeIndex)?.[0] ?? undefined;
      // 最初の開発者が存在しないか、自分が開発者だった場合は何もしない
      if (
        firstDeveloperId === undefined ||
        userDeveloperMap.get(userIndex)?.includes(firstDeveloperId)
      ) {
        continue;
      }

      const id = faker.datatype.uuid();
      await prisma.appThemeDeveloperLike.upsert({
        where: { id },
        create: {
          id,
          userId: userIds[userIndex],
          developerId: firstDeveloperId,
        },
        update: { createdAt: new Date() },
      });
      console.log(
        `開発者へのいいねを追加 ユーザー:${userIndex} 開発者:${firstDeveloperId}`
      );
    }
  }
}
main();
