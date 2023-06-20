import { router } from "../../lib/trpc";
import { createDevelopmentMemo } from "./createDevelopmentMemo";
import { deleteDevelopmentMemo } from "./deleteDevelopmentMemo";
import { getAllDevelopmentMemos } from "./getAllDevelopmentMemos";

export const developmentMemoRoute = router({
  create: createDevelopmentMemo,
  delete: deleteDevelopmentMemo,
  getAll: getAllDevelopmentMemos,
});
