/**
 * 바우처(예약 확인서) 목록.
 *
 * ⚠️ 이 사이트는 GitHub Pages 로 공개 배포된다. 여기 적는 내용은 누구나 볼 수 있다.
 *   - 확인서 원본(PDF·이미지)은 저장소에 올리지 말고 구글 드라이브에 두고 href 에 링크만 적는다.
 *     드라이브에서 "제한됨 → 특정 사용자 추가" 로 공유하면 링크가 노출돼도 지정한 계정만 열 수 있다.
 *   - 예약번호(PNR)는 성(姓)과 함께면 항공사에서 예약 조회·변경이 가능하다.
 *     공개해도 괜찮은 값만 code 에 적고, 아니면 "6XK2**" 처럼 가리거나 비워 둔다.
 */

export type VoucherKind =
  "flight" | "stay" | "tour" | "transport" | "timetable" | "guide";

export type Voucher = {
  /** 일정 화면에서 이 바우처로 이동할 때 쓰는 고유 id */
  id: string;
  kind: VoucherKind;
  title: string;
  subtitle: string;
  /** 예약번호 / PNR. 공개 사이트라 비워 두는 것을 기본으로 한다 */
  code?: string;
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
  timetable: {
    label: "시간표",
    emoji: "🕑",
    tone: "bg-emerald-100 text-emerald-700",
  },
  guide: {
    label: "동선",
    emoji: "🗺️",
    tone: "bg-amber-100 text-amber-700",
  },
};

/** 확인서 링크. 일정 화면의 버튼은 링크가 있으면 바우처 탭 대신 이 링크를 바로 연다 */
export function voucherHref(id: string) {
  return vouchers.find((v) => v.id === id)?.href;
}

/** 일정 화면의 버튼 문구. 시간표·동선은 "바우처" 대신 각자 이름으로 보여준다 */
export function voucherLabel(id: string) {
  const kind = vouchers.find((v) => v.id === id)?.kind;
  if (kind === "timetable") return "시간표";
  if (kind === "guide") return "동선";
  return "바우처";
}

