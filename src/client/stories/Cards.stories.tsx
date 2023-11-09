import { Flex } from "@mantine/core";
import { Meta } from "@storybook/react";
import { IdeaCard } from "@/client/features/idea/IdeaCard/IdeaCard";
import {
  DevHelper,
  DevMemoHelper,
  IdeaCommentHelper,
  IdeaHelper,
  UserHelper,
} from "@/models/tests/helpers";
import { PopularIdeaCard } from "@/client/features/idea/PopularIdeaCard/PopularIdeaCard";
import { DevCard } from "@/client/features/dev/DevCard/DevCard";
import { UserCard } from "@/client/features/user/UserCard/UserCard";
import { LikedDevCard } from "@/client/features/dev/LikedDevCard/LikedDevCard";
import { IdeaLikerCard } from "@/client/features/user/IdeaLikerCard/IdeaLikerCard";
import { UserDevCard } from "@/client/features/user/UserDevCard/UserDevCard";
import React from "react";
import { IdeaCommentCard } from "@/client/features/ideaComment/IdeaCommentCard/IdeaCommentCard";
import { DevMemoFormCard } from "@/client/features/devMemo/DevMemoFormCard/DevMemoFormCard";
import { DevMemoThreadCard } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoThreadCard";
import { UserActivityCard } from "@/client/features/user/UserActivityCard/UserActivityCard";
import { UserProfileCard } from "@/client/features/user/UserProfileCard/UserProfileCard";
import { UploadedImageCard } from "@/client/ui/UploadedImageCard/UploadedImageCard";
import { IdeaCommentReplyFormCard } from "@/client/features/ideaComment/IdeaCommentReplyFormCard/IdeaCommentReplyFormCard";
import { UserReceivedLikeCard } from "@/client/features/user/UserReceivedLikeCard/UserReceivedLikeCard";
import { DevDetailCard } from "@/client/features/dev/DevDetailCard/DevDetailCard";

const meta = {
  title: "sets/Cards",
  component: () => null,
} satisfies Meta<React.FC>;

export default meta;

const idea = IdeaHelper.create();
const dev = DevHelper.create();
const user = UserHelper.create();

export const Cards = {
  render: () => {
    return (
      <Flex wrap="wrap" gap="sm">
        <IdeaCard idea={idea} />
        <IdeaLikerCard liker={{ ...user, likedDate: new Date() }} />
        <PopularIdeaCard idea={idea} />
        <UserCard user={user} />
        <DevCard dev={dev} />
        <LikedDevCard dev={dev} />
        <UserDevCard dev={dev} />
        <IdeaCommentCard
          comment={IdeaCommentHelper.create({ text: "hello" })}
          ideaId=""
          ideaOwnerId=""
          isOwner={false}
        />
        <IdeaCommentReplyFormCard
          ideaId=""
          onClose={() => {}}
          parentCommentId=""
        />
        <DevMemoFormCard devId="" loggedInUser={user} />
        <DevMemoThreadCard
          childrenMemos={[]}
          devId=""
          memo={DevMemoHelper.create({ text: "hello" })}
        />
        <UserActivityCard
          userActivity={{ devCount: 0, likedIdeaCount: 0, postedIdeaCount: 0 }}
        />
        <UserReceivedLikeCard
          receivedLikeCount={{ devLikeCount: 0, ideaLikeCount: 0 }}
        />
        <UserProfileCard user={user} />
        <UploadedImageCard created="" imageUrl="" size={1} />
        <DevDetailCard dev={dev} isDeveloper={false} />
      </Flex>
    );
  },
};
