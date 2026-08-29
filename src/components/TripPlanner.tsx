"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useSyncExternalStore } from "react";
import DatePickerModal from "@/components/DatePickerModal";
import VoucherList from "@/components/VoucherList";
import { categoryMeta, trip, tripDays, type Place } from "@/data/trip";
import { formatLong, toKey } from "@/lib/date";

// leaflet 은 window 에 의존하므로 서버 렌더링에서 제외한다
const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-slate-100 text-sm text-slate-400">
      지도를 불러오는 중…
    </div>
  ),
});

function placeMapsUrl(place: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[15px]"
      aria-hidden
    >
      <path d="M20 10c0 5.25-6.2 10.6-8 10.6S4 15.25 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[15px]"
      aria-hidden
    >
      <path d="M3 9V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V9a3 3 0 0 0 0 6v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V15a3 3 0 0 0 0-6Z" />
      <path d="M12 8.5v7" strokeDasharray="2 2.5" />
    </svg>
  );
}

/** 카드 하단 · 지도 팝업의 이동 버튼 공통 스타일 */
const actionClass =
  "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900";

const navButtonClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
    active
      ? "bg-accent text-slate-900"
      : "bg-white/10 text-white/80 ring-1 ring-white/25 hover:bg-white/20"
  }`;

/** 기기의 오늘 날짜. 서버 프리렌더 시점에는 알 수 없으므로 첫날을 스냅샷으로 쓴다 */
const subscribeNoop = () => () => {};

export default function TripPlanner() {
  const [tab, setTab] = useState<"plan" | "voucher">("plan");
  // 사용자가 달력에서 고른 날짜. null 이면 오늘(없으면 첫날)을 따라간다
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  // 바우처 탭으로 넘어갈 때 스크롤할 대상. n 은 같은 항목 재클릭 감지용
  const [voucherFocus, setVoucherFocus] = useState<{
    id: string;
    n: number;
  } | null>(null);

  const todayKey = useSyncExternalStore(
    subscribeNoop,
    () => toKey(new Date()),
    () => tripDays[0].date,
  );
  const defaultDate = tripDays.some((d) => d.date === todayKey)
    ? todayKey
    : tripDays[0].date;
  const selectedDate = pickedDate ?? defaultDate;

  const dayIndex = tripDays.findIndex((d) => d.date === selectedDate);
  const day = tripDays[dayIndex];
  const places = useMemo(() => day.places, [day]);

  /** 리스트의 바우처 버튼 → 바우처 탭의 해당 카드로 이동 */
  const openVoucher = (id: string) => {
    setVoucherFocus((prev) => ({ id, n: (prev?.n ?? 0) + 1 }));
    setTab("voucher");
  };

  const selectDate = (date: string) => {
    setPickedDate(date);
    setActiveIndex(null);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      {/* ── 상단: 제목 + 버튼 ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[linear-gradient(160deg,#123a63_0%,#0c2340_100%)] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 pt-5 pb-3 sm:px-6 sm:pt-7 sm:pb-4">
          <h1 className="text-[22px] leading-snug font-bold tracking-tight">
            {trip.members}
            <br />
            <span className="text-accent">{trip.title}</span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("plan")}
              aria-pressed={tab === "plan"}
              className={navButtonClass(tab === "plan")}
            >
              일정
            </button>
            <button
              type="button"
              onClick={() => setTab("voucher")}
              aria-pressed={tab === "voucher"}
              className={navButtonClass(tab === "voucher")}
            >
              바우처
            </button>
          </div>
        </div>
      </header>

      {/* ── 본문: 탭에 따라 일정(리스트 + 지도) 또는 바우처 ──────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-6">
        {tab === "voucher" && <VoucherList focus={voucherFocus} />}

        {tab === "plan" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {day.title}
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  DAY {dayIndex + 1} · {formatLong(day.date)} · {day.city} ·{" "}
                  {places.length}곳
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <span aria-hidden>📅</span> 날짜 변경
              </button>
            </div>

            {/* 지도: 날짜 아래 고정 배치 (리스트보다 위) */}
            <section className="mt-3">
              <div className="relative z-0 h-[38vh] min-h-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[42vh] lg:h-[46vh]">
                <TripMap
                  places={places}
                  activeIndex={activeIndex}
                  onSelect={setActiveIndex}
                  onVoucher={openVoucher}
                />
              </div>
            </section>

            {/* 일정 리스트 */}
            <ol className="mt-4 space-y-1.5">
              {places.map((place, i) => {
                const meta = categoryMeta[place.category];
                const active = i === activeIndex;
                const voucherId = place.voucher;
                // 공항은 구글맵을 열어봐야 쓸모가 없으므로 항공편은 버튼을 뺀다
                const showMaps = place.category !== "flight";
                return (
                  <li key={`${place.name}-${i}`}>
                    <div
                      className={`rounded-xl border bg-white px-2.5 py-2 transition ${
                        active
                          ? "border-slate-900 shadow-sm"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <span
                          className="mt-px grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: meta.color }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2">
                            {place.time && (
                              <span className="text-xs font-semibold text-slate-900 tabular-nums">
                                {place.time}
                              </span>
                            )}
                            <span
                              className="text-[10px] font-medium"
                              style={{ color: meta.color }}
                            >
                              {meta.emoji} {meta.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {place.name}
                          </p>
                          {place.desc && (
                            <p className="mt-0.5 text-xs leading-snug text-slate-500">
                              {place.desc}
                            </p>
                          )}
                          {/* 이동 버튼 (항공편은 없음) */}
                          {(showMaps || voucherId) && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {showMaps && (
                                <a
                                  href={placeMapsUrl(place)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={actionClass}
                                >
                                  <PinIcon />
                                  구글맵
                                </a>
                              )}
                              {voucherId && (
                                <button
                                  type="button"
                                  onClick={() => openVoucher(voucherId)}
                                  className={actionClass}
                                >
                                  <TicketIcon />
                                  바우처
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-[11px] text-slate-400">
        © 2026 jungdowny
      </footer>

      <DatePickerModal
        open={calendarOpen}
        days={tripDays}
        selectedDate={selectedDate}
        onSelect={selectDate}
        onClose={() => setCalendarOpen(false)}
      />
    </div>
  );
}
