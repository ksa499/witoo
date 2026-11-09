import { useEffect, useState } from 'react';
import Main from './screens/Main';
import QrPanel from './QrPanel';

const W = 393, H = 852;

/** Keeps the 393×852 design stage centered and scaled to fit any screen. */
export default function App() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('orientationchange', on); };
  }, []);
  const fit = Math.min(size.w / W, size.h / H);
  const scale = size.w > 600 ? Math.min(1, fit) : fit; // desktop: never upscale
  return (
    <div className="stage-wrap">
      <div className="stage" style={{ width: W, height: H, transform: `scale(${scale})`, marginLeft: -(W / 2), marginTop: -(H / 2) }}>
        <Main />
      </div>
      {size.w > 900 && new URLSearchParams(window.location.search).has('qr') && <QrPanel />}
    </div>
  );
}
