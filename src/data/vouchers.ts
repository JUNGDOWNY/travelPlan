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
    subtitle: "11/30 20:00 전 · 숙소로 픽업 · 픽업 시간 전날 메일로 보내줌",
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
    title: "스노우모빌 (사리셀카)",
    subtitle: "12/1 19:45 · 운전면허증 챙기기",
    date: "2026-12-01",
    href: "https://drive.google.com/file/d/13tS5SYNp6lZMulA0MxVj5EOAZ4KtYEB_/view?usp=sharing",
  },
  {
    kind: "stay",
    id: "stay-northern-lights",
    title: "노던 라이츠 빌리지",
    subtitle: "12/2 16:00 체크인 · Holiday Club L 정류장에서 도보 15분",
    date: "2026-12-02",
    href: "https://drive.google.com/file/d/14Olox4W6XtgVGOcoj2JGErL0-snaaQMA/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "sauna-northern-lights",
    title: "사우나 (노던 라이츠 빌리지)",
    subtitle: "12/2 20:00",
    date: "2026-12-02",
    href: "https://drive.google.com/file/d/1GtOpHBqU_d3-6W7INHoSTu59K-HrzQf5/view?usp=sharing",
  },
  {
    kind: "transport",
    id: "shuttle-1203",
    title: "12/3 셔틀",
    subtitle: "11:15 노던 라이츠 빌리지 출발",
    date: "2026-12-03",
    href: "https://drive.google.com/file/d/11xr7f11K8u3BiqwHta9_AAdwHc6MDAOZ/view?usp=sharing",
  },
  {
    kind: "flight",
    id: "flight-ivl-vie",
    title: "이발로 → 헬싱키 → 빈 · AY0604 / AY1475",
    subtitle: "핀에어 · 12/3 13:15 출발 · 헬싱키 경유",
    date: "2026-12-03",
    href: "https://drive.google.com/file/d/1XYsujcTTdTvgWnDcHr6SqFYc6vMTaUVm/view?usp=sharing",
  },
  {
    kind: "timetable",
    id: "timetable-vab1",
    title: "빈 공항버스 VAB 1번 시간표",
    subtitle: "빈 공항 → Westbahnhof · 7번 탑승 · 30분 배차",
    date: "2026-12-03",
    href: "https://drive.google.com/file/d/17KRlw0alrMGK4ihPhhAQcZXO8dge5CgK/view?usp=sharing",
  },
  {
    kind: "stay",
    id: "stay-vienna-gold",
    title: "Flatprovider Vienna Gold Apartments",
    subtitle: "12/3 21:00 도착",
    date: "2026-12-03",
    href: "https://drive.google.com/file/d/1PQycu94dHaD49J8McGfLFeA78Jor9D_T/view?usp=sharing",
  },
  {
    kind: "timetable",
    id: "timetable-ski-bus",
    title: "사리셀카 스키버스 시간표",
    subtitle: "Holiday Club L 정류장 ↔ 정상 (Kaunispää)",
    date: "2026-12-02",
    href: "https://drive.google.com/file/d/1oN4KBC1bcq9GGfyPW2dqD_SqH8LHvQGW/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-khm-1204",
    title: "빈 미술사 박물관 투어",
    subtitle: "12/4 14:00 · 박물관 앞 계단 위 집합 · 입장료 66유로 현금",
    date: "2026-12-04",
    href: "https://drive.google.com/file/d/1I2UkkUDSR4rhNzZRO97Qu52Jl_dPRXBi/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "food-ribs-1204",
    title: "립스 오브 비엔나 예약",
    subtitle: "12/4 17:00",
    date: "2026-12-04",
    href: "https://drive.google.com/file/d/1FMFF1MALugoX_Y7L8BscXkz5L_Nmtk9z/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "food-figlmuller-1205",
    title: "피그뮐러 1호점 예약",
    subtitle: "12/5 11:00",
    date: "2026-12-05",
    href: "https://drive.google.com/file/d/1z94wXFEWi7ypc6qCUP9thVyOggmxPz5W/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-belvedere-1205",
    title: "벨베데레 궁전 투어",
    subtitle: "12/5 15:30 · 상궁 매표소 앞 미팅 · 입장료 현금 69유로",
    date: "2026-12-05",
    href: "https://drive.google.com/file/d/1luUsvzI4hTHpgiI3wuLM0SEt0g_jTdme/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "concert-musikverein-1205",
    title: "빈 음악협회 음악회",
    subtitle: "12/5 19:30",
    date: "2026-12-05",
    href: "https://drive.google.com/file/d/1pl-oqfpPoL4J3blukE5do8qF86kvaPZh/view?usp=sharing",
  },
  {
    kind: "transport",
    id: "rail-1206",
    title: "빈 → 잘츠부르크 · 열차 910",
    subtitle: "10:38 Wien Westbahnhof 출발 → 13:08 Salzburg Hbf 도착",
    date: "2026-12-06",
    href: "https://drive.google.com/file/d/1_7coGKvO8i8SbKGNSZhGFVKI19tSWwU0/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "pass-salzburg",
    title: "잘츠부르크 시티패스",
    subtitle: "12/6 Salzburg Hbf Tourist Info에서 교환 · 네임펜으로 시간 기입",
    date: "2026-12-06",
    href: "https://drive.google.com/file/d/1Im0gKd_sAnfamzB0DN2vxB4A0aDABcV_/view?usp=sharing",
  },
  {
    kind: "stay",
    id: "stay-adlerhof",
    title: "아들러호프",
    subtitle: "12/6 14:00 짐 맡기기 · 12/8 07:00 체크아웃",
    date: "2026-12-06",
    href: "https://drive.google.com/file/d/17-I4PNj2laLpAM9M6_4iw8yrDI0PaiRQ/view?usp=sharing",
  },
  {
    kind: "transport",
    id: "car-sixt-1208",
    title: "SIXT 렌트카 (잘츠부르크 공항)",
    subtitle: "12/8 08:00 픽업 · 1시간 전 앱으로 차량 선택",
    date: "2026-12-08",
    href: "https://drive.google.com/file/d/1hBCuNqxtzF8Y-iP8MdkXwb10_PiRXz0R/view?usp=sharing",
  },
  {
    kind: "tour",
    id: "tour-saltmine-1208",
    title: "할슈타트 소금광산 투어",
    subtitle: "12/8 13:10 · 매표소에서 바우처 보여주고 푸니쿨라 티켓 받기",
    date: "2026-12-08",
    href: "https://drive.google.com/file/d/18UgkPklS8cbiA5DpzD_rBU4Mzf6agi8h/view?usp=sharing",
  },
  {
    kind: "stay",
    id: "stay-kuy-alpin",
    title: "쿠이 알핀 호텔",
    subtitle: "12/8 18:00 체크인 · 10:00에 짐 먼저 맡기기",
    date: "2026-12-08",
    href: "https://drive.google.com/file/d/1ePYpOYtuzXdJ3c5OSXKvtfXca_KdNZT5/view?usp=drive_link",
  },
  {
    kind: "flight",
    id: "flight-szg-home",
    title: "잘츠부르크 → 한국",
    subtitle: "12/9 10:50 잘츠부르크 공항 출발",
    date: "2026-12-09",
    href: "https://drive.google.com/file/d/1gWnlvu2Y94_1JHnsU6Lu4n0OkXZEIdEs/view?usp=sharing",
  },
];
