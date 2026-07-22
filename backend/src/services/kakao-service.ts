import { env } from "../config/env.js";
import { AppError } from "../errors.js";

interface KakaoAddressDocument {
  address_name: string;
  x: string;
  y: string;
  address?: {
    address_name?: string;
  } | null;
  road_address?: {
    address_name?: string;
  } | null;
}

interface KakaoAddressResponse {
  documents?: KakaoAddressDocument[];
}

interface KakaoKeywordDocument {
  id: string;
  place_name: string;
  category_name: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  distance: string;
  place_url: string;
}

interface KakaoKeywordResponse {
  documents?: KakaoKeywordDocument[];
}

interface KakaoImageDocument {
  thumbnail_url: string;
  image_url: string;
  display_sitename: string;
  doc_url: string;
}

interface KakaoImageResponse {
  documents?: KakaoImageDocument[];
}

interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

function safeHttpUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

interface KakaoDirectionsResponse {
  routes?: Array<{
    result_code?: number;
    result_msg?: string;
    summary?: {
      distance?: number;
      duration?: number;
      fare?: {
        taxi?: number;
        toll?: number;
      };
    };
    sections?: Array<{
      roads?: Array<{
        vertexes?: number[];
      }>;
      guides?: Array<{
        name?: string;
        x?: number;
        y?: number;
        distance?: number;
        duration?: number;
        guidance?: string;
      }>;
    }>;
  }>;
}

function segmentDistanceSquared(point: RouteCoordinate, start: RouteCoordinate, end: RouteCoordinate) {
  let x = start.longitude;
  let y = start.latitude;
  let dx = end.longitude - x;
  let dy = end.latitude - y;
  if (dx || dy) {
    const ratio = ((point.longitude - x) * dx + (point.latitude - y) * dy) / (dx * dx + dy * dy);
    if (ratio > 1) {
      x = end.longitude;
      y = end.latitude;
    } else if (ratio > 0) {
      x += dx * ratio;
      y += dy * ratio;
    }
  }
  dx = point.longitude - x;
  dy = point.latitude - y;
  return dx * dx + dy * dy;
}

function simplifyRoute(points: RouteCoordinate[], tolerance = 0.000015) {
  if (points.length <= 2) return points;
  const marked = new Uint8Array(points.length);
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  const threshold = tolerance * tolerance;
  marked[0] = 1;
  marked[points.length - 1] = 1;
  while (stack.length) {
    const [first, last] = stack.pop() as [number, number];
    let index = 0;
    let maximum = threshold;
    for (let cursor = first + 1; cursor < last; cursor += 1) {
      const distance = segmentDistanceSquared(points[cursor]!, points[first]!, points[last]!);
      if (distance > maximum) {
        index = cursor;
        maximum = distance;
      }
    }
    if (!index) continue;
    marked[index] = 1;
    stack.push([first, index], [index, last]);
  }
  return points.filter((_, index) => marked[index]);
}

export async function geocodeAddress(query: string) {
  if (!env.KAKAO_REST_API_KEY) {
    throw new AppError("현재 주소 검색을 이용할 수 없습니다.", 503, "KAKAO_NOT_CONFIGURED");
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/address.json");
  url.searchParams.set("query", query);
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
    signal: AbortSignal.timeout(7000),
    redirect: "error",
  });

  if (!response.ok) {
    throw new AppError("주소를 좌표로 변환하지 못했습니다.", 502, "KAKAO_REQUEST_FAILED");
  }

  const data = await response.json() as KakaoAddressResponse;
  return (data.documents ?? []).map((document) => ({
    address: document.address_name,
    roadAddress: document.road_address?.address_name ?? null,
    lotAddress: document.address?.address_name ?? null,
    latitude: Number(document.y),
    longitude: Number(document.x),
  }));
}

export async function searchPlaces(query: string, latitude?: number, longitude?: number, limit = 15) {
  if (!env.KAKAO_REST_API_KEY) {
    throw new AppError("현재 장소 검색을 이용할 수 없습니다.", 503, "KAKAO_NOT_CONFIGURED");
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("size", String(Math.min(15, Math.max(1, limit))));
  if (latitude !== undefined && longitude !== undefined) {
    url.searchParams.set("y", String(latitude));
    url.searchParams.set("x", String(longitude));
  }
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
    signal: AbortSignal.timeout(7000),
    redirect: "error",
  });

  if (!response.ok) {
    throw new AppError("장소 검색 결과를 불러오지 못했습니다.", 502, "KAKAO_REQUEST_FAILED");
  }

  const data = await response.json() as KakaoKeywordResponse;
  return (data.documents ?? []).map((document) => ({
    id: document.id,
    name: document.place_name,
    category: document.category_name,
    categoryGroup: document.category_group_name,
    address: document.address_name,
    roadAddress: document.road_address_name || null,
    phone: document.phone || null,
    placeUrl: safeHttpUrl(document.place_url),
    distanceM: document.distance ? Number(document.distance) : null,
    coordinates: {
      latitude: Number(document.y),
      longitude: Number(document.x),
    },
  }));
}

