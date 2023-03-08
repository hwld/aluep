import { useCallback, useMemo } from "react";
import { z } from "zod";
import { pageSchema } from "../../share/schema";
import { useURLParams } from "./useURLParams";

type UsePaginationStateArgs = {
  initialPage?: number;
};

// ページの情報を管理する。
export const usePaginationState = ({
  initialPage = 1,
}: UsePaginationStateArgs) => {
  const [urlParams, setURLParams] = useURLParams(
    z.object({ page: pageSchema.default(initialPage) })
  );

  const page = useMemo(() => {
    const p = Number(urlParams.page);
    if (isNaN(p)) {
      return 1;
    }
    return p;
  }, [urlParams.page]);

  const setPage = useCallback(
    async (page: number) => {
      setURLParams({ page });
    },
    [setURLParams]
  );

  return [page, setPage] as const;
};
