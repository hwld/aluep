import { useState, useCallback } from "react";

/**
 * ランダムな文字列と、その文字列を変更する関数を返す
 */
export const useCyclicRandom = () => {
  const [random, _setRandom] = useState(Math.random().toString());

  const nextRandom = useCallback(() => {
    _setRandom(() => Math.random().toString());
  }, []);

  return [random, nextRandom] as const;
};
