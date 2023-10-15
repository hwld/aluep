import { DeveloperTitle } from "@/client/features/dev/DeveloperTitle/DeveloperTitle";
import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex } from "@mantine/core";
import { useRouter } from "next/router";
import { TbHeart } from "react-icons/tb";
import classes from "./DevCard.module.css";

type Props = {
  dev: Dev;
};

export const devCardMinWidthPx = 450;

export const DevCard: React.FC<Props> = ({ dev }) => {
  const router = useRouter();

  const handleGoDevDetail = () => {
    router.push(Routes.dev(dev.ideaId, dev.id));
  };

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
        <IconCounter
          active={dev.likedByLoggedInUser}
          icon={<TbHeart />}
          counter={dev.likes}
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
