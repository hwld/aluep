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
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useState } from "react";
import { trpc } from "../../../client/trpc";
import { prisma } from "../../../server/prismadb";
import { RouterInputs } from "../../../server/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  // 指定されたお題を取得する
  const rawTheme = await prisma.appTheme.findUnique({
    where: { id: themeId },
    include: { tags: true },
  });
  if (!rawTheme) {
    return { notFound: true };
  }

  //　お題の作成者がログインユーザーかチェックする
  if (rawTheme.userId !== session.user.id) {
    return { notFound: true };
  }

  const theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    description: rawTheme.description,
    tagIds: rawTheme.tags.map((t) => t.id),
  };

  //　すべてのタグを取得する
  const allTags = await prisma.appThemeTag.findMany();

  return {
    props: {
      theme,
      allTags: allTags.map(({ id, name }) => ({ id, name })),
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UpdateTheme: NextPage<PageProps> = ({ theme, allTags }) => {
  const [title, setTitle] = useState(theme.title);
  const [description, setDescription] = useState(theme.description);
  const [tags, setTags] = useState(theme.tagIds);

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["update"]) => {
      return trpc.themes.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        color: "green",
        title: "お題の更新",
        message: "お題を更新しました。",
      });
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の更新",
        message: "お題を更新できませんでした。",
      });
    },
  });

  const handleUpdateTheme = () => {
    updateMutation.mutate({ themeId: theme.id, title, description, tags });
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
        onChange={(values) => {
          setTags(values);
        }}
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
      <Button mt={10} onClick={handleUpdateTheme}>
        更新
      </Button>
    </Box>
  );
};

export default UpdateTheme;
