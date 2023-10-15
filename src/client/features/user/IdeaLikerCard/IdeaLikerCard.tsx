import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { formatDate } from "@/client/lib/utils";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { IdeaLiker } from "@/models/ideaLike";
import { Routes } from "@/share/routes";
import { Text } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./IdeaLikerCard.module.css";

export const ideaLikerCardMinWidthPx = 350;

type Props = {
  liker: IdeaLiker;
};
export const IdeaLikerCard: React.FC<Props> = ({ liker }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(liker.id));
  };

  return (
    <ItemCard
      miw={ideaLikerCardMinWidthPx}
      className={classes.root}
      onClick={handleGoUserDetail}
      leftFooter={
        <MutedText>いいねした日: {formatDate(liker.likedDate)}</MutedText>
      }
    >
      <UserSection
        userIconSrc={liker.image}
        title={
          <TextLink href={Routes.user(liker.id)}>
            <Text truncate style={{ flexShrink: 0 }} fw="bold" size="lg">
              {liker.name}
            </Text>
          </TextLink>
        }
      />
    </ItemCard>
  );
};
