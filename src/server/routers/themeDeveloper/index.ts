import { router } from "../../trpc";
import { deleteDeveloper } from "./deleteDeveloper";
import { getDeveloper } from "./getDeveloper";
import { likeDeveloper } from "./likeDeveloper";
import { updateDeveloper } from "./updateDeveloper";

export const themeDeveloperRoute = router({
  /** 開発者を取得する */
  get: getDeveloper,

  /** 開発者を削除する */
  delete: deleteDeveloper,

  /** 開発者を更新する */
  update: updateDeveloper,

  /** 開発者にいいねする */
  like: likeDeveloper,
});