export const vouchers: Voucher[] = [
  {
    kind: "flight",
    id: "flight-icn-ist",
    title: "인천 → 이스탄불 · TK91",
    subtitle: "터키항공 · 11/28 00:05 출발",
    date: "2026-11-28",
    href: "https://drive.google.com/file/d/1JQzPIkcCVXpl2tnB0FtrGd3yL1ngZ9LI/view?usp=drive_link",
  },
  {
    kind: "stay",
    id: "stay-rovaniemi",
    title: "로바니에미 숙소",
    subtitle: "11/28 체크인 · 공항에서 택시로 15분 (Bolt 앱)",
    date: "2026-11-28",
    href: "https://drive.google.com/file/d/198Vr0UatN-xLWcvJ9MFq1G0eRYnQRBDz/view?usp=drive_link",
  },
  {
    kind: "timetable",
    id: "timetable-santa-bus",
    title: "산타마을 버스 시간표",
    subtitle: "빨간 버스 · Porokulma E 정류장 · 기사님께 카드 결제",
    date: "2026-11-29",
    href: "https://www.airportbus.fi/pages/timetables",
  },
  {
    kind: "guide",
    id: "guide-santa-village",
    title: "산타마을 동선",
    subtitle: "산타클로스 마을 둘러보는 순서",
    date: "2026-11-29",
    href: "https://drive.google.com/file/d/15B_AuD3wR6Nzhg4hPuh6oQlwZJ5CFZRL/view?usp=drive_link",
  },
  {
    kind: "tour",
    id: "tour-aurora-1129",
    title: "오로라 헌팅 투어",
    subtitle: "11/29 19:30 · 숙소로 픽업",
    date: "2026-11-29",
    href: "https://drive.google.com/file/d/1lJ1nA8MMYdL2k004-uNiX6i4nsjmlnGM/view?usp=sharing",
  },
  {
    kind: "transport",
    id: "bus-1130",
    title: "11/30 버스",
    subtitle: "11:47 Rovakatu P 정류장 탑승 · 숙소에서 도보 10분",
    date: "2026-11-30",
    href: "https://drive.google.com/file/d/1BhdRHA51thYILnqd9f4j7GlU1hQ7JSIX/view?usp=sharing",
  },
  {
    kind: "stay",
    id: "stay-saariselka",
    title: "Holiday Club Saariselka",
    subtitle: "11/30 16:00 체크인 · Holiday Club L 정류장에서 도보 1분",
    date: "2026-11-30",
    href: "https://drive.google.com/file/d/18WBb79DskvjOiIhPu8Y9Wjc1ZYPzkrUz/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-aurora-1130",
    title: "오로라 헌팅 투어 (사리셀카)",
    subtitle: "11/30 20:00 전 · 숙소로 픽업 · 픽업 시간은 전날 안내",
    code: "arc-tt-10105157",
    date: "2026-11-30",
    href: "https://drive.google.com/file/d/1OgahbGdj4L2eEYMiFa7wEh3M6uMsY2UR/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-husky-1201",
    title: "허스키 썰매 (사리셀카)",
    subtitle: "12/1 12:15 미팅 · 15:00 종료 · Lapland Safaris office",
    date: "2026-12-01",
    href: "https://drive.google.com/file/d/1IqW7ftGJYTVbVlJ3f8jZJYWlVSAtl4XT/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-snowmobile-1201",
    title: "스노우모빌 오로라 (사리셀카)",
    subtitle: "12/1 19:45 · 운전면허증 챙기기",
    date: "2026-12-01",
    href: "https://drive.google.com/file/d/13tS5SYNp6lZMulA0MxVj5EOAZ4KtYEB_/view?usp=sharing",
  },
  {
    kind: "flight",
    id: "flight-hel-rvn",
    title: "헬싱키 → 로바니에미 · AY531",
    subtitle: "핀에어 · 12/1 08:15 출발",
    date: "2026-12-01",
  },
  {
    kind: "stay",
    id: "stay-igloo",
    title: "글래스 이글루 리조트",
    subtitle: "오로라 이글루 3인 · 3박",
    date: "2026-12-01",
  },
  {
    kind: "tour",
    id: "tour-husky",
    title: "허스키 & 순록 썰매 투어",
    subtitle: "09:00 픽업 · 방한복 대여 포함",
    date: "2026-12-02",
  },
  {
    kind: "tour",
    id: "tour-aurora",
    title: "오로라 헌팅 투어",
    subtitle: "20:30 픽업 · 날씨에 따라 이동",
    date: "2026-12-03",
  },
  {
    kind: "flight",
    id: "flight-rvn-vie",
    title: "로바니에미 → 빈 (헬싱키 경유)",
    subtitle: "핀에어 + 오스트리안 · 12/4 10:15 출발",
    date: "2026-12-04",
  },
  {
    kind: "stay",
    id: "stay-sacher",
    title: "호텔 자허 빈",
    subtitle: "디럭스 트윈 · 5박",
    date: "2026-12-04",
  },
  {
    kind: "tour",
    id: "tour-schonbrunn",
    title: "쇤브룬 궁전 그랜드 투어",
    subtitle: "09:30 입장 · 오디오가이드 한국어",
    date: "2026-12-05",
  },
  {
    kind: "transport",
    id: "rail-salzburg",
    title: "레일제트 빈 ↔ 잘츠부르크",
    subtitle: "왕복 · 좌석 지정 포함",
    date: "2026-12-06",
  },
  {
    kind: "transport",
    id: "rail-hallstatt",
    title: "빈 ↔ 할슈타트 열차",
    subtitle: "아트낭푸흐하임 경유 왕복 · 편도 약 4시간",
    date: "2026-12-07",
  },
  {
    kind: "flight",
    id: "flight-inbound",
    title: "빈 → 인천 (헬싱키 경유)",
    subtitle: "오스트리안 + 핀에어 · 12/9 13:40 출발",
    date: "2026-12-09",
  },
];
