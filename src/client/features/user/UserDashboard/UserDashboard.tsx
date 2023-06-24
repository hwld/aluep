import { UserActivityCard } from "@/client/features/user/UserDashboard/UserActivityCard";
import { UserProfileCard } from "@/client/features/user/UserDashboard/UserProfileCard";
import { UserReceivedLikeCard } from "@/client/features/user/UserDashboard/UserReceivedLikeCard";
import { ReceivedLikeCount } from "@/client/features/user/useReceivedLikeCountQuery";
import { UserActivity } from "@/client/features/user/useUserActivityQuery";
import { User } from "@/models/user";
import { Box, Flex, MediaQuery } from "@mantine/core";

type Props = {
  user: User;
  receivedLikeCount?: ReceivedLikeCount;
  userActivity?: UserActivity;
};
export const UserDashboard: React.FC<Props> = ({
  user,
  receivedLikeCount = { ideaLikeCount: 0, developmentLikeCount: 0 },
  userActivity = {
    developmentCount: 0,
    likedIdeaCount: 0,
    postedIdeaCount: 0,
  },
}) => {
  return (
    <Flex gap="md" w="100%" h={350}>
      <UserProfileCard user={user} maxWidth={800} />
      <MediaQuery smallerThan={900} styles={{ display: "none" }}>
        <Box>
          <UserReceivedLikeCard
            receivedLikeCount={receivedLikeCount}
            width={250}
          />
        </Box>
      </MediaQuery>
      <MediaQuery smallerThan={1400} styles={{ display: "none" }}>
        <Box>
          <UserActivityCard userActivity={userActivity} width={250} />
        </Box>
      </MediaQuery>
    </Flex>
  );
};
