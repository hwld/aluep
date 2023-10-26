export type IdeaTag = {
  id: string;
  createdAt: string;
  name: string;
  updatedAt: string;
};

export type IdeaTagAndIdeaCount = IdeaTag & { ideaCount: number };
