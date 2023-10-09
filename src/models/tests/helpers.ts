import { formatDate } from "@/client/lib/utils";
import { Development } from "@/models/development";
import { DevelopmentLikers } from "@/models/developmentLike";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { Idea } from "@/models/idea";
import { IdeaComment } from "@/models/ideaComment";
import { IdeaTag } from "@/models/ideaTag";
import { User } from "@/models/user";
import { DevStatusIds } from "@/share/consts";
import { fakeString } from "@/share/fake";
import { faker } from "@faker-js/faker";

// TODO: 最大文字数のIdeaも作れるようにしたい
export const IdeaHelper = {
  create: (data?: Partial<Idea>): Idea => {
    return {
      user: { id: faker.string.uuid(), name: "user", image: null },
      likes: 0,
      id: faker.string.uuid(),
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
  createFilled: (): Idea => {
    return {
      id: faker.string.uuid(),
      title: fakeString(50),
      descriptionHtml: fakeString(10000),
      user: {
        id: faker.string.uuid(),
        name: fakeString(50),
        image: null,
      },
      tags: [],
      likes: 10000,
      comments: 10000,
      developments: 10000,
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
      elapsedSinceCreation: "1日前",
    };
  },
};

export const UserHelper = {
  create: (data?: Partial<User>): User => {
    return {
      id: faker.string.uuid(),
      name: "user",
      image: "",
      profile: "",
      ...data,
    };
  },
  createFilled: (): User => {
    return {
      id: faker.string.uuid(),
      name: fakeString(50),
      image: "",
      profile: fakeString(200),
    };
  },
};

export const IdeaTagHelper = {
  create: (data?: Partial<IdeaTag>): IdeaTag => {
    return {
      id: faker.string.uuid(),
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
      id: faker.string.uuid(),
      developerUserId: faker.string.uuid(),
      developedItemUrl: "",
      allowOtherUserMemos: true,
      comment: "",
      createdAt: new Date().toLocaleString(),
      developerUserImage: "",
      developerUserName: "user",
      githubUrl: "",
      ideaId: faker.string.uuid(),
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
      id: faker.string.uuid(),
      text: "memo",
      parentMemoId: null,
      developmentId: faker.string.uuid(),
      fromUser: {
        id: faker.string.uuid(),
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
      id: faker.string.uuid(),
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
      id: faker.string.uuid(),
      text: "コメント",
      createdAt: new Date(),
      fromUser: UserHelper.create(),
      ideaId: faker.string.uuid(),
      inReplyToComment: { fromUserName: "user", id: faker.string.uuid() },
      ...data,
    };
  },
};