export async function searchPlaceImage(query: string) {
  if (!env.KAKAO_REST_API_KEY) {
    throw new AppError("현재 장소 이미지를 이용할 수 없습니다.", 503, "KAKAO_NOT_CONFIGURED");
  }

  const url = new URL("https://dapi.kakao.com/v2/search/image");
  url.searchParams.set("query", query);
  url.searchParams.set("size", "1");
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
    signal: AbortSignal.timeout(7000),
    redirect: "error",
  });

  if (!response.ok) {
    throw new AppError("장소 이미지를 불러오지 못했습니다.", 502, "KAKAO_REQUEST_FAILED");
  }

  const data = await response.json() as KakaoImageResponse;
  const image = data.documents?.[0];
  if (!image) return null;
  const thumbnailUrl = safeHttpUrl(image.thumbnail_url);
  const imageUrl = safeHttpUrl(image.image_url);
  if (!thumbnailUrl && !imageUrl) return null;
  return {
    thumbnailUrl: thumbnailUrl ?? imageUrl,
    imageUrl: imageUrl ?? thumbnailUrl,
    sourceName: image.display_sitename || null,
    sourceUrl: safeHttpUrl(image.doc_url),
  };
}

export async function getDirections(origin: RouteCoordinate, destination: RouteCoordinate) {
  if (!env.KAKAO_REST_API_KEY) {
    throw new AppError("현재 길찾기를 이용할 수 없습니다.", 503, "KAKAO_NOT_CONFIGURED");
  }

  const url = new URL("https://apis-navi.kakaomobility.com/v1/directions");
  url.searchParams.set("origin", `${origin.longitude},${origin.latitude}`);
  url.searchParams.set("destination", `${destination.longitude},${destination.latitude}`);
  url.searchParams.set("priority", "RECOMMEND");
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
    signal: AbortSignal.timeout(12_000),
    redirect: "error",
  });
  if (!response.ok) {
    throw new AppError("경로를 불러오지 못했습니다.", 502, "DIRECTIONS_REQUEST_FAILED");
  }

  const data = await response.json() as KakaoDirectionsResponse;
  const route = data.routes?.[0];
  if (!route || route.result_code !== 0 || !route.summary) {
    throw new AppError("선택한 위치 사이의 경로를 찾지 못했습니다.", 404, "DIRECTIONS_NOT_FOUND");
  }

  const points: RouteCoordinate[] = [];
  for (const section of route.sections ?? []) {
    for (const road of section.roads ?? []) {
      const values = road.vertexes ?? [];
      for (let index = 0; index + 1 < values.length; index += 2) {
        const longitude = values[index];
        const latitude = values[index + 1];
        if (longitude === undefined || latitude === undefined) continue;
        const point = { longitude, latitude };
        const previous = points[points.length - 1];
        if (!previous || previous.latitude !== point.latitude || previous.longitude !== point.longitude) points.push(point);
      }
    }
  }
  if (points.length < 2) {
    throw new AppError("경로 좌표를 확인하지 못했습니다.", 502, "DIRECTIONS_INVALID");
  }

  const steps = (route.sections ?? []).flatMap((section) => section.guides ?? []).map((guide, index) => ({
    id: `step-${index + 1}`,
    instruction: guide.guidance || guide.name || "경로를 따라 이동하세요.",
    roadName: guide.name || null,
    distanceM: Math.max(0, guide.distance ?? 0),
    durationS: Math.max(0, guide.duration ?? 0),
    coordinates: {
      latitude: guide.y ?? points[0]!.latitude,
      longitude: guide.x ?? points[0]!.longitude,
    },
  }));

  return {
    distanceM: Math.max(0, route.summary.distance ?? 0),
    durationS: Math.max(0, route.summary.duration ?? 0),
    taxiFare: Math.max(0, route.summary.fare?.taxi ?? 0),
    tollFare: Math.max(0, route.summary.fare?.toll ?? 0),
    points: simplifyRoute(points),
    steps,
  };
}
