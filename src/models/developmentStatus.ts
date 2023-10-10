export type DevStatus = { id: string; name: string };
export const DevStatusIds = {
  /** 開発中 */
  IN_PROGRESS: "1",
  /** 開発中止 */
  ABORTED: "2",
  /** 開発完了 */
  COMPLETED: "3",
};
