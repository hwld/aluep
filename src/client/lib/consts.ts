import { IdeaOrder, IdeaPeriod } from "@/models/idea";

export const ideaOrderItems: { value: IdeaOrder; label: string }[] = [
  { value: "createdDesc", label: "新しい順" },
  { value: "createdAsc", label: "古い順" },
  { value: "likeDesc", label: "いいねが多い順" },
  { value: "developmentDesc", label: "開発者が多い順" },
];

export const ideaPeriodItems: { value: IdeaPeriod; label: string }[] = [
  { value: "all", label: "全期間" },
  { value: "monthly", label: "月間" },
];
