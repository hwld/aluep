import { Development } from "@/models/development";
import { DevelopmentLikers } from "@/models/developmentLike";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { Idea } from "@/models/idea";
import { IdeaComment } from "@/models/ideaComment";
import { IdeaTag } from "@/models/ideaTag";
import { User } from "@/models/user";
import { DevStatusIds } from "@/share/consts";
import { faker } from "@faker-js/faker";

export const IdeaHelper = {
  create: (data?: Partial<Idea>): Idea => {
    return {
      user: { id: faker.datatype.uuid(), name: "user", image: null },
      likes: 0,
      id: faker.datatype.uuid(),
      title: "idea",
      descriptionHtml: "",
      tags: [],
      developments: 0,
      comments: 0,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      elapsedSinceCreation: "1日前",
      ...data,
    };
  },
};

export const UserHelper = {
  create: (data?: Partial<User>): User => {
    return {
      id: faker.datatype.uuid(),
      name: "user",
      image: "",
      profile: "",
      ...data,
    };
  },
};

export const IdeaTagHelper = {
  create: (data?: Partial<IdeaTag>): IdeaTag => {
    return {
      id: faker.datatype.uuid(),
      name: "tag",
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      ...data,
    };
  },
};

export const DevelopmentHelper = {
  create: (data?: Partial<Development>): Development => {
    return {
      id: faker.datatype.uuid(),
      developerUserId: faker.datatype.uuid(),
      developedItemUrl: "",
      allowOtherUserMemos: true,
      comment: "",
      createdAt: new Date().toLocaleString(),
      developerUserImage: "",
      developerUserName: "user",
      githubUrl: "",
      ideaId: faker.datatype.uuid(),
      ideaTitle: "idea",
      likedByLoggedInUser: true,
      likes: 100,
      status: {
        id: DevStatusIds.IN_PROGRESS,
        name: "開発中",
        ...data?.status,
      },
      updatedAt: new Date().toLocaleString(),
      ...data,
    };
  },
};

export const DevelopmentMemoHelper = {
  create: (data?: Partial<DevelopmentMemo>): DevelopmentMemo => {
    return {
      id: faker.datatype.uuid(),
      text: "memo",
      parentMemoId: null,
      developmentId: faker.datatype.uuid(),
      fromUser: {
        id: faker.datatype.uuid(),
        imageUrl: "",
        name: "user",
        ...data?.fromUser,
      },
      createdAt: new Date(),
      ...data,
    };
  },
};

export const DevelopmentLikerHelper = {
  create: (data?: Partial<DevelopmentLikers>): DevelopmentLikers => {
    return {
      id: faker.datatype.uuid(),
      name: "user",
      profile: "",
      image: "",
      likedDate: new Date(),
      ...data,
    };
  },
};

export const IdeaCommentHelper = {
  create: (data?: Partial<IdeaComment>): IdeaComment => {
    return {
      id: faker.datatype.uuid(),
      text: "コメント",
      createdAt: new Date(),
      fromUser: UserHelper.create(),
      ideaId: faker.datatype.uuid(),
      inReplyToComment: { fromUserName: "user", id: faker.datatype.uuid() },
      ...data,
    };
  },
};
