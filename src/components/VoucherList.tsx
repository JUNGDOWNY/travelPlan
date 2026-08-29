import { formatLong } from "@/lib/date";
import { voucherKindMeta, vouchers } from "@/data/vouchers";

export default function VoucherList() {
  // 날짜별로 묶어서 순서대로 보여준다
  const grouped = vouchers.reduce<Record<string, typeof vouchers>>(
    (acc, voucher) => {
      (acc[voucher.date] ??= []).push(voucher);
      return acc;
    },
    {},
  );
  const dates = Object.keys(grouped).sort();

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        항공 · 숙소 · 투어 예약 확인서 {vouchers.length}건
      </p>
      {dates.map((date) => (
        <section key={date} className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">
            {formatLong(date)}
          </h3>
          <ul className="space-y-2">
            {grouped[date].map((voucher) => {
              const meta = voucherKindMeta[voucher.kind];
              return (
                <li
                  key={`${voucher.code}-${voucher.title}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.tone}`}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {voucher.code}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {voucher.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {voucher.subtitle}
                  </p>
                  {voucher.href ? (
                    <a
                      href={voucher.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      확인서 열기 ↗
                    </a>
                  ) : (
                    <p className="mt-3 text-[11px] text-slate-400">
                      확인서 파일 준비 중
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
