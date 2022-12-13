export const urlParamToString = (
  param: string | string[] | undefined,
  /**
   * undefinedのときに返す値
   */
  initialData: string = ""
): string => {
  if (typeof param === "string") {
    return param;
  } else if (typeof param === "object") {
    return param[0];
  } else {
    return initialData;
  }
};

export const urlParamToStringArray = (
  param: string | string[] | undefined,
  /**
   * undefinedのときに返す値
   */
  initialData: string[] = []
): string[] => {
  if (typeof param === "string") {
    return [param];
  } else if (typeof param === "object") {
    return param;
  } else {
    return initialData;
  }
};
