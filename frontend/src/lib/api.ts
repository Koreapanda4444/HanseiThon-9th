import type {
  Account,
  ClassificationResult,
  DirectionsRoute,
  Facility,
  FacilityCluster,
  FacilityCategoryId,
  ImageAnalysisItem,
  PlaceImage,
  PlaceSearchResult,
  ServiceHealth,
  ServiceStats,
  UserReport,
  WasteItem,
} from "@/types/domain";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");

function apiBaseUrl() {
  if (typeof window === "undefined") return API_BASE_URL;
  const url = new URL(API_BASE_URL);
  const localHosts = ["localhost", "127.0.0.1"];
  if (localHosts.includes(url.hostname)) {
    url.hostname = window.location.hostname;
  }
  return url.toString().replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorPayload {
  error?: {
    message?: string;
    code?: string;
  };
}

async function apiRequest<T>(path: string, init?: RequestInit) {
  let response: Response;
  const method = (init?.method || "GET").toUpperCase();
  const stateChanging = !["GET", "HEAD", "OPTIONS"].includes(method);
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(stateChanging ? { "X-Requested-With": "beoril-map" } : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ApiError("현재 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.", 0, "NETWORK_ERROR");
  }

  const payload = await response.json().catch(() => ({})) as T & ErrorPayload;
  if (!response.ok) {
    throw new ApiError(
      payload.error?.message || "요청을 처리하지 못했습니다.",
      response.status,
      payload.error?.code || "REQUEST_FAILED",
    );
  }
  return payload;
}

export interface FacilityFilters {
  categoryId?: FacilityCategoryId | "all";
  query?: string;
  ids?: string[];
  latitude?: number;
  longitude?: number;
  radiusM?: number;
  west?: number;
  south?: number;
  east?: number;
  north?: number;
  limit?: number;
}

export async function fetchFacilities(filters: FacilityFilters = {}, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.categoryId && filters.categoryId !== "all") params.set("categoryId", filters.categoryId);
  if (filters.query) params.set("query", filters.query);
  if (filters.ids?.length) params.set("ids", filters.ids.join(","));
  if (filters.latitude !== undefined) params.set("latitude", String(filters.latitude));
  if (filters.longitude !== undefined) params.set("longitude", String(filters.longitude));
  if (filters.radiusM !== undefined) params.set("radiusM", String(filters.radiusM));
  if (filters.west !== undefined) params.set("west", String(filters.west));
  if (filters.south !== undefined) params.set("south", String(filters.south));
  if (filters.east !== undefined) params.set("east", String(filters.east));
  if (filters.north !== undefined) params.set("north", String(filters.north));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  const suffix = params.size ? `?${params.toString()}` : "";
  const response = await apiRequest<{ facilities: Facility[] }>(`/api/facilities${suffix}`, { signal });
  return response.facilities;
}

export async function fetchFacilityClusters(filters: {
  categoryId?: FacilityCategoryId | "all";
  west: number;
  south: number;
  east: number;
  north: number;
  columns: number;
  rows: number;
}, signal?: AbortSignal) {
  const params = new URLSearchParams({
    west: String(filters.west),
    south: String(filters.south),
    east: String(filters.east),
    north: String(filters.north),
    columns: String(filters.columns),
    rows: String(filters.rows),
  });
  if (filters.categoryId && filters.categoryId !== "all") params.set("categoryId", filters.categoryId);
  const response = await apiRequest<{ clusters: FacilityCluster[] }>(`/api/facility-clusters?${params.toString()}`, { signal });
  return response.clusters;
}

export async function fetchFacility(id: string) {
  const response = await apiRequest<{ facility: Facility }>(`/api/facilities/${encodeURIComponent(id)}`);
  return response.facility;
}

export async function searchPlaces(query: string, location?: { latitude: number; longitude: number } | null, limit = 15) {
  const params = new URLSearchParams({ query });
  params.set("limit", String(limit));
  if (location) {
    params.set("latitude", String(location.latitude));
    params.set("longitude", String(location.longitude));
  }
  const response = await apiRequest<{ results: PlaceSearchResult[] }>(`/api/places?${params.toString()}`);
  return response.results;
}

export async function fetchPlaceImage(query: string) {
  const params = new URLSearchParams({ query });
  const response = await apiRequest<{ result: PlaceImage | null }>(`/api/place-image?${params.toString()}`);
  return response.result;
}

export async function fetchDirections(origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) {
  const params = new URLSearchParams({
    originLatitude: String(origin.latitude),
    originLongitude: String(origin.longitude),
    destinationLatitude: String(destination.latitude),
    destinationLongitude: String(destination.longitude),
  });
  const response = await apiRequest<{ route: DirectionsRoute }>(`/api/directions?${params.toString()}`);
  return response.route;
}

export async function fetchWasteItems() {
  const response = await apiRequest<{ items: WasteItem[] }>("/api/waste-items?limit=20");
  return response.items;
}

export async function classifyWaste(query: string) {
  const response = await apiRequest<{ results: ClassificationResult[] }>("/api/classify", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return response.results;
}

export async function fetchStats() {
  return apiRequest<ServiceStats>("/api/stats");
}

export async function fetchHealth() {
  return apiRequest<ServiceHealth>("/health");
}

export async function analyzeImage(image: string) {
  const response = await apiRequest<{ items: ImageAnalysisItem[] }>("/api/analyze-image", {
    method: "POST",
    body: JSON.stringify({ image }),
  });
  return response.items;
}

export async function fetchCurrentAccount() {
  const response = await apiRequest<{ user: Account | null }>("/api/auth/me");
  return response.user;
}

export async function registerAccount(input: { name: string; email: string; password: string }) {
  const response = await apiRequest<{ user: Account }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export async function loginAccount(input: { email: string; password: string }) {
  const response = await apiRequest<{ user: Account }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export async function logoutAccount() {
  await apiRequest("/api/auth/logout", { method: "POST" });
}

export async function changeAccountPassword(input: { currentPassword: string; newPassword: string }) {
  await apiRequest("/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteAccount(password: string) {
  await apiRequest("/api/auth/account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}

export async function fetchReports() {
  const response = await apiRequest<{ reports: UserReport[] }>("/api/reports");
  return response.reports;
}

export async function submitReport(input: {
  facilityId: string;
  reportType: UserReport["reportType"];
  content: string;
}) {
  const response = await apiRequest<{ report: UserReport }>("/api/reports", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.report;
}
