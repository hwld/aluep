import { Avatar, Box, Button, FileInput, Switch, Title } from "@mantine/core";
import { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import {
  canvasSize,
  ImageCropper,
  ImageInfo,
} from "../client/components/ImageCropper";
import { useSessionQuery } from "../client/hooks/useSessionQuery";

const UploadTest: NextPage = () => {
  const { session } = useSessionQuery();
  const [file, setFile] = useState<File | undefined>();
  const [avatarUrl, setAvatarUrl] = useState("");

  const [show, setShow] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("icon", file);
    }

    const data = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });
    const json = await data.json();
    setAvatarUrl(json.avatarUrl);
    console.log(json);
  };

  const handleChange = (file: File | null) => {
    if (file) {
      setFile(file);
    }
  };

  const [imageObjectURL, setImageObjectURL] = useState("");
  const [image, setImage] = useState<HTMLImageElement>();
  const [defaultScale, setDefaultScale] = useState(1);
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(undefined);

  return (
    <Box>
      <Title>画像アップロードテスト</Title>
      <form
        method="post"
        encType="multipart/form-data"
        action="/upload"
        onSubmit={handleSubmit}
      >
        <FileInput name="icon" label="画像" onChange={handleChange} />
        <Button type="submit">送信</Button>
      </form>
      <Box>
        <Switch
          onChange={(e) => {
            setShow(e.currentTarget.checked);
          }}
        />
        {session && show && <Avatar size="xl" src={`${session.user.image}`} />}
      </Box>
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
      {imageInfo && <ImageCropper info={imageInfo} />}
    </Box>
  );
};

export default UploadTest;
