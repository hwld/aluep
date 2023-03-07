export const buildSearchParamsString = (
  param?: Record<string, string> | undefined
) => {
  if (!param) {
    return "";
  }

  const searchParam = new URLSearchParams();
  const keys = Object.keys(param);
  keys.forEach((key) => {
    searchParam.set(key, param[key]);
  });

  const searchParamString = searchParam.toString();
  return searchParamString !== "" ? `?${searchParamString}` : "";
};

/**
 * 値が文字列の場合はその値を返し、それ以外の場合は例外を投げる
 */
export const assertString = (value: unknown): string => {
  if (!(typeof value === "string")) {
    throw new TypeError(
      `値は文字列である必要がありますが、"${typeof value}"が渡されました。`
    );
  }
  return value;
};
