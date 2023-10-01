import { Idea } from "@/models/idea";
import { User } from "@/models/user";
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
