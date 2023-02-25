import { useCallback, useMemo } from "react";
import { useURLParams } from "./useURLParams";

type UsePaginationStateArgs = {
  initialPage?: number;
};

// ページの情報を管理する。
// React StateとURLパラメータに保存する。
export const usePaginationState = ({
  initialPage = 1,
}: UsePaginationStateArgs) => {
  const [urlParams, setURLParams] = useURLParams({
    page: initialPage.toString(),
  });

  const page = useMemo(() => {
    const p = Number(urlParams.page);
    if (isNaN(p)) {
      return 1;
    }
    return p;
  }, [urlParams.page]);

  const setPage = useCallback(
    async (page: number) => {
      setURLParams({ page: page.toString() });
    },
    [setURLParams]
  );

  return [page, setPage] as const;
};
