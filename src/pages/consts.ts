import { ThemeOrder } from "../share/schema";

export const themeOrderItems: { value: ThemeOrder; label: string }[] = [
  { value: "createdDesc", label: "新しい順" },
  { value: "createdAsc", label: "古い順" },
  { value: "likeDesc", label: "いいねが多い順" },
  { value: "developerDesc", label: "開発者が多い順" },
];
