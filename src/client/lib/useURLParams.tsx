import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { ZodTypeDef, z } from "zod";
import { assertNever } from "../../share/utils";

/**
 * URLSearchParamsを操作するhook
 * @param schema Record<string, string | string[] | number>となるZodスキーマ
 */
export const useURLParams = <
  Output extends Record<string, string | string[] | number>,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(
  schema: z.ZodSchema<Output, Def, Input>
) => {
  const router = useRouter();

  const queryParams: z.infer<typeof schema> = useMemo(() => {
    const queryObj = router.query;
    return schema.parse(queryObj);
  }, [router.query, schema]);

  const setQueryParams = useCallback(
    async (
      newObj: Partial<Output>,
      options?: Parameters<typeof router.push>[2]
    ) => {
      const currentUrl = new URL(window.location.href);

      // queryParamsをすべて削除する
      Array.from(currentUrl.searchParams.keys()).forEach((key) => {
        currentUrl.searchParams.delete(key);
      });

      const mergedObj = schema.parse({ ...queryParams, ...newObj });
      Object.keys(mergedObj).forEach((key) => {
        const value = mergedObj[key];

        switch (typeof value) {
          case "string":
            if (value === "") {
              currentUrl.searchParams.delete(key.toString());
            } else {
              currentUrl.searchParams.set(key.toString(), value);
            }
            return;
          case "object":
            value.forEach((v) =>
              currentUrl.searchParams.append(key.toString(), v)
            );
            return;
          case "number":
            currentUrl.searchParams.set(key.toString(), value.toString());
            return;
          default:
            assertNever(value);
        }
      });

      await router.push(currentUrl, undefined, options);
    },
    [queryParams, router, schema]
  );

  return [queryParams, setQueryParams] as const;
};
