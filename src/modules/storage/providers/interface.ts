export interface StorageProvider {
  uploadFile(file: Buffer, filename: string, options: UploadOptions): Promise<UploadResult>;
  deleteFile(path: string): Promise<void>;
  getSignedUrl?(path: string, expiresInSeconds: number): Promise<string>;
  getPublicUrl(path: string): string;
}

export interface UploadOptions {
  mimeType: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  path: string;
  url: string;
  size: number;
}
