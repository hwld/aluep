import {
  Box,
  Card,
  Flex,
  MediaQuery,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdAccessTime, MdUpdate } from "react-icons/md";
import { TbFileText } from "react-icons/tb";
import { Idea } from "../../server/models/idea";
import { Routes } from "../../share/routes";
import { useDevelop } from "../features/development/useDevelop";
import { DevelopButton } from "../features/idea/DevelopButton";
import { IdeaDescriptionView } from "../features/idea/IdeaDescriptionView";
import { IdeaInfoCardItem } from "../features/idea/IdeaDetail/IdeaInfoCardItem";
import { IdeaLikeButton } from "../features/idea/IdeaLikeButton";
import { IdeaOperationButton } from "../features/idea/IdeaOperationButton";
import { IdeaTagBadge } from "../features/idea/IdeaTagBadge";
import { useIdeaLike } from "../features/idea/useIdeaLike";
import { IdeaComments } from "../features/ideaComment/IdeaComments";
import { useRequireLoginModal } from "../features/session/RequireLoginModalProvider";
import { useSessionQuery } from "../features/session/useSessionQuery";
import { UserIconLink } from "../features/user/UserIconLink";
import { formatDate } from "../lib/utils";
import { PageHeader } from "../ui/PageHeader";
import { TextLink } from "../ui/TextLink";

type Props = { idea: Idea };

export const IdeaDetailPage: React.FC<Props> = ({ idea }) => {
  const { colors } = useMantineTheme();

  const { session } = useSessionQuery();
  const router = useRouter();
  const { openLoginModal } = useRequireLoginModal();
  const { likeIdeaMutation, unlikeIdeaMutation, likedByLoggedInUser } =
    useIdeaLike(idea.id);
  const {
    data: { developedData },
  } = useDevelop(idea.id);

  const handleLikeIdea = () => {
    //ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal();
      return;
    }

    if (likedByLoggedInUser) {
      unlikeIdeaMutation.mutate({ ideaId: idea.id });
    } else {
      likeIdeaMutation.mutate({ ideaId: idea.id });
    }
  };

  const handleClickDevelop = (e: SyntheticEvent) => {
    // ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal(Routes.develop(idea.id));
      return;
    }

    router.push(Routes.develop(idea.id));
  };

  // 自分の投稿かどうか
  const isIdeaOwner = idea.user.id === session?.user.id;

  return (
    <>
      <PageHeader icon={TbFileText} pageName="お題の詳細" />
      <Flex maw={1200} direction="column" align="center" m="auto">
        <Title align="center" color="red.7">
          {idea.title}
        </Title>
        <Flex mt="xl" gap="lg" w="100%">
          {/* 左カラム */}
          <Flex
            direction="column"
            align="center"
            gap="sm"
            h="min-content"
            // 左カラムで表示するダイアログがお題の説明の下にならないように、中カラムよりも上に配置する
            sx={{ position: "sticky", top: 10, zIndex: 1 }}
          >
            <DevelopButton
              ideaId={idea.id}
              developments={idea.developments}
              loggedInUserDevelopedData={developedData}
              onDevelopIdea={handleClickDevelop}
            />
            <IdeaLikeButton
              ideaId={idea.id}
              likes={idea.likes}
              likedByLoggedInUser={likedByLoggedInUser}
              onLikeIdea={handleLikeIdea}
              disabled={isIdeaOwner}
            />
            <IdeaOperationButton idea={idea} isIdeaOwner={isIdeaOwner} />
          </Flex>

          {/* 中カラム */}
          <Box sx={{ flexGrow: 1 }}>
            <Card mih={300}>
              {idea.tags.length > 0 && (
                <Flex gap={10} mb="md" wrap="wrap">
                  {idea.tags.map((tag) => (
                    <IdeaTagBadge tagId={tag.id} key={tag.id}>
                      {tag.name}
                    </IdeaTagBadge>
                  ))}
                </Flex>
              )}
              <IdeaDescriptionView descriptionHtml={idea.descriptionHtml} />
            </Card>

            <IdeaComments ideaId={idea.id} ideaOwnerId={idea.user.id} />
          </Box>

          {/* 右カラム */}
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Stack
              h="min-content"
              // 左カラムで表示するダイアログがお題の説明の下にならないように、中カラムよりも上に配置する
              sx={{ position: "sticky", top: 10, zIndex: 1 }}
            >
              <Card
                sx={{
                  flexShrink: 0,
                  flexGrow: 0,
                  height: "min-content",
                }}
                w={300}
              >
                <IdeaInfoCardItem
                  icon={<FaUserAlt size={20} color={colors.gray[5]} />}
                  title="投稿者"
                >
                  <Flex gap={5} mt={5}>
                    <UserIconLink
                      iconSrc={idea.user.image}
                      userId={idea.user.id}
                    />
                    <TextLink href={Routes.user(idea.user.id)}>
                      <Text size={13} truncate>
                        {idea.user.name}
                      </Text>
                    </TextLink>
                  </Flex>
                </IdeaInfoCardItem>

                <IdeaInfoCardItem
                  icon={<MdAccessTime size={20} color={colors.gray[5]} />}
                  title="作成日"
                >
                  <Text>{formatDate(new Date(idea.createdAt))}</Text>
                </IdeaInfoCardItem>

                <IdeaInfoCardItem
                  icon={<MdUpdate size={20} color={colors.gray[5]} />}
                  title="更新日"
                  disabledDivider
                >
                  <Text>{formatDate(new Date(idea.updatedAt))}</Text>
                </IdeaInfoCardItem>
              </Card>
            </Stack>
          </MediaQuery>
        </Flex>
      </Flex>
    </>
  );
};
