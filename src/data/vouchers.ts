/** 바우처(예약 확인서) 목록. 실제 링크가 생기면 href 만 바꿔 끼우면 된다. */

export type VoucherKind = "flight" | "stay" | "tour" | "transport";

export type Voucher = {
  /** 일정 화면에서 이 바우처로 이동할 때 쓰는 고유 id */
  id: string;
  kind: VoucherKind;
  title: string;
  subtitle: string;
  /** 예약번호 / PNR */
  code: string;
  date: string;
  /** 예약 확인서 링크. 아직 없으면 비워둔다 */
  href?: string;
};

export const voucherKindMeta: Record<
  VoucherKind,
  { label: string; emoji: string; tone: string }
> = {
  flight: { label: "항공", emoji: "✈️", tone: "bg-sky-100 text-sky-700" },
  stay: { label: "숙소", emoji: "🏨", tone: "bg-violet-100 text-violet-700" },
  tour: { label: "투어", emoji: "🎫", tone: "bg-rose-100 text-rose-700" },
  transport: {
    label: "교통",
    emoji: "🚆",
    tone: "bg-slate-200 text-slate-700",
  },
};

export const vouchers: Voucher[] = [
  {
    kind: "flight",
    id: "flight-outbound",
    title: "인천 → 헬싱키 · AY42",
    subtitle: "핀에어 · 11/28 10:05 출발, 14:20 도착",
    code: "PNR 6XK2QW",
    date: "2026-11-28",
  },
  {
    kind: "stay",
    id: "stay-kamp",
    title: "호텔 캄프 헬싱키",
    subtitle: "트윈 + 엑스트라 베드 · 3박",
    code: "BK-8842013",
    date: "2026-11-28",
  },
  {
    kind: "flight",
    id: "flight-hel-rvn",
    title: "헬싱키 → 로바니에미 · AY531",
    subtitle: "핀에어 · 12/1 08:15 출발",
    code: "PNR 6XK2QW",
    date: "2026-12-01",
  },
  {
    kind: "stay",
    id: "stay-igloo",
    title: "글래스 이글루 리조트",
    subtitle: "오로라 이글루 3인 · 3박",
    code: "AR-55190",
    date: "2026-12-01",
  },
  {
    kind: "tour",
    id: "tour-husky",
    title: "허스키 & 순록 썰매 투어",
    subtitle: "09:00 픽업 · 방한복 대여 포함",
    code: "TOUR-1180",
    date: "2026-12-02",
  },
  {
    kind: "tour",
    id: "tour-aurora",
    title: "오로라 헌팅 투어",
    subtitle: "20:30 픽업 · 날씨에 따라 이동",
    code: "TOUR-2291",
    date: "2026-12-03",
  },
  {
    kind: "flight",
    id: "flight-rvn-vie",
    title: "로바니에미 → 빈 (헬싱키 경유)",
    subtitle: "핀에어 + 오스트리안 · 12/4 10:15 출발",
    code: "PNR 7QM4RB",
    date: "2026-12-04",
  },
  {
    kind: "stay",
    id: "stay-sacher",
    title: "호텔 자허 빈",
    subtitle: "디럭스 트윈 · 5박",
    code: "BK-9014772",
    date: "2026-12-04",
  },
  {
    kind: "tour",
    id: "tour-schonbrunn",
    title: "쇤브룬 궁전 그랜드 투어",
    subtitle: "09:30 입장 · 오디오가이드 한국어",
    code: "SCH-77420",
    date: "2026-12-05",
  },
  {
    kind: "transport",
    id: "rail-salzburg",
    title: "레일제트 빈 ↔ 잘츠부르크",
    subtitle: "왕복 · 좌석 지정 포함",
    code: "OBB-33188",
    date: "2026-12-06",
  },
  {
    kind: "transport",
    id: "rail-hallstatt",
    title: "빈 ↔ 할슈타트 열차",
    subtitle: "아트낭푸흐하임 경유 왕복 · 편도 약 4시간",
    code: "OBB-33204",
    date: "2026-12-07",
  },
  {
    kind: "flight",
    id: "flight-inbound",
    title: "빈 → 인천 (헬싱키 경유)",
    subtitle: "오스트리안 + 핀에어 · 12/9 13:40 출발",
    code: "PNR 7QM4RB",
    date: "2026-12-09",
  },
];
