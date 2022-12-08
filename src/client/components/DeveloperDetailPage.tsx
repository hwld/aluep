import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Flex,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsGithub } from "react-icons/bs";
import { MdOutlineFavorite } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { useAllThemesQuery } from "../hooks/useAllThemesQuery";
import { usePaginatedThemesQuery } from "../hooks/usePaginatedThemesQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { useThemeLike } from "../hooks/useThemeLike";
import { ThemeCard } from "./ThemeCard/ThemeCard";

type Props = { developer: ThemeDeveloper; theme: Theme };

export const DeveloperDetailPage: React.FC<Props> = ({ developer, theme }) => {
  const router = useRouter();
  const themeId = router.query.id as string;
  const developerId = router.query.id as string;
  const { session } = useSessionQuery();
  const { allThemes } = useAllThemesQuery();
  const [page, setPage] = usePaginationState();
  const { data } = usePaginatedThemesQuery(page);

  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(themeId);

  const { developers, likeDeveloperMutation } =
    useThemeDevelopersQuery(themeId);

  const handleLikeTheme = () => {
    if (!theme) return;
    likeThemeMutation.mutate({
      themeId: theme?.id,
      like: !likedByLoggedInUser,
    });
  };

  const mantineTheme = useMantineTheme();

  const [isPostTheme, setIsPostTheme] = useState(true);
  const [isJoinTheme, setIsJoinTheme] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const handlePostTheme = () => {
    if (!isPostTheme) {
      setIsPostTheme(!isPostTheme);
    }
    if (isJoinTheme) {
      setIsJoinTheme(false);
    }
    if (isLike) {
      setIsLike(false);
    }
  };

  const handleJoinTheme = () => {
    if (!isJoinTheme) {
      setIsJoinTheme(!isJoinTheme);
    }
    if (isPostTheme) {
      setIsPostTheme(false);
    }
    if (isLike) {
      setIsLike(false);
    }
  };

  const handleLike = () => {
    if (!isLike) {
      setIsLike(!isLike);
    }
    if (isPostTheme) {
      setIsPostTheme(false);
    }
    if (isJoinTheme) {
      setIsJoinTheme(false);
    }
  };

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex maw={1000} mih={300} direction="row" gap={10} mt={60}>
        <Card h={300} w={250}>
          <Card.Section py="xl">
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <Avatar
                src={developer?.image}
                size="xl"
                sx={(theme) => ({
                  borderWidth: "2px",
                  borderColor: theme.colors.gray[2],
                  borderStyle: "solid",
                  borderRadius: "100%",
                })}
              />
              {developer?.name}
            </Flex>
          </Card.Section>

          <Flex gap={70} mt={10} wrap="wrap" justify={"center"}>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <MdOutlineFavorite size="30" style={{ marginTop: "4px" }} />

              {/* {themes.map((theme) => {
              if (theme.user.id === session?.user.id) {
                return <ThemeCard key={theme.id} theme={theme} />;
              }
            })} */}
            </Flex>
            <Flex align={"center"} gap={15} wrap="wrap" direction={"column"}>
              <ActionIcon
                size={30}
                component={Link}
                href={developer.githubUrl}
                target="_blank"
                sx={(theme) => ({
                  transition: "all 200ms",
                  "&:hover": {
                    backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
                  },
                })}
              >
                <BsGithub size="80%" fill={mantineTheme.colors.gray[7]} />
              </ActionIcon>

              <div>GitHub</div>
            </Flex>
          </Flex>
        </Card>

        <Card mih={20} w={500}>
          <Card.Section withBorder inheritPadding py="md">
            <div>自己紹介</div>
          </Card.Section>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Textarea placeholder="自己紹介..." withAsterisk readOnly />
          </Card.Section>
        </Card>
      </Flex>
      <Flex mt={30}>
        <Button.Group>
          <Button
            variant="light"
            w={130}
            onClick={handlePostTheme}
            bg={isPostTheme ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            投稿したお題
          </Button>
          <Button
            variant="light"
            w={130}
            onClick={handleJoinTheme}
            bg={isJoinTheme ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            参加したお題
          </Button>
          <Button
            variant="light"
            w={130}
            onClick={handleLike}
            bg={isLike ? "gray.0" : "gray.3"}
            color="dark"
            sx={(theme) => {
              return { "&:hover": { backgroundColor: theme.colors.gray[4] } };
            }}
          >
            いいね
          </Button>
        </Button.Group>
      </Flex>
      {isPostTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap" direction={"column"}>
            投稿したお題を表示
            {theme.user.id}_____
            {developer.id}
            {allThemes?.map((theme) => {
              if (theme.user.id === developer.id) {
                return <ThemeCard key={theme.id} theme={theme} />;
              }
            })}
          </Flex>
        </div>
      )}
      {isJoinTheme && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap">
            {allThemes?.map((theme) => {
              if (theme.id === developer.themeId) {
                return <ThemeCard key={theme.id} theme={theme} />;
              }
            })}
          </Flex>
        </div>
      )}
      {isLike && (
        <div>
          <Flex mt={30} gap={15} wrap="wrap">
            いいねを表示
          </Flex>
        </div>
      )}
    </Flex>
  );
};
