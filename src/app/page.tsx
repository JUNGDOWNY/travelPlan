const destinations = [
  {
    name: "트롬쇠, 노르웨이",
    season: "9월 – 3월",
    desc: "오로라 벨트 한가운데. 도시에서 20분만 나가면 하늘이 열린다.",
  },
  {
    name: "아이슬란드 남부",
    season: "10월 – 3월",
    desc: "빙하 석호 위로 흔들리는 초록빛. 렌터카 한 대면 충분하다.",
  },
  {
    name: "옐로나이프, 캐나다",
    season: "11월 – 4월",
    desc: "맑은 날이 가장 많은 곳. 3박이면 관측 확률 95%.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.35),transparent_60%),radial-gradient(ellipse_at_30%_20%,rgba(129,140,248,0.35),transparent_55%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-28 sm:py-36">
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs tracking-widest uppercase text-teal-200">
            Aurora Travel
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            밤하늘이 움직이는 곳으로,
            <br />
            <span className="text-teal-300">오로라 트래블</span>
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            관측 확률이 가장 높은 시즌과 도시만 골라 담은 여행 일정.
            준비물부터 촬영 세팅까지 한 번에 안내합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#destinations"
              className="rounded-full bg-teal-400 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-teal-300"
            >
              여행지 보기
            </a>
            <a
              href="#destinations"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              시즌 캘린더
            </a>
          </div>
        </div>
      </section>

      <section id="destinations" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold sm:text-3xl">추천 여행지</h2>
        <p className="mt-2 text-sm text-slate-500">
          KP 지수와 맑은 날 통계를 기준으로 고른 세 곳.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <article
              key={d.name}
              className="rounded-2xl border border-black/10 p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/15"
            >
              <p className="text-xs font-medium tracking-wide text-teal-600 dark:text-teal-300">
                {d.season}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{d.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {d.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-xs text-slate-500 dark:border-white/15">
        © 2026 Aurora Travel
      </footer>
    </main>
  );
}
