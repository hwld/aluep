import { File, GetFilesResponse, Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import internal from "stream";

export type GCSFileType = "avatar" | "idea-image";

class GoogleStorage {
  private storage = new Storage(
    process.env.NODE_ENV === "development"
      ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
      : { keyFilename: "/gcs/key.json" }
  );
  private uploadBucket = this.storage.bucket("aluep-user-upload");
  private bucketPath = `${this.storage.apiEndpoint}/${this.uploadBucket.name}`;

  constructor() {
    this.storage = new Storage(
      process.env.NODE_ENV === "development"
        ? { apiEndpoint: process.env.GCS_EMULATOR_HOST }
        : { keyFilename: "/gcs/key.json" }
    );
  }

  public createFile(
    type: GCSFileType,
    userId: string
  ): { file: File; writableStream: internal.Writable } {
    const filePath = this.generateFilePath({ type, userId });
    const file = this.uploadBucket.file(filePath);
    const writableStream = file.createWriteStream();

    return { file, writableStream };
  }

  public async setFileMetaData(
    file: File,
    opts: { mimetype: string | null; ext: string }
  ) {
    await file.setMetadata({
      cacheControl: "no-cache",
      contentType: opts.mimetype ?? undefined,
    });
    await file.rename(`${file.name}${opts.ext}`);

    return { renamedFileUrl: `${this.bucketPath}/${file.name}${opts.ext}` };
  }

  public async getFiles(
    type: GCSFileType,
    userId: string
  ): Promise<GetFilesResponse> {
    return this.uploadBucket.getFiles({
      delimiter: "/",
      prefix: this.generatePrefix({ type, userId }),
    });
  }

  public async deleteFile(url: string, userId: string) {
    if (!this.isUploadedFileUrl(url, userId)) {
      throw new Error();
    }

    const filePath = url.split(`${this.bucketPath}/`)[1];
    return this.uploadBucket.file(filePath).delete();
  }

  public isUploadedFileUrl(url: string, userId: string) {
    return url.startsWith(`${this.bucketPath}/${userId}`);
  }

  private generateFilePath(opts: {
    type: GCSFileType;
    userId: string;
  }): string {
    const prefix = this.generatePrefix(opts);

    const { type } = opts;
    switch (type) {
      case "avatar":
        return `${prefix}avatar`;
      case "idea-image":
        return `${prefix}${randomUUID()}`;
      default:
        throw new Error(type satisfies never);
    }
  }

  private generatePrefix({
    type,
    userId,
  }: {
    type: GCSFileType;
    userId: string;
  }) {
    const userDirectoryPath = `${userId}/`;

    switch (type) {
      case "avatar":
        return `${userDirectoryPath}`;
      case "idea-image":
        return `${userDirectoryPath}idea-image/`;
      default:
        throw new Error(type satisfies never);
    }
  }
}

export const googleStorage = new GoogleStorage();
