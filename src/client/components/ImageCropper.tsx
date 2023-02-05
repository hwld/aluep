import { Box, Button, FileInput, Slider } from "@mantine/core";
import { useRef, useState } from "react";

const canvasSize = 300;

const initialDragInfo = () => ({
  dragging: false,
  currentX: 0,
  currentY: 0,
  diffX: 0,
  diffY: 0,
  dragStartX: 0,
  dragStartY: 0,
});

export const ImageCropper: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageObjectURL, setImageObjectURL] = useState("");
  const imageRef = useRef<HTMLImageElement>();
  const scaleRef = useRef(1);

  const dragInfo = useRef({
    dragging: false,
    currentX: 0,
    currentY: 0,
    diffX: 0,
    diffY: 0,
    dragStartX: 0,
    dragStartY: 0,
  });

  const handleChangeFile = (file: File | null) => {
    if (!file) {
      return;
    }
    URL.revokeObjectURL(imageObjectURL);

    const objectURL = URL.createObjectURL(file);
    setImageObjectURL(objectURL);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    const img = new Image();
    img.src = objectURL;
    img.onload = () => {
      ctx.save();

      // 原点を真ん中にする
      ctx.translate(canvasSize / 2, canvasSize / 2);

      // 横と高さで大きいほうが300pxになるようなスケールを求める
      const scale = canvasSize / Math.max(img.width, img.height);
      ctx.scale(scale, scale);

      let x = 0;
      let y = 0;
      if (img.width > img.height) {
        y = (canvasSize / 2 - (img.height * scale) / 2) / scale;
      } else if (img.height > img.width) {
        x = (canvasSize / 2 - (img.width * scale) / 2) / scale;
      }

      x -= canvasSize / 2 / scale;
      y -= canvasSize / 2 / scale;

      ctx.drawImage(img, x, y);
      scaleRef.current = scale;
      dragInfo.current.currentX = x;
      dragInfo.current.currentY = y;

      ctx.restore();
      imageRef.current = img;
    };
  };

  const handleScale = (value: number) => {
    scaleRef.current = value;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !imageRef.current) {
      return;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();

    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(value, value);
    ctx.drawImage(
      imageRef.current,
      dragInfo.current.currentX,
      dragInfo.current.currentY
    );

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
    const image = imageRef.current;
    if (!dragInfo.current.dragging || !ctx || !image) {
      return;
    }

    let { currentX, currentY, dragStartX, dragStartY } = dragInfo.current;

    const scale = scaleRef.current;
    dragInfo.current.diffX = currentX + (e.clientX - dragStartX) / scale;
    dragInfo.current.diffY = currentY + (e.clientY - dragStartY) / scale;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();

    ctx.translate(canvasSize / 2, canvasSize / 2);
    ctx.scale(scale, scale);
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
    if (!canvasRef.current) {
      return;
    }
    const data = canvasRef.current.toDataURL();
  };

  return (
    <Box>
      <FileInput name="icon" label="画像" onChange={handleChangeFile} />
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ border: "1px solid black", cursor: "grab" }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragging}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      />
      <Slider
        label={null}
        thumbSize={30}
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
