// ページング用のラッパー

type PaginateArgs<FinderInput, FinderResult> = {
  finder: ({
    input,
    take,
    skip,
  }: {
    input: FinderInput;
    take: number;
    skip: number;
  }) => Promise<FinderResult>;
  finderInput: FinderInput;
  // 全ページ数を取得するために、finderInputを受け取って全データの数を数える関数が必要になる
  counter: (input: FinderInput) => Promise<number>;
  pagingData: { page: number; limit: number };
};

// TODO: 変える
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
    input: finderInput,
    skip: (page - 1) * limit,
    take: limit,
  });

  return [data, { allPages }];
};
