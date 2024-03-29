import { Button, Slider, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import classes from "./ImageCropper.module.css";

export const imageCropperSize = 300;
export const imageCropperStep = 0.01;

export type ImageInfo = { image: HTMLImageElement; defaultScale?: number };
type Props = { info: ImageInfo; onCompleteCrop: (objectURL: string) => void };

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
    ctx.fillRect(0, 0, imageCropperSize, imageCropperSize);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.globalCompositeOperation = "destination-out";
    ctx.arc(
      imageCropperSize / 2,
      imageCropperSize / 2,
      imageCropperSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  };

  const handleScale = (value: number) => {
    scaleRef.current = value;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);

    ctx.save();
    drawClippingLayer(ctx);

    // 原点を中央に設定する
    ctx.translate(imageCropperSize / 2, imageCropperSize / 2);
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

    const { currentX, currentY, dragStartX, dragStartY } = dragInfo.current;

    const scale = scaleRef.current;
    dragInfo.current.diffX = currentX + (e.clientX - dragStartX) / scale;
    dragInfo.current.diffY = currentY + (e.clientY - dragStartY) / scale;

    ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);
    ctx.save();
    drawClippingLayer(ctx);

    ctx.translate(imageCropperSize / 2, imageCropperSize / 2);
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
    ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);
    ctx.save();
    ctx.translate(imageCropperSize / 2, imageCropperSize / 2);
    ctx.scale(scaleRef.current, scaleRef.current);
    ctx.drawImage(image, dragInfo.current.currentX, dragInfo.current.currentY);
    ctx.restore();

    const data = canvasRef.current.toDataURL("image/png");
    onCompleteCrop(data);

    // 画像を取得した後に切り抜きレイヤーありで描画しなおす
    ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);
    ctx.save();
    drawClippingLayer(ctx);
    ctx.translate(imageCropperSize / 2, imageCropperSize / 2);
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

    ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);
    ctx.save();
    drawClippingLayer(ctx);

    // 原点を真ん中にする
    ctx.translate(imageCropperSize / 2, imageCropperSize / 2);

    const scale = scaleRef.current;
    ctx.scale(scale, scale);

    let x = 0;
    let y = 0;
    if (image.width > image.height) {
      y = (imageCropperSize / 2 - (image.height * scale) / 2) / scale;
    } else if (image.height > image.width) {
      x = (imageCropperSize / 2 - (image.width * scale) / 2) / scale;
    }

    x -= imageCropperSize / 2 / scale;
    y -= imageCropperSize / 2 / scale;

    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(image, x, y);
    dragInfo.current.currentX = x;
    dragInfo.current.currentY = y;

    ctx.restore();

    return () => {
      ctx.clearRect(0, 0, imageCropperSize, imageCropperSize);
    };
  }, [image]);

  return (
    <Stack w="min-content" gap="xl">
      <Stack gap="md">
        <canvas
          ref={canvasRef}
          width={imageCropperSize}
          height={imageCropperSize}
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
          step={imageCropperStep}
          min={0.1}
          max={2}
          classNames={{
            thumb: classes["slider-thumb"],
            track: classes["slider-track"],
          }}
          onChange={handleScale}
        />
      </Stack>
      <Button onClick={handleSaveImage}>確定する</Button>
    </Stack>
  );
};
