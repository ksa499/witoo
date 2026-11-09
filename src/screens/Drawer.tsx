// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Drawer.css';

const BASE = [
  { id: 'b1', title: '욕실 곰팡이, 이렇게 해결했어요', likes: 24, cmts: 2, s: ['환기가 안 되어 줄눈에 곰팡이가 생김', '뿌리는 세정제 대신 젤 타입 제거제 사용', '흐르지 않아 깔끔하게 제거됨', '제거제를 바르고 30분 뒤 닦아낸다'] },
  { id: 'b2', title: '세탁기 냄새 잡는 법', likes: 24, cmts: 0, s: ['세탁 후에도 옷에서 쿰쿰한 냄새가 남', '세탁조 클리너로 통살균 코스 돌림', '냄새가 사라지고 세탁조가 깨끗해짐', '세탁 후 문을 열어 말려둔다'] },
  { id: 'b3', title: '배수구 막힘 뚫는 방법', likes: 24, cmts: 0, s: ['샤워할 때 물이 잘 안 내려감', '뚫어뻥 대신 베이킹소다와 식초 사용', '뜨거운 물로 헹구니 시원하게 내려감', '머리카락 거름망을 자주 비운다'] },
  { id: 'b4', title: '창문 틈새 바람 막기', likes: 24, cmts: 0, s: ['겨울마다 창문 틈으로 찬바람이 들어옴', '문풍지와 단열 테이프를 겹쳐 붙임', '체감 온도가 확 올라감', '붙이기 전에 먼지부터 닦는다'] },
  { id: 'b5', title: '배수구 막힘 뚫는 방법', likes: 24, cmts: 0, s: ['싱크대 물이 천천히 내려감', '트랩을 분리해 찌꺼기를 제거', '물이 막힘 없이 내려감', '음식물 찌꺼기는 바로 버린다'] },
  { id: 'b6', title: '창문 틈새 바람 막기', likes: 24, cmts: 0, s: ['현관 쪽에서 외풍이 느껴짐', '문 아래에 틈막이를 설치', '바람이 거의 들어오지 않음', '틈막이는 문 폭에 맞게 자른다'] }
];
const HG = '/img/dw-heart16.svg', HF = '/img/dw-heartfull16.svg', CG = '/img/dw-chat16.svg', CO = '/img/dw-chat16-on.svg';
const H = ['상황', '선택', '결과', '한 줄 팁'];
const EMPTY = { title: '', sit: '', cho: '', res: '', tip: '', memo: '', photos: 0 };
const FIELDS = [
  ['title', '제목*', '제목을 입력하세요'], ['sit', '상황*', '어떤 문제가 생겼나요?'], ['cho', '선택*', '그 상황에서 어떤 선택을 했나요?'],
  ['res', '결과*', '결과는 어땠나요?'], ['tip', '한 줄 팁*', '한 줄로 팁을 남겨 주세요'], ['memo', '메모', '자유롭게 메모를 남겨 보세요']
];
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = this.initial('');
  }
  initial(v) {
    const filled = { title: '욕실 곰팡이, 이렇게 해결했어요', sit: '환기가 안 되어 줄눈에 곰팡이가 생김', cho: '뿌리는 세정제 대신 젤 타입 제거제 사용', res: '흐르지 않아 깔끔하게 제거됨', tip: '제거제를 바르고 30분 뒤 닦아낸다', memo: '', photos: 1 };
    return {
      ov: {},
      write: v === 'write' || v === 'write-filled', draft: v === 'write-filled' ? filled : { ...EMPTY }, editId: null,
      open: (v === 'post' || v === 'mine' || v === 'menu' || v === 'delete' || v === 'archived') ? 'b1' : null,
      mineV: v === 'mine' || v === 'menu' || v === 'delete', menu: v === 'menu', confirm: v === 'delete',
      arcV: v === 'archived', cmText: ''
    };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = this.initial(v); }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, d = p.data || {};
    const get = (k, def) => (s.ov[k] !== undefined ? s.ov[k] : (d[k] !== undefined ? d[k] : def));
    const set = (k, val) => { this.setState({ ov: { ...s.ov, [k]: val } }); if (p.onPatch) p.onPatch({ [k]: val }); };
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    const me = d.nick || '위투';
    const removed = get('removed', []), archived = get('archived', (s.arcV ? ['b1'] : [])), liked = get('liked', (s.arcV ? ['b1'] : [])), cmx = get('cm', {});
    const mine = get('posts', []);
    const all = mine.map((m) => ({ id: m.id, title: m.title, author: me, likes: 0, cmts: (cmx[m.id] || []).length, own: true, s: [m.sit, m.cho, m.res, m.tip], photos: m.photos, raw: m })).concat(BASE.map((b) => ({ ...b, author: '깔끔이', own: s.mineV && b.id === 'b1' }))).filter((x) => removed.indexOf(x.id) < 0);
    const cards = all.map((x) => ({
      title: x.title, author: x.author, likes: x.likes + (liked.indexOf(x.id) >= 0 ? 1 : 0), cmts: x.cmts + (cmx[x.id] || []).length,
      heartSrc: liked.indexOf(x.id) >= 0 ? HF : HG, cmSrc: (cmx[x.id] || []).length ? CO : CG, hs: liked.indexOf(x.id) >= 0 ? 'color:#ff771a' : '', cs: (cmx[x.id] || []).length ? 'color:#ff771a' : '',
      open: () => this.setState({ open: x.id, cmText: '' })
    }));
    const cur = s.open ? all.find((x) => x.id === s.open) : null;
    const hasPost = !!cur;
    let postVals = { author: '', date: '', title: '', secs: [], own: false, other: false };
    let comments = [], cmN = 0, likeOn = false, likeN = 0;
    if (cur) {
      const base = cur.id === 'b1' ? [{ name: '빨래왕', date: '10월 16일', text: '환기부터 하는 게 중요하군요. 도움됐어요!', own: false }, { name: '마루', date: '10월 17일', text: '저도 따라 해 봤는데 깨끗해졌어요!', own: true }] : [];
      const extra = (cmx[cur.id] || []);
      likeOn = liked.indexOf(cur.id) >= 0;
      likeN = cur.likes + (likeOn ? 1 : 0);
      comments = base.map((c) => ({ ...c, edit: () => {}, del: () => {} })).concat(extra.map((c, i) => ({
        ...c, edit: () => this.setState({ cmText: c.text }) , del: () => set('cm', { ...cmx, [cur.id]: extra.filter((_, j) => j !== i) })
      })));
      cmN = cur.cmts + extra.length;
      postVals = { author: cur.author, date: '10월 15일', title: cur.title, own: cur.own, other: !cur.own, secs: cur.s.map((t, i) => ({ h: H[i], t })) };
    }
    const closePost = () => this.setState({ open: null, menu: false, confirm: false });
    const arc = cur && archived.indexOf(cur.id) >= 0;
    // write
    const dr = s.draft;
    const ok = !!(dr.title && dr.sit && dr.cho && dr.res && dr.tip);
    const fields = FIELDS.map(([k, label, ph]) => ({ label, ph, val: dr[k], cls: 'dw-in' + (dr[k] ? ' on' : ''),
      on: (e) => this.setState({ draft: { ...dr, [k]: e.target.value } }) }));
    const photos = []; for (let i = 0; i < dr.photos; i++) photos.push({ rm: () => this.setState({ draft: { ...dr, photos: dr.photos - 1 } }) });
    return {
      cards, topAction: (a) => { if (a === 'bell') go('alerts'); },
      tab: (k) => { const m = { home: 'home', pegboard: 'peg', drawer: 'drawer', mypage: 'my' }; if (k !== 'drawer' && m[k]) go(m[k]); },
      newCard: () => this.setState({ write: true, draft: { ...EMPTY }, editId: null }),
      isWrite: s.write, fields, photos, photoCount: dr.photos,
      addPhoto: () => { if (dr.photos < 10) this.setState({ draft: { ...dr, photos: dr.photos + 1 } }); },
      closeWrite: () => this.setState({ write: false }),
      submitVariant: ok ? 'primary' : 'inactive',
      submit: () => {
        if (!ok) return;
        if (s.editId) {
          set('posts', mine.map((m) => (m.id === s.editId ? { ...m, ...dr } : m)));
        } else {
          set('posts', [{ id: 'u' + Date.now(), ...dr }].concat(mine));
        }
        this.setState({ write: false, editId: null });
      },
      hasPost, p: postVals, closePost,
      arcCls: 'dw-arc' + (arc ? ' on' : ''), arcLabel: arc ? '아카이빙 됨' : '아카이빙 하기',
      toggleArc: () => {
        if (!cur) return;
        const on = archived.indexOf(cur.id) >= 0;
        const pc = (get('pegCards', [])).filter((c) => c.pid !== cur.id);
        const na = on ? archived.filter((x) => x !== cur.id) : archived.concat(cur.id);
        if (!on) pc.push({ pid: cur.id, title: (cur.title.split(',')[0]).slice(0, 9), icon: '/img/peg-hammer.svg', kind: 'comm' });
        this.setState({ ov: { ...s.ov, archived: na, pegCards: pc } });
        if (p.onPatch) p.onPatch({ archived: na, pegCards: pc });
      },
      openMenu: () => this.setState({ menu: true }), closeMenu: () => this.setState({ menu: false, confirm: false }),
      menu: s.menu, confirm: s.confirm,
      askDelete: () => this.setState({ menu: false, confirm: true }),
      doDelete: () => { if (cur) set('removed', removed.concat(cur.id)); this.setState({ open: null, menu: false, confirm: false }); },
      editPost: () => { if (cur && cur.raw) this.setState({ write: true, draft: { ...EMPTY, ...cur.raw }, editId: cur.id, open: null, menu: false }); else this.setState({ menu: false, write: true, draft: { title: cur.title, sit: cur.s[0], cho: cur.s[1], res: cur.s[2], tip: cur.s[3], memo: '', photos: 1 }, open: null }); },
      likeSrc: likeOn ? HF : HG, likeN, cmN, comments,
      toggleLike: () => { if (cur) set('liked', likeOn ? liked.filter((x) => x !== cur.id) : liked.concat(cur.id)); },
      focusCm: () => { const el = document.getElementById('dw-cm'); if (el) el.focus(); },
      cmText: s.cmText, cmCls: s.cmText ? 'on' : '', cmBtn: s.cmText ? 'on' : '',
      setCm: (e) => this.setState({ cmText: e.target.value }),
      addCm: () => { if (!s.cmText || !cur) return; set('cm', { ...cmx, [cur.id]: (cmx[cur.id] || []).concat({ name: me, date: '10월 18일', text: s.cmText, own: true }) }); this.setState({ cmText: '' }); }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      <div style={{position: "absolute", left: "0", top: "60px", width: "393px"}}>
        <WitooDS.TopBar title="서랍" onAction={v.topAction} />
      </div>
      <div className="dw-gl">
        {(v.cards || []).map((c, __i) => (
          <Fragment key={__i}>
            <button type="button" className="dw-cd" onClick={c.open} aria-label={c.title}>
              <div className="im">
                <img src="/img/post-image.jpg" alt="" />
              </div>
              <b className="tt">
                {c.title}
              </b>
              <div className="mt">
                <span>
                  {c.author}
                </span>
                <div className="rt">
                  <i>
                    <img className="ic" src={c.heartSrc} alt="" />
                    <span style={css(c.hs)}>
                      {c.likes}
                    </span>
                  </i>
                  <i>
                    <img className="ic" src={c.cmSrc} alt="" />
                    <span style={css(c.cs)}>
                      {c.cmts}
                    </span>
                  </i>
                </div>
              </div>
            </button>
          </Fragment>
        ))}
      </div>
      <button type="button" className="dw-fab" onClick={v.newCard}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 4v12M4 10h12" stroke="#ff9348" strokeWidth="2.500" />
        </svg>
        <span>
          카드 작성
        </span>
      </button>
      <div style={{position: "absolute", left: "0", top: "745px", width: "393px", zIndex: "4"}}>
        <WitooDS.TabBar active="drawer" onChange={v.tab} />
      </div>
      {!!v.isWrite && (
        <>
        <div className="dw-wr">
          <div className="dw-wh">
            <button type="button" className="dw-x" style={{left: "20px", top: "12px"}} aria-label="닫기" onClick={v.closeWrite}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path d="M12 12l16 16M28 12L12 28" stroke="#252422" strokeWidth="3" />
              </svg>
            </button>
            <h1>
              카드 작성
            </h1>
          </div>
          <div className="dw-ws">
            {(v.fields || []).map((f, __i) => (
              <Fragment key={__i}>
                <div className="dw-fl">
                  <label>
                    {f.label}
                  </label>
                  <input className={f.cls} type="text" placeholder={f.ph} value={f.val} onChange={f.on} />
                </div>
              </Fragment>
            ))}
            <div className="dw-fl">
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                <label style={{margin: "0"}}>
                  사진
                </label>
                <span style={{fontSize: "12px", fontWeight: "600", color: "#b7b6aa"}}>
                  {v.photoCount}{" / 10"}
                </span>
              </div>
              <div className="dw-ph">
                <button type="button" className="dw-add" onClick={v.addPhoto}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <rect x="2.500" y="3.500" width="15" height="13" rx="1" fill="none" stroke="#b7b6aa" strokeWidth="1.500" />
                    <path d="M4 14l4-4 3 3 2-2 3 3" fill="none" stroke="#b7b6aa" strokeWidth="1.500" />
                  </svg>
                  사진 추가
                </button>
                {(v.photos || []).map((p, __i) => (
                  <Fragment key={__i}>
                    <div className="dw-pi">
                      <img src="/img/post-image.jpg" alt="" />
                      <button type="button" aria-label="사진 삭제" onClick={p.rm}>
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <path d="M1 1l6 6M7 1L1 7" stroke="#fff" strokeWidth="1.500" />
                        </svg>
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{position: "absolute", left: "21px", top: "759px", width: "352px"}}>
            <WitooDS.Button variant={v.submitVariant} onClick={v.submit}>
              등록하기
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
      {!!v.hasPost && (
        <>
        <div className="dw-ov" onClick={v.closePost} />
        <svg className="dw-pin" viewBox="0 0 12 27" aria-hidden="true">
          <path fill="#111111" d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6ZM4 11h4v16H4V11Z" />
        </svg>
        <div className="dw-pm" role="dialog" aria-label="게시글">
          <div className="sc2">
            <div style={{height: "39px", position: "relative"}}>
              <button type="button" className="dw-x" style={{right: "-12px", top: "-3px"}} aria-label="닫기" onClick={v.closePost}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <path d="M12 12l16 16M28 12L12 28" stroke="#252422" strokeWidth="3" />
                </svg>
              </button>
            </div>
            <div style={{height: "16px"}} />
            <div className="dw-who">
              <span className="dw-av">
                <img src="/img/avatar.svg" alt="" />
              </span>
              <div>
                <div className="dw-nm">
                  {v.p.author}
                </div>
                <div className="dw-dt">
                  {v.p.date}
                </div>
              </div>
              {!!v.p.own && (
                <>
                <button type="button" className="dw-kb" aria-label="메뉴" onClick={v.openMenu}>
                  <i style={{top: "14px"}} />
                  <i style={{top: "20px"}} />
                  <i style={{top: "28px"}} />
                </button>
                </>
              )}
              {!!v.p.other && (
                <>
                <button type="button" className={v.arcCls} onClick={v.toggleArc}>
                  {v.arcLabel}
                </button>
                </>
              )}
            </div>
            <div className="dw-pt">
              {v.p.title}
            </div>
            <div className="dw-pic">
              <img src="/img/post-image.jpg" alt="" />
              <div className="dd">
                <i className="on" />
                <i />
                <i />
              </div>
              <div className="dw-pn">
                1 / 3
              </div>
            </div>
            {(v.p.secs || []).map((s, __i) => (
              <Fragment key={__i}>
                <div className="dw-sec">
                  <h4>
                    {s.h}
                  </h4>
                  <div>
                    {s.t}
                  </div>
                </div>
              </Fragment>
            ))}
            <div className="dw-lk">
              <button type="button" onClick={v.toggleLike}>
                <img className="ic16" src={v.likeSrc} alt="" />
                <span>
                  {"좋아요 "}{v.likeN}
                </span>
              </button>
              <button type="button" onClick={v.focusCm}>
                <img className="ic16" src="/img/dw-chat16.svg" alt="" />
                <span>
                  {"댓글 "}{v.cmN}
                </span>
              </button>
            </div>
            <div className="dw-cm">
              <h5>
                {"댓글 "}{v.cmN}
              </h5>
              {(v.comments || []).map((c, __i) => (
                <Fragment key={__i}>
                  <div className="dw-ct">
                    <span className="dw-av s">
                      <img src="/img/avatar.svg" alt="" />
                    </span>
                    <div className="bd">
                      <div className="hd2">
                        <span>
                          <b>
                            {c.name}
                          </b>
                          <em>
                            {c.date}
                          </em>
                        </span>
                        {!!c.own && (
                          <>
                          <span>
                            <button type="button" onClick={c.edit}>
                              수정
                            </button>
                            <button type="button" onClick={c.del}>
                              삭제
                            </button>
                          </span>
                          </>
                        )}
                      </div>
                      <p>
                        {c.text}
                      </p>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="dw-ib">
            <input id="dw-cm" className={v.cmCls} type="text" placeholder="댓글을 입력해 주세요" value={v.cmText} onChange={v.setCm} />
            <button type="button" className={v.cmBtn} onClick={v.addCm}>
              등록
            </button>
          </div>
        </div>
        </>
      )}
      {!!v.menu && (
        <>
        <div className="dw-ov" style={{zIndex: "39"}} onClick={v.closeMenu} />
        <div className="dw-sh" role="dialog" aria-label="내 게시글 메뉴">
          <div className="hn" />
          <button type="button" onClick={v.editPost}>
            수정하기
          </button>
          <button type="button" onClick={v.askDelete}>
            삭제하기
          </button>
          <button type="button" className="cl" onClick={v.closeMenu}>
            닫기
          </button>
        </div>
        </>
      )}
      {!!v.confirm && (
        <>
        <div className="dw-ov" style={{zIndex: "39"}} onClick={v.closeMenu} />
        <div className="dw-cf" role="dialog" aria-label="이 카드를 삭제할까요?">
          <h2>
            이 카드를 삭제할까요?
          </h2>
          <p>
            삭제한 카드는 되돌릴 수 없어요. 이 카드를
            <br />
            {"아카이빙한 사람의 페그보드에는 '삭제된 카"}
            <br />
            {"드'로 표시돼요."}
          </p>
          <div className="bt">
            <button type="button" style={{background: "#f1f0ee", color: "#252422"}} onClick={v.closeMenu}>
              취소
            </button>
            <button type="button" style={{background: "#ff771a", color: "#fff"}} onClick={v.doDelete}>
              삭제
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
