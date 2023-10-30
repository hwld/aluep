import { DevelopButton } from "@/client/features/dev/DevelopButton/DevelopButton";
import { IdeaDescriptionView } from "@/client/features/idea/IdeaDescriptionView/IdeaDescriptionView";
import { IdeaInfoCardItem } from "@/client/features/idea/IdeaInfoCardItem/IdeaInfoCardItem";
import { IdeaLikeButton } from "@/client/features/idea/IdeaLikeButton/IdeaLikeButton";
import { IdeaOperationButton } from "@/client/features/idea/IdeaOperationButton/IdeaOperationButton";
import { IdeaTagBadge } from "@/client/features/idea/IdeaTagBadge/IdeaTagBadge";
import { useIdeaLike } from "@/client/features/idea/useIdeaLike";
import { IdeaComments } from "@/client/features/ideaComment/IdeaComments/IdeaComments";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { formatDate } from "@/client/lib/utils";
import {
  SvgClock,
  SvgFileText,
  SvgRotateClockwise2,
  SvgUser,
} from "@/client/ui/Icons";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { TocCard } from "@/client/ui/TocCard/TocCard";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";

type Props = { idea: Idea };

export const IdeaDetailPage: React.FC<Props> = ({ idea }) => {
  const { session } = useSessionQuery();
  const router = useRouter();
  const { openLoginModal } = useRequireLoginModal();
  const { likeIdeaMutation, unlikeIdeaMutation } = useIdeaLike({
    ideaId: idea.id,
  });

  const handleLikeIdea = () => {
    //ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal();
      return;
    }

    if (idea.likedByLoggedInUser) {
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
      <PageHeader icon={SvgFileText} pageName="お題の詳細" />
      <Flex maw={1200} direction="column" align="center" m="auto">
        <Title ta="center" c="red.7" style={{ wordBreak: "break-all" }}>
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
            style={{ position: "sticky", top: 10, zIndex: 1 }}
          >
            <DevelopButton
              ideaId={idea.id}
              devs={idea.devs}
              loggedInUserDevId={idea.loggedInUserDevId}
              onDevelopIdea={handleClickDevelop}
            />
            <IdeaLikeButton
              ideaId={idea.id}
              likes={idea.likes}
              likedByLoggedInUser={idea.likedByLoggedInUser}
              onLikeIdea={handleLikeIdea}
              disabled={isIdeaOwner}
            />
            <IdeaOperationButton idea={idea} isIdeaOwner={isIdeaOwner} />
          </Flex>

          {/* 中カラム */}
          <Box style={{ flexGrow: 1 }}>
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
              <div className="description">
                <IdeaDescriptionView descriptionHtml={idea.descriptionHtml} />
              </div>
            </Card>

            <IdeaComments
              loggedInUser={session?.user}
              ideaId={idea.id}
              ideaOwnerId={idea.user.id}
            />
          </Box>

          {/* 右カラム */}
          <Stack
            h="min-content"
            w={300}
            // 左カラムで表示するダイアログがお題の説明の下にならないように、中カラムよりも上に配置する
            style={{ position: "sticky", top: 10, zIndex: 1, flexShrink: 0 }}
            visibleFrom="lg"
          >
            <Card
              style={{
                height: "min-content",
              }}
            >
              <IdeaInfoCardItem
                icon={
                  <SvgUser
                    width={20}
                    height={20}
                    color="var(--mantine-color-gray-5)"
                  />
                }
                title="投稿者"
              >
                <Flex gap={5} mt={5} align="center">
                  <UserIconLink
                    iconSrc={idea.user.image}
                    userId={idea.user.id}
                  />
                  <TextLink href={Routes.user(idea.user.id)}>
                    <Text size="sm" truncate>
                      {idea.user.name}
                    </Text>
                  </TextLink>
                </Flex>
              </IdeaInfoCardItem>

              <IdeaInfoCardItem
                icon={
                  <SvgClock
                    width={20}
                    height={20}
                    color="var(--mantine-color-gray-5)"
                  />
                }
                title="作成日"
              >
                <Text>{formatDate(new Date(idea.createdAt))}</Text>
              </IdeaInfoCardItem>

              <IdeaInfoCardItem
                icon={
                  <SvgRotateClockwise2
                    width={20}
                    height={20}
                    color="var(--mantine-color-gray-5)"
                  />
                }
                title="更新日"
                disabledDivider
              >
                <Text>{formatDate(new Date(idea.updatedAt))}</Text>
              </IdeaInfoCardItem>
            </Card>
            <TocCard contentClassName="description" />
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};
