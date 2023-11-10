import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function addDefaultDevTitle() {
  await db.$transaction(async (tx) => {
    const devs = await tx.development.findMany({ include: { idea: true } });

    const promises = devs.map((d) => {
      const title = `"${d.idea?.title ?? "削除されたお題"}"の開発`;

      return tx.development.update({
        where: { id: d.id },
        data: { title },
      });
    });

    await Promise.all(promises);
  });
}

addDefaultDevTitle();
