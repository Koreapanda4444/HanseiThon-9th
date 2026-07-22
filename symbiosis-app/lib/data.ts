export type CategoryId =
  | "general"
  | "recycle"
  | "medicine"
  | "battery"
  | "butt"
  | "clothes";

export interface Category {
  id: CategoryId;
  /** 수거함 종류 이름 (태그에 표기) */
  label: string;
  color: string;
  soft: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  general: { id: "general", label: "일반 쓰레기통", color: "#3E7BFA", soft: "#E8F0FE" },
  recycle: { id: "recycle", label: "재활용 수거함", color: "#12A15E", soft: "#E8F7EF" },
  medicine: { id: "medicine", label: "폐의약품 수거함", color: "#8B5CF6", soft: "#F1EBFE" },
  battery: { id: "battery", label: "폐건전지 수거함", color: "#F4511E", soft: "#FEEBE5" },
  butt: { id: "butt", label: "담배꽁초 수거함", color: "#B08A00", soft: "#F8F1D8" },
  clothes: { id: "clothes", label: "의류 수거함", color: "#FB8C00", soft: "#FFF1E0" },
};

/** 버릴 물건 → 수거함 종류 매핑 (검색/칩 필터의 단위) */
export interface Item {
  id: string;
  label: string;
  category: CategoryId;
}

export const ITEMS: Item[] = [
  { id: "pill", label: "알약", category: "medicine" },
  { id: "syrup", label: "물약", category: "medicine" },
  { id: "powerbank", label: "보조배터리", category: "battery" },
  { id: "cell", label: "폐건전지", category: "battery" },
  { id: "butt", label: "담배꽁초", category: "butt" },
  { id: "clothes", label: "헌옷", category: "clothes" },
  { id: "pet", label: "페트병", category: "recycle" },
  { id: "can", label: "캔", category: "recycle" },
  { id: "glass", label: "유리병", category: "recycle" },
];

export const MAP_CHIP_ITEMS = ["알약", "보조배터리", "담배꽁초", "폐건전지", "헌옷"];
export const FREQUENT_ITEMS = ["알약", "물약", "담배꽁초", "보조배터리", "폐건전지", "페트병", "캔", "유리병"];

export interface Place {
  id: string;
  name: string;
  category: CategoryId;
  /** 데모 지도 월드 좌표 (px) */
  x: number;
  y: number;
  distanceM: number;
  address: string;
  /** 수거 가능 품목 */
  items: string;
  hours: string;
  /** 이용자 확인 */
  statusLabel: string;
  statusOk: boolean;
  statusAgo: string;
}

