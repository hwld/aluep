import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  // TODO: SQLiteだとcreateMany使えないので・・・
  // TODO:
  const tags = [
    "Java",
    "Spring Boot",
    "Webアプリ",
    "スマホアプリ",
    "Safari",
    "Kotlin",
    "C#",
  ];

  const promises = tags.map((tag) =>
    prisma.appThemeTag.upsert({
      where: { name: tag },
      create: { name: tag },
      update: {},
    })
  );

  await prisma.$transaction(promises);
}
