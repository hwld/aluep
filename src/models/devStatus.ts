import type { DevelopmentStatus } from "@prisma/client";
import { z } from "zod";

export type DevStatus = DevelopmentStatus;
export const DevStatusNames: { [T in DevStatus]: string } = {
  /** 開発中 */
  IN_PROGRESS: "開発中",
  /** 開発中止 */
  ABORTED: "開発中止",
  /** 開発完了 */
  COMPLETED: "開発完了",
};

export const allDevStatuses: DevStatus[] = [
  "IN_PROGRESS",
  "COMPLETED",
  "ABORTED",
];

// allDevStatusesを使ってliteralのunionを作りたいけどできなそう
// https://github.com/colinhacks/zod/issues/831
export const devStatusSchema = z.union([
  z.literal("IN_PROGRESS"),
  z.literal("ABORTED"),
  z.literal("COMPLETED"),
]);
