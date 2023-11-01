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
import { dbSchema } from "@/server/dbSchema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cwd } from "process";
import { loadEnvConfig } from "@next/env";
import { DATABASE_URL } from "@/../drizzle/standaloneEnv";

loadEnvConfig(cwd());
const connection = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(connection, {
  schema: { ...dbSchema },
});

async function main() {
  // シードを固定する
  faker.seed(1);

  const numOfUsers = 50;
  // ユーザーを作成する
  const userIds = [];
  for (let i = 0; i < numOfUsers; i++) {
    const id = faker.string.uuid();
    // 既に存在すれば作成日だけ更新する作成しない
    const user = await db
      .insert(dbSchema.users)
      .values({ id, name: faker.person.fullName() })
      .onConflictDoNothing()
      .returning({ id: dbSchema.users.id });

    userIds.push(user[0].id);
    console.log(`ユーザーを追加 ${i}`);
  }

  // 各ユーザーがテーマを作成する
  const ideaIds = [];
  for (let i = 0; i < userIds.length; i++) {
    const id = faker.string.uuid();
    const idea = await db
      .insert(dbSchema.ideas)
      .values({
        id,
        title: faker.lorem.words(3),
        description: faker.lorem.lines(),
        userId: userIds[i],
      })
      .onConflictDoNothing()
      .returning({ id: dbSchema.ideas.id });

    console.log(`お題を追加 ${i}`);

    ideaIds.push(idea[0].id);
  }

  // お題に良いねする
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    // 自分よりindexが小さいユーザーが投稿したお題すべてにいいねして、いいね数に差をつける
    for (let ideaIndex = 0; ideaIndex < userIndex; ideaIndex++) {
      const id = faker.string.uuid();
      await db
        .insert(dbSchema.ideaLikes)
        .values({ id, ideaId: ideaIds[ideaIndex], userId: userIds[userIndex] })
        .onConflictDoNothing();

      console.log(
        `お題へのいいねを追加 ユーザー:${userIndex} お題:${ideaIndex}`
      );
    }
  }

  const devIds = [];
  const userDevelopmentMap = new Map<number, string[]>(
    userIds.map((_, userIndex) => [userIndex, []])
  );
  const devMap = new Map<number, string[]>(
    ideaIds.map((_, ideaIndex) => [ideaIndex, []])
  );

  // お題を開発する
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    // 自分よりindexが小さいユーザーが投稿したお題すべてを開発する
    for (let ideaIndex = 0; ideaIndex < userIndex; ideaIndex++) {
      const id = faker.string.uuid();
      const dev = await db
        .insert(dbSchema.developments)
        .values({
          id,
          githubUrl: "",
          comment: faker.lorem.words(3),
          developedItemUrl: "",
          ideaId: ideaIds[ideaIndex],
          userId: userIds[userIndex],
          status: faker.helpers.arrayElement([
            "IN_PROGRESS",
            "COMPLETED",
            "ABORTED",
          ]),
        })
        .onConflictDoNothing()
        .returning({ id: dbSchema.developments.id });

      console.log(`お題を開発 ユーザー:${userIndex} お題:${ideaIndex}`);

      devIds.push(dev[0].id);
      userDevelopmentMap.set(userIndex, [
        ...(userDevelopmentMap.get(userIndex) ?? []),
        dev[0].id,
      ]);
      devMap.set(ideaIndex, [...(devMap.get(ideaIndex) ?? []), dev[0].id]);
    }
  }

  // 自分よりindexが小さいユーザーが投稿したお題の自分以外の最初の開発者にいいねする。
  for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
    for (let ideaIndex = 0; ideaIndex < userIndex; ideaIndex++) {
      // お題の最初の開発者のidを取得する
      const firstDevelopmentId = devMap.get(ideaIndex)?.[0] ?? undefined;
      // 最初の開発者が存在しないか、自分が開発者だった場合は何もしない
      if (
        firstDevelopmentId === undefined ||
        userDevelopmentMap.get(userIndex)?.includes(firstDevelopmentId)
      ) {
        continue;
      }

      const id = faker.string.uuid();
      await db
        .insert(dbSchema.developmentLikes)
        .values({
          id,
          userId: userIds[userIndex],
          developmentId: firstDevelopmentId,
        })
        .onConflictDoNothing();

      console.log(
        `開発者へのいいねを追加 ユーザー:${userIndex} 開発者:${firstDevelopmentId}`
      );
    }
  }
}

main()
  .then(() => {
    console.log("success");
    connection.end();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    connection.end();
    process.exit(1);
  });
