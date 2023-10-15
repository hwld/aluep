import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { User } from "@/models/user";
import { Routes } from "@/share/routes";
import { Text } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./UserCard.module.css";

export const userCardMinWidthPx = 350;

type Props = { user: User };
export const UserCard: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(user.id));
  };

  return (
    <ItemCard
      miw={userCardMinWidthPx}
      className={classes.root}
      onClick={handleGoUserDetail}
    >
      <UserSection
        userIconSrc={user.image}
        title={
          <TextLink href={Routes.user(user.id)}>
            <Text style={{ flexShrink: 0 }} truncate>
              {user.name}
            </Text>
          </TextLink>
        }
        content={
          <Text
            style={{ flexShrink: 1, minHeight: 0, overflow: "hidden" }}
            size="sm"
            c="gray.5"
          >
            {user.profile}
          </Text>
        }
      />
    </ItemCard>
  );
};
