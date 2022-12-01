import { useMemo } from "react";
import { useStateAndUrlParamString } from "./useStateAndUrlParamString";

// ページの情報を管理する。
// React StateとURLパラメータに保存する。
export const usePaginationState = (initialPage: number = 1) => {
  const [stringPage, setStringPage] = useStateAndUrlParamString({
    paramName: "page",
    initialData: initialPage.toString(),
  });

  const page = useMemo(() => {
    const p = Number(stringPage);
    if (isNaN(p)) {
      return 1;
    }
    return p;
  }, [stringPage]);

  const setPage = (page: number) => {
    setStringPage(page.toString());
  };

  return [page, setPage] as const;
};
