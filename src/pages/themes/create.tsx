import {
  Box,
  Button,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../client/trpc";
import { prisma } from "../../server/prismadb";
import { RouterInputs } from "../../server/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const allTags = await prisma.appThemeTag.findMany();

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
      allTags: allTags.map(({ id, name }) => ({ id, name })),
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function CreateTheme({ allTags }: PageProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createMutate = useMutation({
    mutationFn: (data: RouterInputs["themes"]["create"]) => {
      return trpc.themes.create.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "投稿",
        message: "お題を投稿しました。",
      });
      router.replace("/");
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "投稿",
        message: "お題が投稿できませんでした。",
      });
    },
  });

  const handleCreateTheme = () => {
    createMutate.mutate({ title, description, tags });
  };

  return (
    <Box p={30}>
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
        data={allTags.map((tag) => ({ value: tag.id, label: tag.name }))}
        onChange={(values) => setTags(values)}
        value={tags}
        label="タグ"
        searchable
        nothingFound="タグが見つかりませんでした"
      />
      <Textarea
        label="説明"
        autosize
        minRows={10}
        mt={10}
        value={description}
        onChange={({ target: { value } }) => setDescription(value)}
      />
      <Button mt={10} onClick={handleCreateTheme}>
        投稿
      </Button>
    </Box>
  );
}
