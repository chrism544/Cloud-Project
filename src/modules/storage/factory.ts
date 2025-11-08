import { LocalStorageProvider } from "./providers/local";
import { S3CompatibleProvider, S3Config } from "./providers/s3-compatible";
import { StorageProvider } from "./providers/interface";

export class StorageProviderFactory {
  static create(): StorageProvider {
    const provider = process.env.STORAGE_PROVIDER || "local";
    if (provider === "local") {
      const basePath = process.env.STORAGE_LOCAL_PATH || "uploads";
      const baseUrl = process.env.STORAGE_LOCAL_URL || "http://localhost:3000/uploads";
      return new LocalStorageProvider(basePath, baseUrl);
    }
    // s3-compatible (DigitalOcean Spaces, Linode, Vultr, MinIO, etc.)
    const cfg: S3Config = {
      endPoint: process.env.STORAGE_ENDPOINT || "",
      region: process.env.STORAGE_REGION,
      accessKey: process.env.STORAGE_ACCESS_KEY || "",
      secretKey: process.env.STORAGE_SECRET_KEY || "",
      bucket: process.env.STORAGE_BUCKET || "",
      publicBaseUrl: process.env.STORAGE_PUBLIC_URL,
    };
    return new S3CompatibleProvider(cfg);
  }
}
