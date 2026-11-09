// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Peg.css';

const HAM = '/img/peg-hammer.svg';
const WRE = '/img/peg-wrench.svg';
const XS = [0, 57, 114, 170, 227, 284, 341];
const CX = [12, 126, 240];
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = { view: null, img: 0, removed: [] };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = { view: v === 'deleted' ? 'deleted' : null, img: 0, removed: [] }; }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, d = p.data, v = p.variant || '';
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    let cards = [], open = 0;
    const tips = (d && d.tips) || [];
    if (v === 'card' || v === 'deleted') {
      cards = [
        { title: '욕실 곰팡이 해결', icon: HAM, kind: 'comm' },
        { title: '세탁기 곰팡이', icon: WRE, kind: 'own', tip: '천으로 고무 패킹과 세제 투입구를 닦는다.' }
      ];
      open = 2;
    } else if (v === 'none') {
      open = 0;
    } else if (d) {
      open = Math.min(12, d.holes || 0);
      cards = tips.slice(0, open).map((t) => ({ title: '세탁기 곰팡이', icon: WRE, kind: 'own', tip: t }));
      if (d.pegCards) cards = cards.concat(d.pegCards);
      open = Math.max(open, cards.length);
    } else { open = 2; }
    cards = cards.map((c, i) => ({ ...c, i })).filter((c) => s.removed.indexOf(c.i) < 0);
    // slot positions: rows 0,2,4,6; cols 1,3,5
    const slot = (i) => ({ row: Math.floor(i / 3) * 2, col: (i % 3) * 2 + 1 });
    const dots = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 7; c++) {
      const isSlot = r % 2 === 0 && c % 2 === 1;
      const idx = isSlot ? (r / 2) * 3 + (c - 1) / 2 : -1;
      let cls = 'pg-dot' + (isSlot ? ' slot' : '') + (isSlot && idx < open ? (idx < cards.length ? ' got' : ' open') : '');
      dots.push({ cls, style: 'left:' + XS[c] + 'px;top:' + (r * 64) + 'px' });
    }
    const deletedIdx = v === 'deleted' ? 1 : -1;
    const cardVals = cards.map((c, k) => {
      const sl = slot(k);
      const lift = s.view === 'deleted' && c.i === deletedIdx;
      return { title: c.title, icon: c.icon, cls: 'pg-card' + (lift ? ' lift' : ''),
        style: 'left:' + CX[(k % 3)] + 'px;top:' + (sl.row * 64 + 12) + 'px' + (lift ? ';z-index:6' : ''),
        open: () => this.setState({ view: c.kind === 'comm' ? 'comm' : (c.i === deletedIdx ? 'deleted' : 'own'), cur: c.i, tip: c.tip, img: 0 }) };
    });
    const sel = s.view;
    return {
      count: open, dots, cards: cardVals,
      isEmpty: open === 0,
      showDeleted: sel === 'deleted', showComm: sel === 'comm', showOwn: sel === 'own',
      ownTip: s.tip || '천으로 고무 패킹과 세제 투입구를 닦는다.',
      imgN: s.img + 1,
      imgDots: [0, 1, 2].map((n) => ({ cls: n === s.img ? 'on' : '', pick: () => this.setState({ img: n }) })),
      closeAll: () => this.setState({ view: null }),
      removeCard: () => this.setState({ view: null, removed: s.removed.concat(s.cur != null ? s.cur : deletedIdx) }),
      toHome: () => go('home'),
      topAction: (a) => { if (a === 'bell') go('alerts'); },
      tab: (k) => { const m = { home: 'home', pegboard: 'peg', drawer: 'drawer', mypage: 'my' }; if (k !== 'pegboard' && m[k]) go(m[k]); }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      <div style={{position: "absolute", left: "0", top: "60px", width: "393px"}}>
        <WitooDS.TopBar title="페그보드" onAction={v.topAction} />
      </div>
      <div className="pg-hd">
        <span>
          열린 구멍
        </span>
        <span>
          <b>
            {v.count}
          </b>
          개
        </span>
      </div>
      <div className="pg-board">
        {(v.dots || []).map((d, __i) => (
          <Fragment key={__i}>
            <div className={d.cls} style={css(d.style)} />
          </Fragment>
        ))}
        {(v.cards || []).map((c, __i) => (
          <Fragment key={__i}>
            <button type="button" className={c.cls} style={css(c.style)} aria-label={c.title} onClick={c.open}>
              <div className="in">
                <img src={c.icon} alt="" />
                <span>
                  {c.title}
                </span>
              </div>
            </button>
          </Fragment>
        ))}
      </div>
      {!!v.isEmpty && (
        <>
        <div className="pg-empty">
          <img src="/img/peg-empty.svg" alt="" />
          <h2>
            아직 열린 구멍이 없어요
          </h2>
          <p>
            시뮬레이션을 끝까지 마치면
            <br />
            구멍이 열리고 카드를 수집할 수 있어요.
          </p>
          <div className="bt">
            <WitooDS.Button variant="primary" onClick={v.toHome}>
              내 방으로 가기
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
      <div style={{position: "absolute", left: "0", top: "745px", width: "393px", zIndex: "4"}}>
        <WitooDS.TabBar active="pegboard" onChange={v.tab} />
      </div>
      {!!v.showDeleted && (
        <>
        <div className="pg-ov" onClick={v.closeAll} />
        <div className="pg-sheet" role="dialog" aria-label="삭제된 카드예요">
          <div className="hn" />
          <h2>
            삭제된 카드예요
          </h2>
          <p>
            작성자가 원본 카드를 삭제했어요.
          </p>
          <div className="bt">
            <WitooDS.Button variant="primary" overlay="true" onClick={v.removeCard}>
              목록에서 빼기
            </WitooDS.Button>
          </div>
          <button type="button" className="pg-gray" onClick={v.closeAll}>
            닫기
          </button>
        </div>
        </>
      )}
      {!!v.showComm && (
        <>
        <div className="pg-ov" onClick={v.closeAll} />
        <div className="pg-md" style={{top: "111px"}} role="dialog" aria-label="커뮤니티 카드">
          <svg className="pgpin" width="12" height="27" viewBox="0 0 12 27" aria-hidden="true">
            <path fill="#111111" d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6ZM4 11h4v16H4V11Z" />
          </svg>
          <button type="button" className="x" aria-label="닫기" onClick={v.closeAll}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" stroke="#252422" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </button>
          <div className="pg-who">
            <span className="pg-av">
              <img src="/img/avatar.svg" alt="" />
            </span>
            <div>
              <b>
                깔끔이
              </b>
              <span>
                10월 15일
              </span>
            </div>
          </div>
          <h3>
            욕실 곰팡이, 이렇게 해결했어요
          </h3>
          <div className="pg-img" style={{height: "192px"}}>
            <img src="/img/clean-result.png" alt="" style={{left: "-72px", top: "-123px", width: "400px", height: "359px"}} />
            <span className="pg-pn">
              {v.imgN}{" / 3"}
            </span>
          </div>
          <div className="pg-dots">
            {(v.imgDots || []).map((g, __i) => (
              <Fragment key={__i}>
                <i className={g.cls} onClick={g.pick} />
              </Fragment>
            ))}
          </div>
          <div className="pg-sec">
            <h4>
              상황
            </h4>
            <div>
              환기가 안 되어 줄눈에 곰팡이가 생김
            </div>
          </div>
          <div className="pg-sec">
            <h4>
              선택
            </h4>
            <div>
              뿌리는 세정제 대신 젤 타입 제거제 사용
            </div>
          </div>
          <div className="pg-sec">
            <h4>
              결과
            </h4>
            <div>
              흐르지 않아 깔끔하게 제거됨
            </div>
          </div>
        </div>
        </>
      )}
      {!!v.showOwn && (
        <>
        <div className="pg-ov" onClick={v.closeAll} />
        <div className="pg-md" style={{top: "246px"}} role="dialog" aria-label="내 카드">
          <svg className="pgpin" width="12" height="27" viewBox="0 0 12 27" aria-hidden="true">
            <path fill="#111111" d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6ZM4 11h4v16H4V11Z" />
          </svg>
          <button type="button" className="x" aria-label="닫기" onClick={v.closeAll}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" stroke="#252422" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </button>
          <span className="pg-pill">
            돌발 상황
          </span>
          <h3>
            세탁기에서 곰팡이 냄새가 나요
          </h3>
          <div className="pg-img" style={{height: "160px"}}>
            <img src="/img/clean-result.png" alt="" style={{left: "-72px", top: "-139px", width: "400px", height: "359px"}} />
          </div>
          <div className="pg-sec" style={{marginBottom: "0"}}>
            <h4>
              Tip!
            </h4>
            <div>
              {v.ownTip}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
