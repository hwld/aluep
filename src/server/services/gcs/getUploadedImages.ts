import {
  gcsUploadBucket,
  generateGcsPrefix,
  UploadImageType,
} from "@/server/services/gcs";

type getUploadedImagesOptions = {
  type: UploadImageType;
  userId: string;
};

type GetUploadedImagesResult = {
  url: string;
  created: string | undefined;
  size: number;
}[];

export const getUploadedImages = async (
  opts: getUploadedImagesOptions
): Promise<GetUploadedImagesResult> => {
  const [files] = await gcsUploadBucket.getFiles({
    delimiter: "/",
    prefix: generateGcsPrefix(opts),
  });

  const promise = files.map(async (file) => {
    const [meta] = await file.getMetadata();
    return {
      // fake-gcs-serverだとスラッシュが％エンコードされてる？
      url: decodeURIComponent(file.publicUrl()),
      created: meta.timeCreated,
      size: Number(meta.size),
    };
  });

  const uploadedImages = await Promise.all(promise);

  const undefinedCreated = uploadedImages.filter((i) => !i.created);

  const notUndefinedCreated = uploadedImages
    .filter((i) => i.created)
    .sort(
      (a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime()
    );

  return [...undefinedCreated, ...notUndefinedCreated];
};
