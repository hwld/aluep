import { useCallback, useMemo } from "react";
import { useUrlParamString } from "./useUrlParamString";

type UsePaginationStateArgs = {
  initialPage?: number;
};

// ページの情報を管理する。
// React StateとURLパラメータに保存する。
export const usePaginationState = ({
  initialPage = 1,
}: UsePaginationStateArgs) => {
  const [stringPage, setStringPage] = useUrlParamString({
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

  const setPage = useCallback(
    (page: number) => {
      setStringPage(page.toString());
    },
    [setStringPage]
  );

  return [page, setPage] as const;
};
