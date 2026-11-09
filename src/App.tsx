import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Main from './screens/Main';
import QrPanel from './QrPanel';

const W = 393, H = 852;

function viewport() {
  return { w: window.innerWidth, h: window.innerHeight };
}

const editing = () => {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable);
};

/**
 * Fits the 393×852 design to any phone.
 * - Taller phones: scale to the width and give the extra height to the stage;
 *   bottom-docked UI (tab bar, floating buttons, bottom sheets) moves down and
 *   full-height overlays stretch, so nothing floats in the middle.
 * - Shorter viewports (browser bars, tablets, desktop): scale to the height.
 */
export default function App() {
  const [size, setSize] = useState(viewport());
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // The on-screen keyboard shrinks the viewport; keep the layout while typing.
    const on = () => setSize((prev) => {
      const next = viewport();
      return editing() && next.w === prev.w && next.h < prev.h ? prev : next;
    });
    const afterBlur = () => setTimeout(on, 350);
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    window.addEventListener('focusout', afterBlur);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
      window.removeEventListener('focusout', afterBlur);
    };
  }, []);

  const desktop = size.w > 600;
  const sw = size.w / W;
  const tall = !desktop && size.h >= H * sw - 0.5;
  const scale = desktop ? Math.min(1, size.w / W, size.h / H) : tall ? sw : Math.min(sw, size.h / H);
  const stageH = tall ? Math.round(size.h / sw) : H;
  const extra = Math.max(0, stageH - H);

  // Move bottom-docked elements down by `extra`, stretch full-height overlays.
  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      root.style.setProperty('--stage-h', (H + extra) + 'px');
      const rb = root.getBoundingClientRect();
      const els = root.querySelectorAll<HTMLElement>('*');
      els.forEach((el) => {
        if (el.dataset.dhDone === String(extra)) return;
        const cs = getComputedStyle(el);
        const had = el.dataset.dhKind;
        if (had) { // undo previous adjustment before re-evaluating
          if (had === 'move') el.style.translate = '';
          if (had === 'grow') el.style.height = el.dataset.dhH || '';
          delete el.dataset.dhKind;
        }
        el.dataset.dhDone = String(extra);
        if (!extra || cs.position !== 'absolute') return;
        if (el.closest('[data-dh-kind="move"]')) return;
        const r = el.getBoundingClientRect();
        const top = (r.top - rb.top) / scale, bottom = (r.bottom - rb.top) / scale;
        if (top <= 1 && bottom >= H - 3 && r.width / scale >= W - 2) {
          el.dataset.dhH = el.style.height; el.dataset.dhKind = 'grow';
          el.style.height = (r.height / scale + extra) + 'px';
        } else if (top >= 480 && bottom >= 600 && bottom <= H + 2) {
          el.dataset.dhKind = 'move'; el.style.translate = '0 ' + extra + 'px';
        }
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    const mo = new MutationObserver(schedule);
    mo.observe(root, { childList: true, subtree: true });
    return () => { mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [extra, scale]);

  return (
    <div className="stage-wrap">
      <div ref={stageRef} className="stage" style={{ width: W, height: stageH, transform: `scale(${scale})`, marginLeft: -(W / 2), marginTop: -(stageH / 2) }}>
        <Main />
      </div>
      {size.w > 900 && new URLSearchParams(window.location.search).has('qr') && <QrPanel />}
    </div>
  );
}
