import { MutableRefObject, useCallback, useRef, useEffect } from "react";

type UseAutoScrollOnIncreaseArgs = {
  /** スクロールする対象の要素 */
  target: MutableRefObject<{
    scrollIntoView: Element["scrollIntoView"];
  } | null>;

  /** 増加したときにスクロールされる値 */
  count: number;

  /** 増加したあとにスクロールが実行されるまでの時間(ms) */
  delay?: number;

  /** 垂直方向の基準 */
  verticalPosition?: ScrollIntoViewOptions["block"];

  /** スクロール後に実行する関数。最初に渡された関数のみが使用される。 */
  onAfterScroll?: () => void;
};

export const useAutoScrollOnIncrease = ({
  target,
  count,
  delay = 200,
  verticalPosition = "start",
  onAfterScroll,
}: UseAutoScrollOnIncreaseArgs) => {
  const memoizeOnAfterScroll = useCallback(() => {
    onAfterScroll?.();

    // 最初に渡されたonAfterScrollを使い続ける
    // useEffectの中で使用しているため、無限ループにさせないために
    // hookのなかでメモ化するか、hookにわたすときにメモ化させる必要があるが、
    // hookに渡すときのメモ化は忘れそうなのでhookの中で行う。
    // こうしてしまうと、例えば状態に応じてonAfterScrollの実装を変えたいときに対応できないが、
    // とりあえずそのようなケースは少ないと考えてこのような実装にする。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 一つ前のレンダリングの数を保持しておく
  const prevCount = useRef(count);
  useEffect(() => {
    const newCount = count;

    // 前のレンダリングよりも数が増えていればスクロールさせる
    if (newCount > prevCount.current) {
      window.setTimeout(() => {
        target.current?.scrollIntoView({
          behavior: "smooth",
          block: verticalPosition,
        });
        memoizeOnAfterScroll();
      }, delay);
    }

    prevCount.current = newCount;
  }, [
    count,
    delay,
    memoizeOnAfterScroll,
    onAfterScroll,
    target,
    verticalPosition,
  ]);
};
