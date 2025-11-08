import { promises as fs } from "fs";
import path from "path";
import { StorageProvider, UploadOptions, UploadResult } from "./interface";

export class LocalStorageProvider implements StorageProvider {
  constructor(private basePath: string, private baseUrl: string) {}

  async uploadFile(file: Buffer, filename: string, _options: UploadOptions): Promise<UploadResult> {
    const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const relPath = path.join(new Date().toISOString().slice(0, 10), `${Date.now()}_${safeName}`);
    const absPath = path.join(this.basePath, relPath);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, file);
    return { path: relPath.replace(/\\/g, "/"), url: `${this.baseUrl}/${relPath.replace(/\\/g, "/")}`, size: file.length };
  }

  async deleteFile(p: string): Promise<void> {
    const absPath = path.join(this.basePath, p);
    await fs.unlink(absPath).catch(() => {});
  }

  getPublicUrl(p: string): string {
    return `${this.baseUrl}/${p}`;
  }
}
