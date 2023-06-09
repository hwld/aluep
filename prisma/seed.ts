import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function upsertIdeaTags() {
  const tags = [
    "Webアプリ",
    "Webフロントエンド",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "Webバックエンド",
    "Java",
    "Spring Boot",
    "PHP",
    "Laravel",
    "Ruby",
    "Ruby on Rails",
    "Python",
    "Django",
    "Flask",
    "Go",
    "Rust",
    "スマホアプリ",
    "Swift",
    "Kotlin",
    "Flutter",
    "React Native",
    "デスクトップアプリ",
    "C#",
    "C",
    "C++",
  ];

  const promises = tags.map((tag) =>
    prisma.ideaTag.upsert({
      where: { name: tag },
      create: { name: tag },
      update: {},
    })
  );

  return promises;
}

function upsertDevelopmentStatuses() {
  // ID変えるとプログラムが壊れちゃう
  const statuses = [
    { id: 1, name: "開発中" },
    { id: 2, name: "開発中止" },
    { id: 3, name: "開発済み" },
  ];

  const promises = statuses.map((status) => {
    return prisma.developmentStatus.upsert({
      where: { id: status.id },
      create: { id: status.id, name: status.name },
      update: {},
    });
  });

  return promises;
}

async function main() {
  const promises = [...upsertIdeaTags(), ...upsertDevelopmentStatuses()];
  await prisma.$transaction(promises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
