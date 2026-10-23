"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categoryMeta, type Place } from "@/data/trip";
import { voucherHref, voucherLabel } from "@/data/vouchers";

type Props = {
  places: Place[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
  /** 팝업의 "바우처" 버튼 */
  onVoucher: (id: string) => void;
};

/** 번호가 찍힌 원형 핀. 선택된 핀은 크게 + 링이 생긴다. */
function numberedIcon(index: number, place: Place, active: boolean) {
  const color = categoryMeta[place.category].color;
  const size = active ? 40 : 30;
  return L.divIcon({
    // className 을 직접 주면 leaflet-div-icon 기본 스타일(흰 배경/테두리)이 붙지 않는다
    className: "trip-marker",
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};color:#fff;
      font-size:${active ? 15 : 13}px;font-weight:700;line-height:1;
      border:${active ? 3 : 2}px solid #fff;
      box-shadow:0 2px 6px rgba(15,23,42,.45)${
        active ? `,0 0 0 5px ${color}44` : ""
      };
    ">${index + 1}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function mapsUrl(place: Place) {
  return (
    place.mapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`
  );
}

const POPUP_PILL =
  "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 no-underline transition hover:bg-slate-200 hover:text-slate-900";

/** 핀 팝업: 분류 · 위치 · 내용 + 구글맵/바우처 버튼 */
function popupNode(
  index: number,
  place: Place,
  onVoucher: (id: string) => void,
) {
  const meta = categoryMeta[place.category];
  const voucherId = place.voucher;
  const voucherLink = voucherId ? voucherHref(voucherId) : undefined;
  // 공항은 구글맵을 열어봐야 쓸모가 없으므로 항공편은 구글맵 버튼을 뺀다
  // 바우처는 확인서 링크가 있으면 바로 열고, 없으면 바우처 탭으로 보낸다
  const actions = [
    place.category !== "flight" &&
      `<a href="${mapsUrl(place)}" target="_blank" rel="noreferrer" class="${POPUP_PILL}">구글맵</a>`,
    voucherId &&
      (voucherLink
        ? `<a href="${voucherLink}" target="_blank" rel="noreferrer" class="${POPUP_PILL}">${voucherLabel(voucherId)}</a>`
        : `<button type="button" data-voucher class="${POPUP_PILL}" style="cursor:pointer">${voucherLabel(voucherId)}</button>`),
    ...(place.links ?? []).map(
      (link) =>
        `<a href="${link.href}" target="_blank" rel="noreferrer" class="${POPUP_PILL}">${link.label}</a>`,
    ),
  ].filter(Boolean);

  const el = document.createElement("div");
  el.style.minWidth = "184px";
  el.innerHTML = `
    <p style="margin:0;font-size:11px;font-weight:600;color:${meta.color}">
      ${index + 1}. ${meta.emoji} ${meta.label}
    </p>
    <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#0f172a">${place.name}</p>
    ${
      place.desc
        ? `<p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#475569;white-space:pre-line">${place.desc}</p>`
        : ""
    }
    ${actions.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${actions.join("")}</div>` : ""}`;

  if (voucherId && !voucherLink) {
    el.querySelector("[data-voucher]")?.addEventListener("click", () =>
      onVoucher(voucherId),
    );
  }
  return el;
}

export default function TripMap({
  places,
  activeIndex,
  onSelect,
  onVoucher,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const lineRef = useRef<L.Polyline | null>(null);
  // 최신 onSelect 를 지도 재생성 없이 참조하기 위한 보관함
  const onSelectRef = useRef(onSelect);
  const onVoucherRef = useRef(onVoucher);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onVoucherRef.current = onVoucher;
  }, [onSelect, onVoucher]);

  // 지도 생성 (마운트 시 1회)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([60.17, 24.94], 12);

    // CARTO 베이스맵은 API 키가 필수가 되어 키 없이 쓸 수 있는 OSM 표준 타일을 사용한다
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      lineRef.current = null;
    };
  }, []);

  // 날짜가 바뀌면 마커/경로를 새로 그리고 전체가 보이도록 맞춘다
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    lineRef.current?.remove();
    lineRef.current = null;

    if (places.length === 0) return;

    const latlngs = places.map((p) => [p.lat, p.lng] as [number, number]);
    lineRef.current = L.polyline(latlngs, {
      color: "#334155",
      weight: 2,
      opacity: 0.75,
      dashArray: "6 8",
    }).addTo(map);

    markersRef.current = places.map((place, i) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: numberedIcon(i, place, false),
        zIndexOffset: i,
        title: place.name,
      })
        .addTo(map)
        .bindPopup(
          popupNode(i, place, (id) => onVoucherRef.current(id)),
          {
            closeButton: false,
            offset: [0, -4],
          },
        )
        .on("click", () => onSelectRef.current(i));
      return marker;
    });

    map.fitBounds(L.latLngBounds(latlngs), {
      padding: [56, 56],
      maxZoom: 14,
    });
  }, [places]);

  // 선택된 장소 강조 + 팝업 열기
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker, i) => {
      const active = i === activeIndex;
      marker.setIcon(numberedIcon(i, places[i], active));
      marker.setZIndexOffset(active ? 1000 : i);
    });
    if (activeIndex == null) return;
    const marker = markersRef.current[activeIndex];
    if (!marker) return;
    map.panTo(marker.getLatLng(), { animate: true });
    marker.openPopup();
  }, [activeIndex, places]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="일정 지도"
      className="h-full w-full [&_.leaflet-container]:font-sans"
    />
  );
}
