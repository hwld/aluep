import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ユーザーを作成
  await prisma.user.upsert({
    where: { id: "user1" },
    create: { id: "user1", name: "user1" },
    update: {},
  });
  await prisma.user.upsert({
    where: { id: "user2" },
    create: { id: "user2", name: "user2" },
    update: {},
  });
  console.log("ユーザーを作成");

  // それぞれがお題を投稿
  await prisma.appTheme.upsert({
    where: { id: "theme1" },
    create: {
      id: "theme1",
      title: "from user1",
      description: "",
      userId: "user1",
    },
    update: {},
  });
  await prisma.appTheme.upsert({
    where: { id: "theme2" },
    create: {
      id: "theme2",
      title: "from user2",
      description: "",
      userId: "user2",
    },
    update: {},
  });
  console.log("お題を投稿");

  // それぞれが別のユーザーのお題にいいねする
  await prisma.appThemeLike.upsert({
    where: { id: "like1" },
    create: { id: "like1", appThemeId: "theme1", userId: "user2" },
    update: {},
  });
  await prisma.appThemeLike.upsert({
    where: { id: "like2" },
    create: { id: "like2", appThemeId: "theme2", userId: "user1" },
    update: {},
  });
  console.log("お題にいいね");
}

main();
