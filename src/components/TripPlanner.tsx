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

/** 하루 전체를 구글맵 길찾기로 넘기는 링크 (경유지 최대 9개) */
function dayRouteUrl(places: Place[]) {
  if (places.length < 2) return placeMapsUrl(places[0]);
  const coord = (p: Place) => `${p.lat},${p.lng}`;
  const origin = coord(places[0]);
  const destination = coord(places[places.length - 1]);
  const waypoints = places
    .slice(1, -1)
    .slice(0, 9)
    .map(coord)
    .join("|");
  const params = new URLSearchParams({ api: "1", origin, destination });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

const navButtonClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
    active
      ? "bg-slate-900 text-white"
      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
  }`;

/** 기기의 오늘 날짜. 서버 프리렌더 시점에는 알 수 없으므로 첫날을 스냅샷으로 쓴다 */
const subscribeNoop = () => () => {};

export default function TripPlanner() {
  const [tab, setTab] = useState<"plan" | "voucher">("plan");
  // 사용자가 달력에서 고른 날짜. null 이면 오늘(없으면 첫날)을 따라간다
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const selectDate = (date: string) => {
    setPickedDate(date);
    setActiveIndex(null);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      {/* ── 상단: 제목 + 버튼 ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 pt-5 pb-3 sm:px-6 sm:pt-7 sm:pb-4">
          <h1 className="text-[22px] leading-snug font-bold tracking-tight">
            {trip.members}
            <br />
            <span className="text-teal-600">{trip.title}</span>
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {tab === "voucher" && <VoucherList />}

        {tab === "plan" && (
          <>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
                {day.title}
              </h2>
              <p className="text-sm text-slate-500">
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

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_1.15fr] lg:items-start">
            {/* 일정 리스트 */}
            <ol className="space-y-2">
              {places.map((place, i) => {
                const meta = categoryMeta[place.category];
                const active = i === activeIndex;
                return (
                  <li key={`${place.name}-${i}`}>
                    <div
                      className={`flex gap-3 rounded-2xl border bg-white p-3 transition ${
                        active
                          ? "border-slate-900 shadow-md"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveIndex(active ? null : i)}
                        aria-pressed={active}
                        className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      >
                        <span
                          className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                          style={{ background: meta.color }}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
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
                          </span>
                          <span className="mt-0.5 block text-sm font-semibold text-slate-900">
                            {place.name}
                          </span>
                          {place.desc && (
                            <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                              {place.desc}
                            </span>
                          )}
                        </span>
                      </button>
                      <a
                        href={placeMapsUrl(place)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${place.name} 구글맵에서 열기`}
                        className="grid size-8 shrink-0 place-items-center self-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        ↗
                      </a>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* 지도 (모바일에서는 리스트 아래, 데스크톱에서는 오른쪽 고정) */}
            <section className="lg:sticky lg:top-44">
              <div className="relative z-0 h-[60vh] min-h-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-[calc(100dvh-12rem)]">
                <TripMap
                  places={places}
                  activeIndex={activeIndex}
                  onSelect={setActiveIndex}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-slate-400">
                  핀을 누르면 상세가 열립니다 · 점선은 이동 순서
                </p>
                <a
                  href={dayRouteUrl(places)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  구글맵으로 이 코스 열기 ↗
                </a>
              </div>
            </section>
          </div>
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
