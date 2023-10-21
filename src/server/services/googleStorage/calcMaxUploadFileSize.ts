type Args = {
  /**
   * ユーザーがアップロードした全てのファイルのサイズ
   */
  uploadedBytes: number;
  limits: {
    /**
     * ユーザーがアップロードできる合計サイズ上限
     */
    totalBytes: number;
    /**
     * ユーザーがアップロードできるファイルのサイズ上限
     */
    fileBytes: number;
  };
};

/**
 *  アップロード可能な最大ファイルサイズを計算する
 */
export const calcMaxUploadFileSize = ({ uploadedBytes, limits }: Args) => {
  const availableBytes = limits.totalBytes - uploadedBytes;
  if (availableBytes < limits.fileBytes) {
    return availableBytes;
  }
  return limits.fileBytes;
};
