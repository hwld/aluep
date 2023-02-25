import { useRef } from "react";

const defaultPosition = { x: -1, y: -1 };

// マウスイベントのbuttonプロパティが0は、主キーを表していて、
// 基本的には左クリックになる。
const isLeftClick = (e: React.MouseEvent) => e.button === 0;

// 同じ位置を左クリックしたかどうか判定する
export const useSamePositionLeftClick = () => {
  const mousePositionRef = useRef(defaultPosition);

  const setLeftClickPosition = (e: React.MouseEvent) => {
    if (!isLeftClick(e)) {
      return;
    }

    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const isSameLeftClickPosition = (e: React.MouseEvent) => {
    if (!isLeftClick(e)) {
      return;
    }

    const { x, y } = mousePositionRef.current;
    return x === e.clientX && y === e.clientY;
  };

  const resetPosition = () => {
    mousePositionRef.current = defaultPosition;
  };

  return {
    setLeftClickPosition,
    isSameLeftClickPosition,
    resetPosition,
  };
};
