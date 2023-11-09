// ページング用のラッパー

type PaginatedArgs = { take?: number; skip?: number };

type Mapped<T> = { [P in keyof T]: T[P] };

export const paginate = <T extends PaginatedArgs, K>(
  // extendsしてもPaginatedArgsのスーパータイプが入ってきちゃう可能性がある。
  // なので{} | {take: number} | {skip: number}みたいなのが入ってくるかも
  // これどうすることもできない？

  // この書き方で、prisma.idea.findManyのような、prismaが提供するメソッドでも正しく補完が効くようになった。
  // なんでMappedを通すと型がつくのかわからない・・・。
  finder: <_D>(input: Mapped<T>) => Promise<K>
) => {
  return async <U extends Omit<T, "take" | "skip">>(args: {
    finderInput: U;
    counter: (args: U) => Promise<number>;
    pagingData: { page: number; limit: number };
  }) => {
    const {
      finderInput,
      counter,
      pagingData: { limit, page },
    } = args;

    const allDataCount = await counter(finderInput);
    const allPages = Math.ceil(allDataCount / limit);

    const data = await finder({
      ...finderInput,
      skip: (page - 1) * limit,
      take: limit,
    } as unknown as T);

    return [data, { allPages }] as const;
  };
};
