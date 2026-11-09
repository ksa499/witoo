import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** 데스크톱 화면에서만 보이는 "폰으로 열기" QR. 현재 접속 주소를 그대로 QR로 만들어요. */
export default function QrPanel() {
  const [src, setSrc] = useState('');
  const url = window.location.origin + '/';
  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 216, color: { dark: '#252422', light: '#ffffff' } }).then(setSrc);
  }, [url]);
  const local = /^(localhost|127\.)/.test(window.location.hostname);
  return (
    <aside className="qr-panel">
      <h2>폰으로 열기</h2>
      {src && <img src={src} alt="QR 코드" width={216} height={216} />}
      <p className="u">{url}</p>
      <p>{local
        ? 'localhost 주소는 폰에서 열 수 없어요. 터미널에 나온 Network 주소로 접속하거나, 배포한 https 주소에서 이 QR을 보세요.'
        : '폰 카메라로 스캔한 뒤 "홈 화면에 추가"(아이폰) 또는 "앱 설치"(안드로이드)를 누르세요.'}</p>
    </aside>
  );
}
