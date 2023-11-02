// ページング用のラッパー

type PaginateArgs<FinderInput, FinderResult> = {
  finder: (
    input: FinderInput & { take: number; skip: number }
  ) => Promise<FinderResult>;
  finderInput: FinderInput;
  // 全ページ数を取得するために、finderInputを受け取って全データの数を数える関数が必要になる
  counter: (input: FinderInput) => Promise<number>;
  pagingData: { page: number; limit: number };
};
export const paginate = async <FinderInput, FinderResult>({
  finder,
  finderInput,
  counter,
  pagingData: { page, limit },
}: PaginateArgs<FinderInput, FinderResult>): Promise<
  [FinderResult, { allPages: number }]
> => {
  const allDataCount = await counter(finderInput);
  const allPages = Math.ceil(allDataCount / limit);

  const data = await finder({
    ...finderInput,
    skip: (page - 1) * limit,
    take: limit,
  });

  return [data, { allPages }];
};
