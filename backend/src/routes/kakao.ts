import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { geocodeAddress, getDirections, searchPlaceImage, searchPlaces } from "../services/kakao-service.js";

const schema = z.object({
  query: z.string().trim().min(2).max(120),
}).strict();

const optionalNumber = z.preprocess(
  (value) => value === "" || value === undefined ? undefined : value,
  z.coerce.number().finite().optional(),
);

const placeSchema = z.object({
  query: z.string().trim().min(2).max(120),
  latitude: optionalNumber.pipe(z.number().min(-90).max(90).optional()),
  longitude: optionalNumber.pipe(z.number().min(-180).max(180).optional()),
  limit: z.coerce.number().int().min(1).max(15).default(15),
}).strict().superRefine((value, context) => {
  if ((value.latitude === undefined) !== (value.longitude === undefined)) {
    context.addIssue({ code: "custom", message: "위치 정보가 올바르지 않습니다." });
  }
});

const directionsSchema = z.object({
  originLatitude: z.coerce.number().min(-90).max(90),
  originLongitude: z.coerce.number().min(-180).max(180),
  destinationLatitude: z.coerce.number().min(-90).max(90),
  destinationLongitude: z.coerce.number().min(-180).max(180),
}).strict();

export async function kakaoRoutes(app: FastifyInstance) {
  app.get("/api/geocode", { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } }, async (request) => {
    const { query } = schema.parse(request.query);
    return { results: await geocodeAddress(query) };
  });

  app.get("/api/places", { config: { rateLimit: { max: 60, timeWindow: "1 minute" } } }, async (request) => {
    const { query, latitude, longitude, limit } = placeSchema.parse(request.query);
    return { results: await searchPlaces(query, latitude, longitude, limit) };
  });

  app.get("/api/place-image", { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } }, async (request) => {
    const { query } = z.object({ query: z.string().trim().min(2).max(200) }).strict().parse(request.query);
    return { result: await searchPlaceImage(query) };
  });

  app.get("/api/directions", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request) => {
    const input = directionsSchema.parse(request.query);
    return {
      route: await getDirections(
        { latitude: input.originLatitude, longitude: input.originLongitude },
        { latitude: input.destinationLatitude, longitude: input.destinationLongitude },
      ),
    };
  });
}
