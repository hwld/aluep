import { DeveloperTitle } from "@/client/features/dev/DeveloperTitle/DeveloperTitle";
import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevMiniLikeButton } from "@/client/features/dev/DevMiniLikeButton/DevMiniLikeButton";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./DevCard.module.css";

type Props = {
  dev: Dev;
  onLikeDev: (devId: string) => void;
  onUnlikeDev: (devId: string) => void;
};

export const devCardMinWidthPx = 450;

export const DevCard: React.FC<Props> = ({
  dev,
  onLikeDev: onLike,
  onUnlikeDev: onUnlike,
}) => {
  const router = useRouter();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const handleLikeDev = () => {
    //ログインしていなければログインモーダルを表示させる
    if (!session) {
      openLoginModal();
      return;
    }

    if (dev.likedByLoggedInUser) {
      onUnlike(dev.id);
    } else {
      onLike(dev.id);
    }
  };

  const handleGoDevDetail = () => {
    router.push(Routes.dev(dev.ideaId, dev.id));
  };

  // 開発者自身でなければいいねできる
  const canLike = dev.developer.id !== session?.user.id;

  return (
    <ItemCard
      miw={devCardMinWidthPx}
      className={classes.root}
      onClick={handleGoDevDetail}
      leftHeader={<DevStatusBadge status={dev.status} />}
      rightHeader={
        <Flex>
          <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
          {dev.developedItemUrl && (
            <DevItemIconLink url={dev.developedItemUrl} />
          )}
        </Flex>
      }
      leftFooter={
        <MutedText>開発開始日: {formatDate(new Date(dev.createdAt))}</MutedText>
      }
      rightFooter={
        <DevMiniLikeButton
          likes={dev.likes}
          likedByLoggedInUser={dev.likedByLoggedInUser}
          onClick={handleLikeDev}
          disabled={!canLike}
        />
      }
    >
      <UserSection
        userIconSrc={dev.developer.imageUrl}
        userId={dev.developer.id}
        title={<DeveloperTitle dev={dev} className={classes["dev-link"]} />}
      />
    </ItemCard>
  );
};
