import { Box, Button, FileInput, Switch, Title } from "@mantine/core";
import { NextPage } from "next";
import Image from "next/image";
import { FormEventHandler, useState } from "react";
import { useSessionQuery } from "../client/hooks/useSessionQuery";

const UploadTest: NextPage = () => {
  const { session } = useSessionQuery();
  const [file, setFile] = useState<File | undefined>();

  const [show, setShow] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("icon", file);
    }

    const data = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await data.json();
    console.log(json);
  };

  const handleChange = (file: File | null) => {
    if (file) {
      setFile(file);
    }
  };

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
        {session && show && (
          <Image
            height={100}
            width={100}
            src={`/users/${session?.user.id}`}
            alt="logo"
          />
        )}
      </Box>
    </Box>
  );
};

export default UploadTest;
