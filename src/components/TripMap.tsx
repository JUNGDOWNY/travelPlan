"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categoryMeta, type Place } from "@/data/trip";

type Props = {
  places: Place[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
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

/** 핀 팝업: 분류 · 이름 · 시각까지만 (상세는 리스트에서 본다) */
function popupHtml(index: number, place: Place) {
  const meta = categoryMeta[place.category];
  const time = place.time
    ? `<p style="margin:4px 0 0;font-size:12px;font-weight:600;color:#334155">${place.time}</p>`
    : "";
  return `
    <div style="min-width:150px">
      <p style="margin:0;font-size:11px;color:${meta.color};font-weight:600">
        ${index + 1}. ${meta.emoji} ${meta.label}
      </p>
      <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#0f172a">${place.name}</p>
      ${time}
    </div>`;
}

export default function TripMap({ places, activeIndex, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const lineRef = useRef<L.Polyline | null>(null);
  // 최신 onSelect 를 지도 재생성 없이 참조하기 위한 보관함
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // 지도 생성 (마운트 시 1회)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([60.17, 24.94], 12);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);
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
        .bindPopup(popupHtml(i, place), { closeButton: false, offset: [0, -4] })
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
