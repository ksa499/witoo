// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Alerts.css';

const CM = '/img/my-1f4ac-20.svg', CMG = '/img/my-1f4ac-20-g.svg';
const CL = '/img/my-1f4cb-20.svg', CLG = '/img/my-1f4cb-20-g.svg';
const FI = '/img/my-1f525-20.svg', BO = '/img/my-26a1.svg';
const ITEMS = [
  { id: 1, title: '내 게시글에 새 댓글이 달렸어요', desc: '집수리초보님: 저도 같은 문제였는데 도움됐어요!', time: '방금 전', ic: CM, icg: CMG, to: 'drawer', un: true },
  { id: 2, title: '정기점검이 내일이에요', desc: '세탁기 통 청소 점검일이 하루 남았어요', time: '1시간 전', ic: CL, icg: CLG, to: 'home', un: true },
  { id: 3, title: '점검일이 지났어요', desc: '에어컨 필터 청소를 아직 완료하지 않았어요', time: '어제', ic: FI, icg: FI, to: 'home', un: true },
  { id: 4, title: '오늘의 인기 게시글', desc: '싱크대 물이 안 빠질 때 이렇게 해결했어요', time: '어제', ic: BO, icg: BO, to: 'drawer', un: false },
  { id: 5, title: '내 게시글에 새 댓글이 달렸어요', desc: '깔끔이님의 글에 댓글이 있어요', time: '2일 전', ic: CM, icg: CMG, to: 'drawer', un: false },
  { id: 6, title: '정기점검이 일주일 남았어요', desc: '냉장고 청소 점검일이 7일 남았어요', time: '3일 전', ic: CL, icg: CLG, to: 'home', un: false }
];
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = { read: [] };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = { read: [] }; }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, v = p.variant || '';
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    const list = v === 'empty' ? [] : ITEMS;
    const items = list.map((n) => {
      const un = n.un && s.read.indexOf(n.id) < 0;
      return { title: n.title, desc: n.desc, time: n.time, unread: un, cls: 'al-it' + (un ? ' un' : ''), icon: un ? n.ic : n.icg,
        open: () => { this.setState({ read: s.read.concat(n.id) }); go(n.to); } };
    });
    return {
      items, hasItems: items.length > 0, empty: items.length === 0,
      back: () => go('home'),
      tab: (k) => { const m = { home: 'home', pegboard: 'peg', drawer: 'drawer', mypage: 'my' }; if (m[k]) go(m[k]); }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      <div className="hd">
        <button className="bk" type="button" aria-label="뒤로" onClick={v.back}>
          <span className="ic-back" />
        </button>
        <h1>
          알림
        </h1>
      </div>
      {!!v.hasItems && (
        <>
        <div className="al-ls">
          {(v.items || []).map((n, __i) => (
            <Fragment key={__i}>
              <button type="button" className={n.cls} onClick={n.open}>
                <span className="al-ic">
                  <img src={n.icon} alt="" />
                </span>
                <span className="al-tx">
                  <b>
                    {n.title}
                  </b>
                  <i>
                    {n.desc}
                  </i>
                  <em>
                    {n.time}
                  </em>
                </span>
                {!!n.unread && (
                  <>
                  <span className="al-dot" />
                  </>
                )}
              </button>
            </Fragment>
          ))}
        </div>
        </>
      )}
      {!!v.empty && (
        <>
        <div className="al-em">
          <div>
            <img src="/img/my-1f514-56.svg" alt="" />
          </div>
          <p>
            아직 받은 알림이 없어요
          </p>
        </div>
        </>
      )}
      <div style={{position: "absolute", left: "0", top: "745px", width: "393px"}}>
        <WitooDS.TabBar active="home" onChange={v.tab} />
      </div>
    </div>
  </>
));
