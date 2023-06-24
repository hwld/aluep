import { createDevelopmentMemo } from "@/server/features/developmentMemo/createDevelopmentMemo";
import { deleteDevelopmentMemo } from "@/server/features/developmentMemo/deleteDevelopmentMemo";
import { getAllDevelopmentMemos } from "@/server/features/developmentMemo/getAllDevelopmentMemos";
import { router } from "@/server/lib/trpc";

export const developmentMemoRoute = router({
  create: createDevelopmentMemo,
  delete: deleteDevelopmentMemo,
  getAll: getAllDevelopmentMemos,
});
