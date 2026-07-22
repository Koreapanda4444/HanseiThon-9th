import type { Facility, FacilityCategoryId, FacilityCluster } from "../domain.js";

export interface FacilityClusterFilters {
  categoryId?: FacilityCategoryId | undefined;
  west: number;
  south: number;
  east: number;
  north: number;
  columns: number;
  rows: number;
}

interface ClusterAccumulator {
  count: number;
  latitudeTotal: number;
  longitudeTotal: number;
  column: number;
  row: number;
}

export function aggregateFacilityClusters(facilities: readonly Facility[], filters: FacilityClusterFilters) {
  const longitudeSpan = Math.max(filters.east - filters.west, Number.EPSILON);
  const latitudeSpan = Math.max(filters.north - filters.south, Number.EPSILON);
  const longitudeCellSize = longitudeSpan / filters.columns;
  const latitudeCellSize = latitudeSpan / filters.rows;
  const groups = new Map<string, ClusterAccumulator>();

  for (const facility of facilities) {
    if (filters.categoryId && !facility.categoryIds.includes(filters.categoryId)) continue;
    if (facility.coordinates.longitude < filters.west || facility.coordinates.longitude > filters.east) continue;
    if (facility.coordinates.latitude < filters.south || facility.coordinates.latitude > filters.north) continue;
    const column = Math.min(filters.columns - 1, Math.max(0, Math.floor((facility.coordinates.longitude - filters.west) / longitudeCellSize)));
    const row = Math.min(filters.rows - 1, Math.max(0, Math.floor((facility.coordinates.latitude - filters.south) / latitudeCellSize)));
    const key = `${row}:${column}`;
    const current = groups.get(key);
    if (current) {
      current.count += 1;
      current.latitudeTotal += facility.coordinates.latitude;
      current.longitudeTotal += facility.coordinates.longitude;
    } else {
      groups.set(key, {
        count: 1,
        latitudeTotal: facility.coordinates.latitude,
        longitudeTotal: facility.coordinates.longitude,
        column,
        row,
      });
    }
  }

  return [...groups.entries()].map(([id, group]): FacilityCluster => ({
    id,
    count: group.count,
    categoryId: filters.categoryId ?? null,
    coordinates: {
      latitude: group.latitudeTotal / group.count,
      longitude: group.longitudeTotal / group.count,
    },
    bounds: {
      west: filters.west + group.column * longitudeCellSize,
      south: filters.south + group.row * latitudeCellSize,
      east: filters.west + (group.column + 1) * longitudeCellSize,
      north: filters.south + (group.row + 1) * latitudeCellSize,
    },
  }));
}
