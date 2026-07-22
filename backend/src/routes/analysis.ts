import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { analyzeWasteImage } from "../services/image-analysis-service.js";

const imageSchema = z.object({
  image: z.string().max(6 * 1024 * 1024).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),
}).strict();

export async function analysisRoutes(app: FastifyInstance) {
  app.post("/api/analyze-image", {
    bodyLimit: 6 * 1024 * 1024 + 1024,
    config: { rateLimit: { max: 6, timeWindow: "10 minutes" } },
  }, async (request) => {
    const { image } = imageSchema.parse(request.body);
    return { items: await analyzeWasteImage(image) };
  });
}
