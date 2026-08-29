"use client";

import { useEffect, useMemo, useState } from "react";
import type { TripDay } from "@/data/trip";
import {
  buildCalendarGrid,
  formatMonthTitle,
  fromKey,
  toKey,
  weekdayLabels,
} from "@/lib/date";

type Props = {
  open: boolean;
  days: TripDay[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
};

export default function DatePickerModal({
  open,
  days,
  selectedDate,
  onSelect,
  onClose,
}: Props) {
  // 열려 있는 동안 ESC 로 닫고 배경 스크롤을 막는다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  // key 를 주면 열 때마다 달력 커서가 선택 날짜 기준으로 초기화된다
  return (
    <CalendarSheet
      key={selectedDate}
      days={days}
      selectedDate={selectedDate}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}

function CalendarSheet({
  days,
  selectedDate,
  onSelect,
  onClose,
}: Omit<Props, "open">) {
  const byDate = useMemo(
    () => new Map(days.map((d, i) => [d.date, { day: d, index: i }])),
    [days],
  );
  const [cursor, setCursor] = useState(() => {
    const d = fromKey(selectedDate);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const grid = buildCalendarGrid(cursor.year, cursor.month);
  const shift = (delta: number) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="다른 날짜 일정 선택"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 text-slate-900 shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">다른 날짜 일정</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="이전 달"
            className="grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
          >
            ‹
          </button>
          <p className="text-sm font-semibold">
            {formatMonthTitle(cursor.year, cursor.month)}
          </p>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="다음 달"
            className="grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
          >
            ›
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
          {weekdayLabels.map((w) => (
            <span key={w} className="py-1">
              {w}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const key = toKey(date);
            const entry = byDate.get(key);
            const inMonth = date.getMonth() === cursor.month;
            const isSelected = key === selectedDate;

            if (!entry) {
              return (
                <span
                  key={key}
                  className={`grid h-11 place-items-center rounded-xl text-sm ${
                    inMonth ? "text-slate-300" : "text-slate-200"
                  }`}
                >
                  {date.getDate()}
                </span>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelect(key);
                  onClose();
                }}
                aria-current={isSelected ? "date" : undefined}
                className={`grid h-11 place-items-center rounded-xl text-sm font-semibold transition ${
                  isSelected
                    ? "bg-slate-900 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
              >
                <span>{date.getDate()}</span>
                <span
                  className={`text-[9px] font-medium ${
                    isSelected ? "text-white/70" : "text-teal-600/70"
                  }`}
                >
                  D{entry.index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
