/** "YYYY-MM-DD" 문자열만 다루는 날짜 헬퍼. 타임존 보정이 필요 없도록 UTC 를 쓰지 않는다. */

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "12월 28일 (월)" */
export function formatLong(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

/** "12.28" */
export function formatShort(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export const weekdayLabels = WEEKDAYS;

/**
 * 달력 한 판(6주 × 7일)에 들어갈 날짜들. 앞뒤 달의 날짜도 채워서 격자를 맞춘다.
 */
export function buildCalendarGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
