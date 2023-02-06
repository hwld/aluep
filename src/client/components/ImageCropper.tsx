import { Box, Button, Slider } from "@mantine/core";
import { useEffect, useRef } from "react";

export const canvasSize = 300;

export type ImageInfo = { image: HTMLImageElement; defaultScale?: number };
type Props = { info: ImageInfo; onCompleteCrop: (objectURL: string) => void };

// TODO: 汚い
// contextを操作するときは順番が重要になってくるが、
// 共通化などを行わずにべた書きしてるところが多いので、ちょっと変更したときに
// いろんなところが壊れてしまう可能性がありそう。
export const ImageCropper: React.FC<Props> = ({
  info: { image, defaultScale = 1 },
  onCompleteCrop,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaleRef = useRef(defaultScale);

  const dragInfo = useRef({
    dragging: false,
    currentX: 0,
    currentY: 0,
    diffX: 0,
    diffY: 0,
    dragStartX: 0,
    dragStartY: 0,
  });

  // canvas上に円形の切り抜きレイヤーを描画する
  const drawClippingLayer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // 円の外側
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const handleScale = (value: number) => {
    scaleRef.current = value;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.save();
    drawClippingLayer(ctx);

    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(value, value);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(image, dragInfo.current.currentX, dragInfo.current.currentY);

    ctx.restore();
  };

  const handleDragStart: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (dragInfo.current.dragging) {
      return;
    }

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
    dragInfo.current.dragging = true;
    dragInfo.current.dragStartX = e.clientX;
    dragInfo.current.dragStartY = e.clientY;
  };

  const handleDragging: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!dragInfo.current.dragging || !ctx) {
      return;
    }

    let { currentX, currentY, dragStartX, dragStartY } = dragInfo.current;

    const scale = scaleRef.current;
    dragInfo.current.diffX = currentX + (e.clientX - dragStartX) / scale;
    dragInfo.current.diffY = currentY + (e.clientY - dragStartY) / scale;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    drawClippingLayer(ctx);

    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(scale, scale);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(image, dragInfo.current.diffX, dragInfo.current.diffY);

    ctx.restore();
  };

  const handleDragEnd: React.MouseEventHandler<HTMLCanvasElement> = () => {
    if (!dragInfo.current.dragging) {
      return;
    }
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
    dragInfo.current.dragging = false;
    dragInfo.current.currentX = dragInfo.current.diffX;
    dragInfo.current.currentY = dragInfo.current.diffY;
  };

  const handleSaveImage = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!canvasRef.current || !ctx) {
      return;
    }

    // 取得したい画像では切り抜きレイヤーを表示させたくないので、
    // 切り抜きレイヤーなしでcanvasを作る
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(scaleRef.current, scaleRef.current);
    ctx.drawImage(image, dragInfo.current.currentX, dragInfo.current.currentY);
    ctx.restore();

    const data = canvasRef.current.toDataURL("image/png");
    onCompleteCrop(data);

    // 画像を取得した後に切り抜きレイヤーありで描画しなおす
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    drawClippingLayer(ctx);
    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(scaleRef.current, scaleRef.current);
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(image, dragInfo.current.currentX, dragInfo.current.currentY);
    ctx.restore();
  };

  // レンダリング時にcanvasにimageをセットする
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    drawClippingLayer(ctx);

    // 原点を真ん中にする
    ctx.translate(canvasSize / 2, canvasSize / 2);

    const scale = scaleRef.current;
    ctx.scale(scale, scale);

    let x = 0;
    let y = 0;
    if (image.width > image.height) {
      y = (canvasSize / 2 - (image.height * scale) / 2) / scale;
    } else if (image.height > image.width) {
      x = (canvasSize / 2 - (image.width * scale) / 2) / scale;
    }

    x -= canvasSize / 2 / scale;
    y -= canvasSize / 2 / scale;

    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(image, x, y);
    dragInfo.current.currentX = x;
    dragInfo.current.currentY = y;

    ctx.restore();

    return () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    };
  }, [image]);

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ cursor: "grab" }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragging}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      />
      <Slider
        defaultValue={defaultScale}
        label={null}
        w={300}
        step={0.1}
        min={0.1}
        max={3}
        styles={(theme) => ({
          track: { "&::before": { backgroundColor: theme.colors.gray[3] } },
        })}
        onChange={handleScale}
      />
      <Button onClick={handleSaveImage}>確定</Button>
    </Box>
  );
};
