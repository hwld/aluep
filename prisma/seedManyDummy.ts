/**
 * 大量のダミーデータを作成
 *
 * 作成するデータの詳細
 * ・ユーザー数: 50
 * ・お題の数: 50
 * ・お題へのいいね総数: 1225
 *   ・各お題に0~49のいいね
 * ・お題の開発者総数: 1225
 *   ・各お題に0~49の開発者
 * ・お題の開発者へのいいね総数: 1176
 *   ・各お題の開発者一人に0~49のいいね
 */

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

  const developmentIds = [];
  const userDevelopmentMap = new Map<number, string[]>(
    userIds.map((_, userIndex) => [userIndex, []])
  );
  const themeDevelopmentMap = new Map<number, string[]>(
    themeIds.map((_, themeIndex) => [themeIndex, []])
  );

  // お題を開発する
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    // 自分よりindexが小さいユーザーが投稿したお題すべてを開発する
    for (let themeIndex = 0; themeIndex < userIndex; themeIndex++) {
      const id = faker.datatype.uuid();
      const development = await prisma.appThemeDevelopment.upsert({
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
      console.log(`お題を開発 ユーザー:${userIndex} お題:${themeIndex}`);

      developmentIds.push(development.id);
      userDevelopmentMap.set(userIndex, [
        ...(userDevelopmentMap.get(userIndex) ?? []),
        development.id,
      ]);
      themeDevelopmentMap.set(themeIndex, [
        ...(themeDevelopmentMap.get(themeIndex) ?? []),
        development.id,
      ]);
    }
  }

  // 自分よりindexが小さいユーザーが投稿したお題の自分以外の最初の開発者にいいねする。
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    for (let themeIndex = 0; themeIndex < userIndex; themeIndex++) {
      // お題の最初の開発者のidを取得する
      const firstDevelopmentId =
        themeDevelopmentMap.get(themeIndex)?.[0] ?? undefined;
      // 最初の開発者が存在しないか、自分が開発者だった場合は何もしない
      if (
        firstDevelopmentId === undefined ||
        userDevelopmentMap.get(userIndex)?.includes(firstDevelopmentId)
      ) {
        continue;
      }

      const id = faker.datatype.uuid();
      await prisma.appThemeDevelopmentLike.upsert({
        where: { id },
        create: {
          id,
          userId: userIds[userIndex],
          developmentId: firstDevelopmentId,
        },
        update: { createdAt: new Date() },
      });
      console.log(
        `開発者へのいいねを追加 ユーザー:${userIndex} 開発者:${firstDevelopmentId}`
      );
    }
  }
}
main();
