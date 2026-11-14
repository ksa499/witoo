import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Main from './screens/Main';
import QrPanel from './QrPanel';

const W = 393, H = 852;
/** The design reserves this much at the top for a mock status bar; real phones have their own. */
const SB = typeof location !== 'undefined' && /[?&]sb=0/.test(location.search) ? 0 : 54; // ?sb=0 keeps the status-bar area (for mockup videos)

const viewport = () => ({ w: window.innerWidth, h: window.innerHeight });
const editing = () => {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable);
};

/**
 * Fits the 393×852 design to any screen.
 * Phones fill the whole screen: the limiting side is scaled to fit, and the
 * extra room on the other side is given to the stage. Bottom-docked UI moves
 * down, side content is centered, and full-size overlays stretch.
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
  const top = desktop ? 0 : SB; // phones: hide the mock status bar area
  const sw = size.w / W, sh = size.h / (H - top);
  const scale = desktop ? Math.min(1, sw, size.h / H) : Math.max(Math.min(sw, sh), 0.4);
  const stageW = desktop ? W : Math.max(W, Math.round(size.w / scale));
  const stageH = desktop ? H : Math.max(H, Math.round(size.h / scale) + top);
  const extra = stageH - H, extraW = stageW - W;

  // tiny haptic tick on press + fade-in for dim layers that are added on the fly
  useEffect(() => {
    const tick = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.('.wt-btn, .wt-choice')) navigator.vibrate?.(6);
    };
    document.addEventListener('pointerdown', tick, { passive: true });
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        [n, ...Array.from(n.querySelectorAll<HTMLElement>('*')).slice(0, 80)].forEach((el) => {
          const st = el.getAttribute('style') || '';
          if (/position:\s*absolute/.test(st) && /inset:\s*0/.test(st) && /rgba\(0,\s*0,\s*0/.test(st)) el.classList.add('fx-fade');
        });
      }));
    });
    if (stageRef.current) mo.observe(stageRef.current, { childList: true, subtree: true });
    return () => { document.removeEventListener('pointerdown', tick); mo.disconnect(); };
  }, []);

  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    root.style.setProperty('--stage-h', stageH + 'px');
    root.style.setProperty('--stage-w', stageW + 'px');
    let raf = 0;
    // layout position (ignores transforms and animations, so nothing flickers while measuring)
    const pos = (el: HTMLElement) => {
      let l = 0, t = 0;
      for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) { l += e.offsetLeft; t += e.offsetTop; }
      return { l, t };
    };
    const inherit = (el: HTMLElement) => {
      let moved = false;
      for (let a = el.parentElement; a && a !== root; a = a.parentElement) {
        if (a.dataset.fxm) moved = true;
        const oy = getComputedStyle(a).overflowY;
        if (oy === 'auto' || oy === 'scroll') moved = true; // content inside scroll areas stays put
      }
      return moved;
    };
    const process = (full: boolean) => {
      raf = 0;
      const all = Array.from(root.querySelectorAll<HTMLElement>('*'));
      if (full) all.forEach((el) => {
        if (el.dataset.fxd === undefined) return;
        el.style.translate = ''; el.style.width = el.dataset.fw || ''; el.style.height = el.dataset.fh || '';
        delete el.dataset.fxd; delete el.dataset.fxm;
      });
      if (!extra && !extraW) { all.forEach((el) => { el.dataset.fxd = '1'; }); return; }
      all.forEach((el) => { // only elements not handled yet (new ones), parents first
        if (el.dataset.fxd !== undefined) return;
        el.dataset.fxd = '1';
        if (el.closest('.room')) return; // room contents (character, hotspots) move with the room
        const abs = getComputedStyle(el).position === 'absolute';
        const w = el.offsetWidth, h = el.offsetHeight;
        const { l, t } = pos(el);
        const fullW = l <= 1 && w >= W - 2 && w <= W + 2;
        if (!abs && !(extraW && fullW)) return;
        if (inherit(el)) return;
        let dx = 0, dy = 0, gw = false, gh = false;
        if (extra && abs) {
          if (t <= 1 && t + h >= H - 3 && w >= W - 2) gh = true;
          else if (t >= 480 && t + h >= 600 && t + h <= H + 2) dy = extra;
        }
        if (extraW) {
          if (fullW) gw = true; else if (abs) dx = extraW / 2;
        }
        if (!dx && !dy && !gw && !gh) return;
        el.dataset.fw = el.style.width; el.dataset.fh = el.style.height;
        if (dx || dy) { el.style.translate = dx + 'px ' + dy + 'px'; el.dataset.fxm = '1'; }
        if (gw) el.style.width = (w + extraW) + 'px';
        if (gh) el.style.height = (h + extra) + 'px';
      });
    };
    process(true);
    const schedule = () => { if (!raf) raf = requestAnimationFrame(() => process(false)); };
    const mo = new MutationObserver((muts) => {
      if (muts.some((m) => m.type === 'childList' && m.addedNodes.length)) schedule();
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => { mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [stageH, stageW, scale]);

  return (
    <div className="stage-wrap">
      <div ref={stageRef} className="stage" style={{ width: stageW, height: stageH, transform: `scale(${scale})`, marginLeft: -(stageW / 2), marginTop: -(stageH / 2) - (top * scale) / 2 }}>
        <Main />
      </div>
      {size.w > 900 && new URLSearchParams(window.location.search).has('qr') && <QrPanel />}
    </div>
  );
}
