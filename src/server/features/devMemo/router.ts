import { createDevMemo } from "@/server/features/devMemo/createDeveMemo";
import { deleteDevMemo } from "@/server/features/devMemo/deleteDevMemo";
import { getAllDevMemos } from "@/server/features/devMemo/getAllDevMemos";
import { router } from "@/server/lib/trpc";

export const devMemoRoute = router({
  create: createDevMemo,
  delete: deleteDevMemo,
  getAll: getAllDevMemos,
});
