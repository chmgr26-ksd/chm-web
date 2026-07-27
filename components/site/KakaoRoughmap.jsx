'use client';

import { useEffect, useRef } from 'react';

// 카카오맵 '지도 퍼가기'(roughmap 약도) 임베드.
// - 외부 로더(ssl.daumcdn.net/roughmapLoader.js)를 1회 로드 후 daum.roughmap.Lander로 렌더.
// - 컨테이너 id는 반드시 `daumRoughmapContainer<timestamp>` 규칙을 따라야 Lander가 찾음.
// - key는 카카오에서 저장한 지점 식별자(장소가 바뀌면 카카오에서 재발급 후 교체).
const LOADER_SRC = 'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js';

export default function KakaoRoughmap({
  mapKey = '2g5ohkubp23z',
  timestamp = '1785172950571',
  height = 360,
  className = '',
}) {
  const containerRef = useRef(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let intervalId;
    let timeoutId;

    const tryRender = () => {
      const Lander = window.daum?.roughmap?.Lander;
      if (!Lander) return false;
      if (renderedRef.current) return true;
      renderedRef.current = true;
      // 재마운트 시 중복 주입 방지.
      el.innerHTML = '';
      new Lander({
        timestamp,
        key: mapKey,
        mapWidth: '100%', // 반응형 렌더(부모 폭에 맞춤)
        mapHeight: String(height),
      }).render();
      return true;
    };

    if (tryRender()) return;

    // 로더 스크립트 1회 로드.
    let script = document.querySelector(`script[src="${LOADER_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = LOADER_SRC;
      script.charset = 'UTF-8';
      document.body.appendChild(script);
    }

    // 로더는 비동기이므로 Lander 준비될 때까지 폴링(최대 10초).
    intervalId = setInterval(() => {
      if (tryRender()) clearInterval(intervalId);
    }, 100);
    timeoutId = setTimeout(() => clearInterval(intervalId), 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [mapKey, timestamp, height]);

  return (
    <div
      ref={containerRef}
      id={`daumRoughmapContainer${timestamp}`}
      className={`root_daum_roughmap root_daum_roughmap_landing ${className}`}
      style={{ width: '100%' }}
    />
  );
}
