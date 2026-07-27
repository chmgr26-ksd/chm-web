// 카카오맵 '지도 퍼가기'(roughmap 약도) — iframe srcdoc으로 임베드.
// 카카오 로더는 roughmapLander.js를 document.write()로 주입하므로 "파서 삽입" 환경이 필요하다.
// SPA 메인 문서에 로더를 동적 삽입하면 브라우저가 document.write를 무시해 렌더가 실패한다.
// 그래서 iframe 자체 문서(srcdoc) 안에 표준 스니펫을 파싱시켜, 카카오가 의도한 환경 그대로
// 동작시킨다(부모 https 오리진 상속 → 외부 스크립트 로드 OK, XFO/CSP frame-ancestors 무관).
// key는 카카오에서 저장한 지점 식별자 — 장소가 바뀌면 카카오 퍼가기에서 재발급 후 교체.
export default function KakaoRoughmap({
  mapKey = '2g5ohkubp23z',
  timestamp = '1785172950571',
  height = 320,
  className = '',
}) {
  const srcDoc =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>html,body{margin:0;padding:0;overflow:hidden}.root_daum_roughmap{width:100%!important}</style>' +
    '</head><body>' +
    `<div id="daumRoughmapContainer${timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div>` +
    '<script charset="UTF-8" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script>' +
    `<script charset="UTF-8">new daum.roughmap.Lander({timestamp:"${timestamp}",key:"${mapKey}",mapWidth:"100%",mapHeight:"${height}"}).render();</script>` +
    '</body></html>';

  return (
    <iframe
      title="카카오맵 약도 · 로드뷰 · 길찾기"
      srcDoc={srcDoc}
      loading="lazy"
      className={className}
      // 약도 높이 + 하단 컨트롤바(길찾기·로드뷰·큰지도) 여유
      style={{ width: '100%', height: height + 46, border: 0, display: 'block' }}
    />
  );
}
