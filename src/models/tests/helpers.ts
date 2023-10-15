import { Dev } from "@/models/dev";
import { DevLikers } from "@/models/devLike";
import { DevMemo } from "@/models/devMemo";
import { allDevStatuses } from "@/models/devStatus";
import { Idea } from "@/models/idea";
import { IdeaComment } from "@/models/ideaComment";
import { IdeaTag } from "@/models/ideaTag";
import { User } from "@/models/user";
import { faker } from "@faker-js/faker";

export const IdeaHelper = {
  create: (data?: Partial<Idea>): Idea => {
    return {
      user: {
        id: faker.string.uuid(),
        name: fakeString({ min: 1, max: 50 }),
        image: null,
        ...data?.user,
      },
      likes: 0,
      id: faker.string.uuid(),
      title: fakeString({ min: 1, max: 50 }),
      descriptionHtml: descriptionHtmlSample,
      tags: [],
      devs: 0,
      comments: 0,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      elapsedSinceCreation: "1日前",
      ...data,
    };
  },
  createFilled: (): Idea => {
    return {
      ...IdeaHelper.create({
        title: fakeString(50),
        descriptionHtml: fakeString(10000),
        user: {
          name: fakeString(50),
          id: faker.string.uuid(),
          image: "",
        },
        likes: 10000,
        comments: 10000,
        devs: 10000,
      }),
    };
  },
};

export const descriptionHtmlSample = `
  <p>
    <strong>Bold</strong>
  </p>

  <p>
    <s>Strike</s>
  </p>

  <h1>Header1</h1>
  <h2>Header2</h2>
  <h3>Header3</h3>
  <h4>Header4</h4>
  <h5>Header5</h5>
  <h6>Header6</h6>

  <p>
    <br class="ProseMirror-trailingBreak">
  </p>

  <ul>
    <li>
      <p>ulist-item1</p>
    </li>
    <li>
      <p>ulist-item2</p>
    </li>
    <li>
      <p>ulist-item3</p>
    </li>
  </ul>

  <ol>
    <li>
      <p>olist-item1</p>
    </li>
    <li>
      <p>olist-item2</p>
    </li>
    <li>
      <p>olist-item3</p>
    </li>
  </ol>

  <p>
    <a rel="noopener noreferrer nofollow" href="https://example.com">
      Link
    </a>
  </p>
`;

export const UserHelper = {
  create: (data?: Partial<User>): User => {
    return {
      id: faker.string.uuid(),
      name: fakeString({ min: 1, max: 50 }),
      image: "",
      profile: fakeString({ min: 1, max: 200 }),
      ...data,
    };
  },
  createFilled: (): User => {
    return {
      ...UserHelper.create(),
      name: fakeString(50),
      profile: fakeString(200),
    };
  },
};

export const IdeaTagHelper = {
  create: (data?: Partial<IdeaTag>): IdeaTag => {
    return {
      id: faker.string.uuid(),
      name: fakeString({ min: 1, max: 50 }),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      ...data,
    };
  },
};

export const DevHelper = {
  create: (data?: Partial<Dev>): Dev => {
    return {
      id: faker.string.uuid(),
      developer: {
        id: faker.string.uuid(),
        name: fakeString({ min: 1, max: 50 }),
        imageUrl: "",
      },
      developedItemUrl: "",
      allowOtherUserMemos: true,
      comment: fakeString({ min: 1, max: 300 }),
      createdAt: new Date().toLocaleString(),
      githubUrl: "",
      ideaId: faker.string.uuid(),
      ideaTitle: fakeString({ min: 1, max: 50 }),
      likedByLoggedInUser: true,
      likes: 100,
      status: data?.status ?? faker.helpers.arrayElement(allDevStatuses),
      updatedAt: new Date().toLocaleString(),
      ...data,
    };
  },
  createFilled: (): Dev => {
    return {
      ...DevHelper.create(),
      githubUrl: "https://github.com/hwld/aluep",
      developedItemUrl: "https://example.com",
      comment: faker.string.sample(300),
      developer: {
        name: fakeString(50),
        id: faker.string.uuid(),
        imageUrl: "",
      },
      ideaTitle: fakeString(50),
      likes: 999,
    };
  },
};

export const DevMemoHelper = {
  create: (data?: Partial<DevMemo>): DevMemo => {
    return {
      id: faker.string.uuid(),
      text: fakeString({ min: 1, max: 2000 }),
      parentMemoId: null,
      devId: faker.string.uuid(),
      fromUser: {
        id: faker.string.uuid(),
        imageUrl: "",
        name: fakeString({ min: 1, max: 50 }),
        ...data?.fromUser,
      },
      createdAt: new Date(),
      ...data,
    };
  },
  createFilled: (): DevMemo => {
    return {
      ...DevMemoHelper.create(),
      text: fakeString(2000),
      fromUser: {
        id: faker.string.uuid(),
        imageUrl: "",
        name: fakeString(50),
      },
    };
  },
};

export const DevLikerHelper = {
  create: (data?: Partial<DevLikers>): DevLikers => {
    return {
      id: faker.string.uuid(),
      name: fakeString({ min: 1, max: 50 }),
      profile: fakeString({ min: 1, max: 200 }),
      image: "",
      likedDate: new Date(),
      ...data,
    };
  },
  createFilled: (): DevLikers => {
    return {
      ...DevLikerHelper.create(),
      name: fakeString(50),
      profile: fakeString(200),
    };
  },
};

export const IdeaCommentHelper = {
  create: (data?: Partial<IdeaComment>): IdeaComment => {
    return {
      id: faker.string.uuid(),
      text: fakeString({ min: 1, max: 2000 }),
      createdAt: new Date(),
      fromUser: UserHelper.create(),
      ideaId: faker.string.uuid(),
      inReplyToComment: {
        fromUserName: fakeString({ min: 1, max: 50 }),
        id: faker.string.uuid(),
      },
      ...data,
    };
  },
  createFilled: (): IdeaComment => {
    return {
      ...IdeaCommentHelper.create(),
      text: fakeString(2000),
      inReplyToComment: {
        fromUserName: fakeString(50),
        id: faker.string.uuid(),
      },
    };
  },
};

const fakeString = (opt?: number | { max: number; min: number }): string => {
  return faker.string.fromCharacters(characters, opt);
};

const hiragana =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
const alphabets = "abcdefghijklmnopqrstuvwxyz";
const characters = [
  ...hiragana.split(""),
  ...alphabets.split(""),
  ...alphabets.split("").map((a) => a.toUpperCase()),
];
