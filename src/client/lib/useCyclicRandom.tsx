import { useState } from "react";

export const useCyclicRandom = () => {
  const [random, _setRandom] = useState(Math.random().toString());

  const nextRandom = () => {
    _setRandom(() => Math.random().toString());
  };

  return { random, nextRandom };
};
