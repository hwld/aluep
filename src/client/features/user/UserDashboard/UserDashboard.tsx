import { UserActivityCard } from "@/client/features/user/UserDashboard/UserActivityCard/UserActivityCard";
import { ReceivedLikeCount } from "@/client/features/user/useReceivedLikeCountQuery";
import { UserProfileCard } from "@/client/features/user/UserDashboard/UserProfileCard/UserProfileCard";
import { UserReceivedLikeCard } from "@/client/features/user/UserDashboard/UserReceivedLikeCard/UserReceivedLikeCard";
import { UserActivity } from "@/client/features/user/useUserActivityQuery";
import { User } from "@/models/user";
import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  user: User;
  receivedLikeCount?: ReceivedLikeCount;
  userActivity?: UserActivity;
};
export const UserDashboard: React.FC<Props> = ({
  user,
  receivedLikeCount = { ideaLikeCount: 0, devLikeCount: 0 },
  userActivity = {
    devCount: 0,
    likedIdeaCount: 0,
    postedIdeaCount: 0,
  },
}) => {
  const showReceivedLikes = useMediaQuery("(min-width: 900px)");
  const showActivity = useMediaQuery("(min-width: 1400px)");

  return (
    <Flex gap="md" w="100%" h={350}>
      <UserProfileCard user={user} maxWidth={800} />
      {showReceivedLikes && (
        <UserReceivedLikeCard
          receivedLikeCount={receivedLikeCount}
          width={250}
        />
      )}
      {showActivity && (
        <UserActivityCard userActivity={userActivity} width={250} />
      )}
    </Flex>
  );
};
