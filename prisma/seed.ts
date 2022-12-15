import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
    prisma.appThemeTag.upsert({
      where: { name: tag },
      create: { name: tag },
      update: {},
    })
  );
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
