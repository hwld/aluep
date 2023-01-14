import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { objectKeys } from "../utils";

/**
 * URLSearchParamsを操作するhook
 * @param initialData
 * @returns
 */
export const useURLParams = <
  T extends Record<string, string | string[] | number>
>(
  initialData: T
) => {
  const router = useRouter();

  const queryParams: { [K in keyof T]: T[K] } = useMemo(() => {
    return objectKeys(initialData).reduce((prev, key) => {
      let value = router.query[key as string] ?? initialData[key];

      // 初期データが配列だった場合、searchParamがstringでも配列に変換する
      if (typeof initialData[key] === "object" && typeof value === "string") {
        value = [value];
      }

      return { ...prev, [key]: value };
    }, {}) as any;
  }, [initialData, router.query]);

  const setQueryParams = useCallback(
    async (newObj: Partial<T>) => {
      const url = new URL(window.location.href);

      // queryParamsをすべて削除する
      Array.from(url.searchParams.keys()).forEach((key) => {
        url.searchParams.delete(key);
      });

      const mergedObj = { ...queryParams, ...newObj };
      objectKeys(mergedObj).forEach((key) => {
        const value = mergedObj[key];

        if (typeof value === "string") {
          if (value === "") {
            url.searchParams.delete(key.toString());
          } else {
            url.searchParams.set(key.toString(), value);
          }
        } else if (typeof value === "object") {
          value.forEach((v) => {
            url.searchParams.append(key.toString(), v);
          });
        }
      });

      await router.push(url);
    },
    [queryParams, router]
  );

  return [queryParams, setQueryParams] as const;
};
