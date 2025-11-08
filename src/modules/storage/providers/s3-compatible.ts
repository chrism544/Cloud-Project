import { Client } from "minio";
import { StorageProvider, UploadOptions, UploadResult } from "./interface";

export type S3Config = {
  endPoint: string;
  port?: number;
  useSSL?: boolean;
  region?: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicBaseUrl?: string; // CDN or bucket URL for public access
};

export class S3CompatibleProvider implements StorageProvider {
  private client: Client;
  private bucket: string;
  private publicBaseUrl?: string;

  constructor(cfg: S3Config) {
    this.client = new Client({
      endPoint: cfg.endPoint.replace(/^https?:\/\//, ""),
      useSSL: cfg.useSSL ?? cfg.endPoint.startsWith("https"),
      accessKey: cfg.accessKey,
      secretKey: cfg.secretKey,
      port: cfg.port,
      region: cfg.region,
    });
    this.bucket = cfg.bucket;
    this.publicBaseUrl = cfg.publicBaseUrl;
  }

  async uploadFile(file: Buffer, filename: string, options: UploadOptions): Promise<UploadResult> {
    const safe = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const objectName = `${new Date().toISOString().slice(0, 10)}/${Date.now()}_${safe}`;
    await this.client.putObject(this.bucket, objectName, file, {
      'Content-Type': options.mimeType,
    });
    return { path: objectName, url: this.getPublicUrl(objectName), size: file.length };
  }

  async deleteFile(path: string): Promise<void> {
    await this.client.removeObject(this.bucket, path);
  }

  async getSignedUrl(path: string, expiresInSeconds: number): Promise<string> {
    return this.client.presignedPutObject(this.bucket, path, expiresInSeconds);
  }

  getPublicUrl(p: string): string {
    if (this.publicBaseUrl) return `${this.publicBaseUrl}/${p}`;
    // Fallback to bucket endpoint-style URL
    return `https://${this.bucket}.${this.client.region() || ''}.${(this.client as any).transport?.host || ''}/${p}`;
  }
}
