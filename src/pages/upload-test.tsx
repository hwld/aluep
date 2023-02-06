import { Box, FileInput, Title } from "@mantine/core";
import { NextPage } from "next";
import { useState } from "react";
import {
  canvasSize,
  ImageCropper,
  ImageInfo,
} from "../client/components/ImageCropper";

const UploadTest: NextPage = () => {
  const [imageObjectURL, setImageObjectURL] = useState("");
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(undefined);

  const handleCompleteCrop = async (url: string) => {
    console.log(url);

    // base64をFileオブジェクトに変換する
    const bin = window.atob(url.replace(/^.*,/, ""));

    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }

    const imageFile = new File([buffer.buffer], "icon.png", {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("icon", imageFile);

    const data = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });
    const json = await data.json();
    console.log(json);
  };

  return (
    <Box>
      <Title>画像アップロードテスト</Title>
      <Title>ImageCropper</Title>
      <FileInput
        onChange={async (file) => {
          if (!file) {
            return;
          }

          // 以前作成したObjectを削除する
          URL.revokeObjectURL(imageObjectURL);

          const objectURL = URL.createObjectURL(file);
          setImageObjectURL(objectURL);

          // 画像を作成する
          const newImage = new Image();
          newImage.src = objectURL;

          setImageInfo(undefined);
          return await new Promise((resolve) => {
            newImage.onload = () => {
              // 画像のロードが終わった時に画像情報をセットする
              const defaultScale =
                canvasSize / Math.max(newImage.width, newImage.height);

              setImageInfo({ image: newImage, defaultScale });

              resolve(undefined);
            };
          });
        }}
      />
      {imageInfo && (
        <ImageCropper info={imageInfo} onCompleteCrop={handleCompleteCrop} />
      )}
    </Box>
  );
};

export default UploadTest;
