// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Intro.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = { page: 0, mv: '' };
  }
  sync() {
    const v = this.props.variant || '1';
    if (v !== this._v) { this._v = v; this.state = { page: Math.max(0, Math.min(2, (parseInt(v, 10) || 1) - 1)), mv: '' }; }
  }
  go(n) { this._k = (this._k || 0) + 1; this.setState({ page: n, mv: (n > this.state.page ? 'mv-r' : 'mv-l') + (this._k % 2) }); }
  renderVals() {
    this.sync();
    const p = this.props, i = this.state.page;
    const PAGES = [
      { t: '문제는 갑자기 찾아와요', a: '물이 새고 냄새가 나는 당황스러운 순간은', b: '예고 없이 와요.', img: '/img/face-confused.svg' },
      { t: '미리 겪어 보세요', a: '내 방에서 선택지 게임으로 생활 문제를', b: '먼저 경험해 봐요.', img: '/img/face-surprised.svg' },
      { t: '침착하게 대응해요', a: '쌓인 경험이 페그보드에 도구처럼 모여', b: '실제 상황에서 든든해져요.', img: '/img/face-wink.svg' }
    ];
    const pg = PAGES[i];
    return {
      title: pg.t, body1: pg.a, body2: pg.b, img: pg.img,
      cta: i === 2 ? '내 방 만들기' : '다음',
      dots: [0, 1, 2].map((n) => ({ cls: 'dot' + (n === i ? ' on' : '') })),
      skip: () => { if (p.onGo) p.onGo('setup'); },
      next: () => { if (i < 2) this.go(i + 1); else if (p.onGo) p.onGo('setup'); },
      colCls: 'col ' + this.state.mv, imgCls: this.state.mv,
      swDown: (e) => { this._sx = e.clientX; this._sy = e.clientY; },
      swUp: (e) => {
        if (this._sx == null) return;
        const dx = e.clientX - this._sx, dy = e.clientY - this._sy; this._sx = null;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        // swipe left = next, swipe right = previous; never leaves the last page (only the button does)
        if (dx < 0 && i < 2) this.go(i + 1); else if (dx > 0 && i > 0) this.go(i - 1);
      }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc" style={{touchAction: "pan-y"}} onPointerDown={v.swDown} onPointerUp={v.swUp}>
      <div style={{position: "absolute", left: "20px", top: "76px", width: "353px", display: "flex", flexDirection: "column", gap: "52px"}}>
        <button type="button" className="tl" style={{alignSelf: "flex-end", fontSize: "16px", lineHeight: "24px", color: "var(--gray-600)"}} onClick={v.skip}>
          건너뛰기
        </button>
        <div className={v.colCls} style={{gap: "16px", textAlign: "center"}}>
          <div style={{fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "24px", lineHeight: "32px", color: "var(--gray-900)"}}>
            {v.title}
          </div>
          <div className="sub" style={{color: "var(--gray-600)"}}>
            {v.body1}
            <br />
            {v.body2}
          </div>
        </div>
      </div>
      <img className={v.imgCls} src={v.img} alt="" style={{position: "absolute", left: "56px", top: "284px", width: "280px", height: "309px", imageRendering: "pixelated"}} />
      <div style={{position: "absolute", left: "20px", top: "626px", width: "353px", display: "flex", flexDirection: "column", alignItems: "center", gap: "92px"}}>
        <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
          {(v.dots || []).map((d, __i) => (
            <Fragment key={__i}>
              <span className={d.cls} />
            </Fragment>
          ))}
        </div>
        <div style={{width: "353px"}}>
          <WitooDS.Button variant="primary" onClick={v.next}>
            {v.cta}
          </WitooDS.Button>
        </div>
      </div>
    </div>
  </>
));
