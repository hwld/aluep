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
