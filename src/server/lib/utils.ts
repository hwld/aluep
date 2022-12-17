/**
 * 指定されたミリ秒待機する
 * デバッグ用
 * @param ms
 */
export const __sleep = async (ms: number) => {
  console.error("sleepが使用されています");
  return new Promise((resolve) => setTimeout(resolve, ms));
};