export const PLACES: Place[] = [
  {
    id: "p01", name: "마포구 보건소 폐의약품 수거함", category: "medicine",
    x: 620, y: 610, distanceM: 120, address: "서울 마포구 월드컵로 212",
    items: "알약, 물약, 연고, 가루약 등", hours: "평일 09:00 ~ 18:00",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "1시간 전",
  },
  {
    id: "p02", name: "홍대입구역 담배꽁초 수거함", category: "butt",
    x: 470, y: 780, distanceM: 250, address: "서울 마포구 어울마당로 55",
    items: "담배꽁초", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "30분 전",
  },
  {
    id: "p03", name: "서교동 주민센터 폐건전지 수거함", category: "battery",
    x: 800, y: 500, distanceM: 320, address: "서울 마포구 동교로 123",
    items: "폐건전지, 보조배터리, 소형 충전기", hours: "평일 09:00 ~ 18:00",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "2시간 전",
  },
  {
    id: "p04", name: "합정역 3번 출구 재활용 수거함", category: "recycle",
    x: 350, y: 560, distanceM: 380, address: "서울 마포구 양화로 45",
    items: "페트병, 캔, 유리병", hours: "24시간",
    statusLabel: "가득 참", statusOk: false, statusAgo: "40분 전",
  },
  {
    id: "p05", name: "망원시장 입구 일반 쓰레기통", category: "general",
    x: 300, y: 900, distanceM: 410, address: "서울 마포구 포은로 87",
    items: "일반 쓰레기", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "10분 전",
  },
  {
    id: "p06", name: "홍익문화공원 재활용 수거함", category: "recycle",
    x: 700, y: 830, distanceM: 200, address: "서울 마포구 와우산로 94",
    items: "페트병, 캔, 유리병, 종이", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "15분 전",
  },
  {
    id: "p07", name: "연남동 주민센터 의류 수거함", category: "clothes",
    x: 430, y: 350, distanceM: 460, address: "서울 마포구 성미산로 190",
    items: "헌옷, 신발, 가방, 담요", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "3시간 전",
  },
  {
    id: "p08", name: "상수역 폐건전지 수거함", category: "battery",
    x: 620, y: 1000, distanceM: 480, address: "서울 마포구 독막로 165",
    items: "폐건전지, 보조배터리", hours: "24시간",
    statusLabel: "파손됨", statusOk: false, statusAgo: "1일 전",
  },
  {
    id: "p09", name: "홍대걷고싶은거리 일반 쓰레기통", category: "general",
    x: 520, y: 700, distanceM: 90, address: "서울 마포구 홍익로 20",
    items: "일반 쓰레기", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "5분 전",
  },
  {
    id: "p10", name: "경의선숲길 재활용 수거함", category: "recycle",
    x: 900, y: 700, distanceM: 340, address: "서울 마포구 연남로 27",
    items: "페트병, 캔", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "25분 전",
  },
  {
    id: "p11", name: "서교초등학교 앞 폐의약품 수거함", category: "medicine",
    x: 880, y: 380, distanceM: 480, address: "서울 마포구 잔다리로 77",
    items: "알약, 물약", hours: "평일 09:00 ~ 17:00",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "4시간 전",
  },
  {
    id: "p12", name: "합정동 의류 수거함", category: "clothes",
    x: 260, y: 700, distanceM: 440, address: "서울 마포구 토정로 31",
    items: "헌옷, 신발", hours: "24시간",
    statusLabel: "정상 이용 가능", statusOk: true, statusAgo: "6시간 전",
  },
];

export const SEARCH_HISTORY = [
  { term: "알약", ago: "방금 전" },
  { term: "보조배터리", ago: "10분 전" },
  { term: "페트병", ago: "2시간 전" },
  { term: "담배꽁초", ago: "어제" },
];

export const RECOMMENDED_SEARCHES = ["알약 버릴 곳", "보조배터리 버릴 곳", "물약 버릴 곳", "폐건전지 수거함"];

export interface ReportType {
  id: string;
  label: string;
  color: string;
  soft: string;
}

export const REPORT_TYPES: ReportType[] = [
  { id: "ok", label: "정상 이용 가능", color: "#12A15E", soft: "#E8F7EF" },
  { id: "full", label: "가득 참", color: "#EF4444", soft: "#FDECEC" },
  { id: "missing", label: "없어졌어요", color: "#8B95A1", soft: "#F2F4F6" },
  { id: "location", label: "위치가 달라요", color: "#F59E0B", soft: "#FEF3DC" },
  { id: "broken", label: "파손됨", color: "#8B5CF6", soft: "#F1EBFE" },
  { id: "etc", label: "기타 문제", color: "#6B7684", soft: "#F2F4F6" },
];

export type ReportStatus = "done" | "working" | "checking";

export const REPORT_STATUS: Record<ReportStatus, { label: string; color: string; soft: string }> = {
  done: { label: "처리 완료", color: "#0E8A50", soft: "#E8F7EF" },
  working: { label: "처리중", color: "#B7791F", soft: "#FEF3DC" },
  checking: { label: "확인중", color: "#3E7BFA", soft: "#E8F0FE" },
};

export const MY_REPORTS: {
  place: string;
  typeId: string;
  ago: string;
  status: ReportStatus;
}[] = [
  { place: "마포구 보건소 폐의약품 수거함", typeId: "full", ago: "1시간 전", status: "done" },
  { place: "홍대입구역 담배꽁초 수거함", typeId: "missing", ago: "1일 전", status: "done" },
  { place: "서교동 주민센터 폐건전지 수거함", typeId: "broken", ago: "3일 전", status: "working" },
  { place: "합정역 3번 출구 재활용 수거함", typeId: "location", ago: "5일 전", status: "checking" },
];

/** 즐겨찾기 초기값 (스토어에서 토글) */
export const INITIAL_FAVORITES = ["p01", "p02", "p03"];
