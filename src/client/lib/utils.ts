import { Bytes } from "@/share/consts";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { SyntheticEvent } from "react";

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

export const formatDate = (date: Date) => {
  return format(date, "yyyy年MM月dd日", { locale: ja });
};

export const formatDateTime = (date: Date) => {
  return format(date, "yyyy年MM月dd日 HH:mm:ss");
};

/**
 * bytesをKB,MB,Bに変換する
 */
export const formatBytes = (bytes: number): string => {
  if (bytes >= Bytes.MB) {
    return `${(bytes / Bytes.MB).toFixed(2)} MB`;
  } else if (bytes >= Bytes.KB) {
    return `${(bytes / Bytes.KB).toFixed(2)} KB`;
  } else {
    return `${bytes} B`;
  }
};

export const buildDefaultDevTitle = (title: string) => {
  return `"${title}" の開発`;
};
