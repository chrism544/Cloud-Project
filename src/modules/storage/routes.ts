import path from "path";
import { FastifyInstance } from "fastify";
import { StorageProviderFactory } from "./factory";
import { z } from "zod";

export default async function storageRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/storage";
  const provider = StorageProviderFactory.create();

  // Direct upload (multipart form)
  await app.register(await import("@fastify/multipart").then(m => m.default));

  app.post(`${prefix}/upload`, async (req, reply) => {
    const mp = await req.file();
    if (!mp) return reply.code(400).send({ error: { code: "NO_FILE", message: "No file uploaded" } });
    const buf = await mp.toBuffer();
    const res = await provider.uploadFile(buf, mp.filename, { mimeType: mp.mimetype });
    reply.code(201).send(res);
  });

  // Generate presigned URL for s3-compatible providers (optional)
  const presignSchema = z.object({ path: z.string().min(1), expiresIn: z.number().int().positive().default(900) });
  app.post(`${prefix}/presigned-url`, async (req, reply) => {
    const { path: p, expiresIn } = presignSchema.parse(req.body || {});
    if (!('getSignedUrl' in provider) || typeof (provider as any).getSignedUrl !== 'function') {
      return reply.code(400).send({ error: { code: "UNSUPPORTED", message: "Presigned URLs not supported for this provider" } });
    }
    const url = await (provider as any).getSignedUrl(p, expiresIn);
    reply.send({ url });
  });

  // Delete by storage path
  const delSchema = z.object({ path: z.string().min(1) });
  app.delete(`${prefix}`, async (req, reply) => {
    const { path: p } = delSchema.parse(req.query);
    await provider.deleteFile(p);
    reply.code(204).send();
  });
}
