import { DeveloperTitle } from "@/client/features/dev/DeveloperTitle/DeveloperTitle";
import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex, Group } from "@mantine/core";
import { IconFileText, IconHeart } from "@tabler/icons-react";
import { useRouter } from "next/router";
import classes from "./DevCard.module.css";

type Props = { dev: Dev };

/**
 * 開発者を強調して開発情報を表示するカード
 *
 */
export const DevCard: React.FC<Props> = ({ dev }) => {
  const router = useRouter();

  const handleGoDevDetail = () => {
    router.push(Routes.dev(dev.id));
  };

  return (
    <>
      <ItemCard
        className={classes.root}
        onClick={handleGoDevDetail}
        leftHeader={<DevStatusBadge status={dev.status} />}
        rightHeader={
          <Flex>
            <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
            {dev.developedItemUrl !== "" && (
              <DevItemIconLink url={dev.developedItemUrl} />
            )}
          </Flex>
        }
      >
        <UserSection
          userIconSrc={dev.developer.imageUrl}
          userId={dev.developer.id}
          title={<DeveloperTitle dev={dev} className={classes["dev-link"]} />}
          content={
            <Group align="flex-end" wrap="nowrap" gap="xs">
              <IconCounter
                active={dev.likedByLoggedInUser}
                icon={<IconHeart />}
                counter={dev.likes}
              />
              <Group
                align="center"
                gap={5}
                mt={5}
                wrap="nowrap"
                style={{ overflow: "hidden" }}
              >
                {dev.idea ? (
                  <>
                    <IconFileText
                      color="var(--mantine-color-gray-5)"
                      width={25}
                      height={25}
                      style={{ flexShrink: 0 }}
                    />
                    <TextLink
                      href={Routes.idea(dev.idea.id)}
                      wrapperStyle={{ overflow: "hidden" }}
                    >
                      <MutedText truncate>{dev.idea.title}</MutedText>
                    </TextLink>
                  </>
                ) : (
                  <>
                    <IconFileText
                      color="var(--mantine-color-gray-4)"
                      width={25}
                      height={25}
                      style={{ flexShrink: 0 }}
                    />
                    <MutedText c="gray.4" truncate>
                      削除されたお題
                    </MutedText>
                  </>
                )}
              </Group>
            </Group>
          }
        />
      </ItemCard>
    </>
  );
};
