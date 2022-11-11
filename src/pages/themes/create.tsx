import {
  Button,
  Header,
  Input,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateTheme() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handlePost = async () => {
    const result = await fetch("/api/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, desc }),
    });

    if (!result.ok) {
      showNotification({
        color: "red",
        title: "投稿",
        message: "お題が投稿できませんでした。",
      });
    } else {
      showNotification({
        color: "green",
        title: "投稿",
        message: "お題を投稿しました。",
      });
      router.replace("/");
    }
  };

  return (
    <div>
      <Text fw={700} size={32} component="h1">
        お題の投稿
      </Text>
      <TextInput
        label="タイトル"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      {/* TODO: タグの実装をどうする？ */}
      <MultiSelect
        data={["Java", "Spring Boot", "Webアプリ", "スマートフォンアプリ"]}
        label="タグ"
        searchable
        nothingFound="タグが見つかりませんでした"
      />
      <Textarea
        label="説明"
        autosize
        minRows={10}
        mt={10}
        value={desc}
        onChange={({ target: { value } }) => setDesc(value)}
      />
      <Button mt={10} onClick={handlePost}>
        投稿
      </Button>
    </div>
  );
}
