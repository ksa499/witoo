// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Home.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.hold = 0; this.idleUntil = 0; this.legs = []; this.leg = null; this.busy = false;
    this.state = this.initial('');
  }
  initial(v) {
    const od = this.props.data || {};
    const own = (od.owned && od.owned.length) || od.ownedSet ? (od.owned || []) : ['washer', 'air-conditioner'];
    const AC = { id: 'air-conditioner', kind: 'check' };
    const d = this.props.data || {};
    const solved = d.solved || [];
    const saved = d.problems ? d.problems.filter((q) => solved.indexOf(q.id) < 0) : [{ id: 'washer-2', kind: 'incident' }];
    const st = { live: v === '', view: 'room', sheet: '', sel: 'washer-2', own: own.slice(), problems: v === '' ? saved : [{ id: 'washer-2', kind: 'incident' }, AC],
      acN: v === 'checked' ? 5 : v === '' ? Math.min(5, 2 + (d.checkN || 0)) : 2, reveal: v === '' && !!d.reveal, face: 'default', pos: v === '' ? [214, 462] : [213.5, 495], dur: 0, walk: false, shock: false };
    if (v === 'edit') st.view = 'edit';
    if (v === 'notice') st.sheet = 'notice';
    if (v === 'incident') st.sheet = 'incident';
    if (v === 'check' || v === 'checked') st.sheet = 'check';
    return st;
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.hold = 0; this.idleUntil = 0; this.busy = false; this.state = this.initial(v);
      const dd = this.props.data || {};
      if (this.state.live && dd.solved && dd.solved.length && this.props.onPatch) { const pr = this.state.problems; setTimeout(() => this.props.onPatch({ problems: pr, solved: [] }), 0); }
    }
  }
  componentDidMount() {
    this.t1 = setInterval(() => this.step(), 700);
    if (this.state.reveal) {
      if (this.props.onPatch) this.props.onPatch({ reveal: false });
      this.t5 = setTimeout(() => this.setState({ reveal: false }), 2000);
    }
    // 처음엔 세탁기만, 잠시 뒤 에어컨 정기점검, 그 뒤로 돌발 상황이 차차 추가
    const sched = (ms, first) => { this.t2 = setTimeout(() => { if (first) this.addCheck(); else this.addIncident(); sched(first ? 7000 : 11000 + Math.random() * 6000, false); }, ms); };
    sched(6000, true);
  }
  componentWillUnmount() {
    clearInterval(this.t1); clearTimeout(this.t2); clearTimeout(this.t4); clearTimeout(this.t5); this.clearLegs();
  }
  clearLegs() { (this.legs || []).forEach(clearTimeout); this.legs = []; }
  OVKEYS() { return ['washer-1', 'washer-2', 'vacuum', 'washbasin', 'toilet', 'tv', 'rice-cooker', 'microwave', 'fridge', 'stove', 'kitchen-sink']; }
  // Where the character's feet may stand (room px): the wood floor, minus furniture and walls.
  free(x, y) {
    if (x < 28 || x > 292 || y < 214 || y > 548) return false;
    const BLK = [[18, 190, 194, 360], [192, 186, 226, 282], [226, 204, 254, 272], [290, 205, 304, 250], [258, 300, 304, 362],
      [252, 355, 304, 560], [18, 355, 102, 490], [98, 358, 130, 400], [128, 336, 192, 414], [22, 496, 100, 560], [160, 490, 190, 560], [186, 502, 238, 552]];
    for (let i = 0; i < BLK.length; i++) { const r = BLK[i]; if (x > r[0] - 7 && x < r[2] + 7 && y > r[1] - 7 && y < r[3] + 7) return false; }
    return true;
  }
  los(a, b) {
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3);
    for (let i = 0; i <= n; i++) { const k = n ? i / n : 0; if (!this.free(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)) return false; }
    return true;
  }
  route(from, target) {
    const G = 8, X0 = 28, Y0 = 214;
    const ci = Math.round((from[0] - X0) / G), cj = Math.round((from[1] - Y0) / G);
    const pos = (i, j) => [X0 + i * G, Y0 + j * G];
    const seen = {}, prev = {}, order = [];
    const q = [[ci, cj]]; seen[ci + ',' + cj] = true;
    while (q.length) {
      const [i, j] = q.shift(); order.push([i, j]);
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        if (!di && !dj) continue;
        const ni = i + di, nj = j + dj, k = ni + ',' + nj, p = pos(ni, nj);
        if (seen[k] || !this.free(p[0], p[1])) continue;
        if (di && dj && !(this.free(pos(i + di, j)[0], pos(i + di, j)[1]) && this.free(pos(i, j + dj)[0], pos(i, j + dj)[1]))) continue;
        seen[k] = true; prev[k] = i + ',' + j; q.push([ni, nj]);
      }
    }
    let ti, tj;
    if (target) {
      let best = null, bd = 1e9;
      order.forEach(([i, j]) => { const d = Math.hypot(pos(i, j)[0] - target[0], pos(i, j)[1] - target[1]); if (d < bd) { bd = d; best = [i, j]; } });
      if (!best || Math.hypot(pos(best[0], best[1])[0] - from[0], pos(best[0], best[1])[1] - from[1]) < 6) return null;
      ti = best[0]; tj = best[1];
    } else {
      const far = order.filter(([i, j]) => Math.hypot(pos(i, j)[0] - from[0], pos(i, j)[1] - from[1]) > 50);
      if (!far.length) return null;
      [ti, tj] = far[Math.floor(Math.random() * far.length)];
    }
    const cells = []; let k = ti + ',' + tj;
    while (k) { const [i, j] = k.split(',').map(Number); cells.unshift(pos(i, j)); k = prev[k]; }
    const pts = [from].concat(cells);
    const out = [pts[0]]; let a = 0;
    while (a < pts.length - 1) {
      let b = pts.length - 1;
      while (b > a + 1 && !this.los(pts[a], pts[b])) b--;
      out.push(pts[b]); a = b;
    }
    return out;
  }
  current() {
    const l = this.leg, s = this.state;
    if (!l) return s.pos;
    const k = Math.min(1, (Date.now() - l.t0) / Math.max(1, l.dur * 1000));
    return [l.from[0] + (l.to[0] - l.from[0]) * k, l.from[1] + (l.to[1] - l.from[1]) * k];
  }
  addIncident() {
    const s = this.state;
    if (!s.live || s.view !== 'room') return;
    const open = this.OVKEYS().filter((id) => !s.problems.some((p) => p.id === id));
    if (!open.length || s.problems.filter((p) => p.kind === 'incident').length >= 3) return;
    const id = open[Math.floor(Math.random() * open.length)];
    const cur = this.current();
    this.clearLegs(); this.leg = null; this.busy = false;
    this.hold = Date.now() + 2800; this.idleUntil = this.hold;
    const np = s.problems.concat({ id, kind: 'incident' });
    if (this.props.onPatch) this.props.onPatch({ problems: np });
    this.setState({ problems: np, face: 'surprised', shock: true, walk: false, pos: cur, dur: 0.05 });
    clearTimeout(this.t4);
    this.t4 = setTimeout(() => this.setState({ shock: false, face: 'default' }), 1600);
  }
  addCheck() {
    const s = this.state;
    if (!s.live || s.view !== 'room' || s.acN >= 5 || s.problems.some((p) => p.id === 'air-conditioner')) return;
    const np = s.problems.concat({ id: 'air-conditioner', kind: 'check' });
    if (this.props.onPatch) this.props.onPatch({ problems: np });
    this.setState({ problems: np });
  }
  step() {
    const s = this.state, now = Date.now();
    if (!s.live || s.view !== 'room' || this.busy || now < this.hold || now < this.idleUntil) return;
    const pts = this.route(s.pos);
    if (!pts) { this.idleUntil = now + 2000; return; }
    this.run(pts, false);
  }
  run(pts, tapped) {
    const faces = ['default', 'happy', 'wink', 'love', 'sleepy', 'confused', 'happy', 'default'];
    const SPEED = tapped ? 46 : 34;
    this.busy = true;
    let delay = 0;
    for (let i = 1; i < pts.length; i++) {
      const from = pts[i - 1], to = pts[i], dur = Math.hypot(to[0] - from[0], to[1] - from[1]) / SPEED, last = i === pts.length - 1;
      const face = tapped ? (i === 1 ? 'happy' : null) : (i === 1 || Math.random() < 0.4 ? faces[Math.floor(Math.random() * faces.length)] : null);
      this.legs.push(setTimeout(() => {
        this.leg = { t0: Date.now(), from, to, dur };
        this.setState(Object.assign({ pos: to, dur, walk: true, shock: false }, face ? { face } : {}));
      }, delay * 1000));
      delay += dur;
      if (last) this.legs.push(setTimeout(() => {
        this.leg = null; this.busy = false; this.idleUntil = Date.now() + (tapped ? 3500 : 1500) + Math.random() * 2500;
        this.setState({ walk: false, face: tapped ? 'love' : faces[Math.floor(Math.random() * faces.length)] });
      }, delay * 1000));
    }
  }
  roomTap(e) {
    const s = this.state, now = Date.now();
    if (!s.live || s.view !== 'room' || s.sheet || now < this.hold) return;
    if (e.target && e.target.closest && e.target.closest('.hit')) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 319, y = (e.clientY - r.top) / r.height * 610;
    const cur = this.current();
    const pts = this.route(cur, [x, y]);
    this.tapK = (this.tapK || 0) + 1;
    if (!pts) { this.setState({ tapX: x, tapY: y, tapK: this.tapK }); return; }
    this.clearLegs(); this.leg = null; this.busy = false;
    this.setState({ pos: cur, dur: 0, tapX: x, tapY: y, tapK: this.tapK });
    this.run(pts, true);
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props;
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    const B = (id) => id;
    const AP = {
      'washer': ['세탁기', '/img/washer.svg'], 'fridge': ['냉장고', '/img/fridge.svg'], 'air-conditioner': ['에어컨', '/img/air-conditioner.svg'],
      'microwave': ['전자레인지', '/img/microwave.svg'], 'air-purifier': ['공기청정기', '/img/air-purifier.svg'], 'robot-vacuum': ['로봇청소기', '/img/robot-vacuum.svg'],
      'dryer': ['건조기', '/img/dryer.svg'], 'dishwasher': ['식기세척기', '/img/dishwasher.svg'], 'vacuum': ['청소기', '/img/vacuum.svg']
    };
    const OV = {
      'washer-1': ['세탁기', '/img/alert-washer-1.svg', 24, 28, 44, 68], 'washer-2': ['세탁기', '/img/alert-washer-2.svg', 74, 28, 44, 68],
      'vacuum': ['청소기', '/img/alert-vacuum.svg', 256, 22, 30, 95], 'washbasin': ['세면대', '/img/alert-washbasin.svg', 19, 233, 19, 69],
      'toilet': ['변기', '/img/alert-toilet.svg', 148, 231, 38, 49], 'tv': ['TV', '/img/alert-tv.svg', 291, 205, 11, 51],
      'air-conditioner': ['에어컨', '/img/alert-air-conditioner.svg', 22, 323, 88, 29], 'rice-cooker': ['밥솥', '/img/alert-rice-cooker.svg', 146, 332, 32, 39],
      'microwave': ['전자레인지', '/img/alert-microwave.svg', 141, 377, 42, 22], 'fridge': ['냉장고', '/img/alert-fridge.svg', 265, 306, 36, 50],
      'stove': ['가스레인지', '/img/alert-stove.svg', 256, 357, 45, 85], 'kitchen-sink': ['싱크대', '/img/alert-kitchen-sink.svg', 270, 470, 31, 71]
    };
    const FACE = { default: '/img/face-default.svg', happy: '/img/face-happy.svg', love: '/img/face-love.svg', sleepy: '/img/face-sleepy.svg',
      wink: '/img/face-wink.svg', confused: '/img/face-confused.svg', surprised: '/img/face-surprised.svg' };
    const setOwn = (own) => { this.setState({ own }); if (p.onPatch) p.onPatch({ owned: own, ownedSet: true }); };
    // 가전별 확대 장면 (세탁기는 원본 일러스트)
    const PIC = {'vacuum': '/img/vacuum.png', 'washbasin': '/img/washbasin.png', 'toilet': '/img/toilet.png', 'tv': '/img/tv.png', 'air-conditioner': '/img/ac.png', 'rice-cooker': '/img/rice-cooker.png', 'microwave': '/img/microwave.png', 'fridge': '/img/fridge.png', 'stove': '/img/stove.png', 'kitchen-sink': '/img/kitchen-sink.png'};
    const FIT = 'left:0;top:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated';
    const WASHFIT = 'left:-35px;top:-165px;width:373px;height:410px;image-rendering:auto';
    const probs = s.problems.filter((q) => OV[q.id]);
    const opener = (q) => q.kind === 'check' ? () => this.setState({ sheet: 'check' }) : () => this.setState({ sheet: 'incident', sel: q.id });
    const checked = s.acN >= 5;
    const acText = checked ? '점검 미션 완료. 에어컨을 점검해 보세요.' : '점검 미션 ' + s.acN + ' / 5';
    const bar = 'width:' + Math.round(s.acN / 5 * 100) + '%';
    const TABS = { pegboard: 'peg', drawer: 'drawer', mypage: 'my' };
    const incidents = probs.filter((q) => q.kind === 'incident');
    return {
      isRoom: s.view === 'room', isEdit: s.view === 'edit',
      sheetNotice: s.view === 'room' && s.sheet === 'notice', sheetIncident: s.view === 'room' && s.sheet === 'incident', sheetCheck: s.view === 'room' && s.sheet === 'check',
      roomTap: (e) => this.roomTap(e),
      showReveal: !!s.reveal,
      rvCells: s.reveal ? (() => { const out = []; for (let r = 0; r < 31; r++) for (let c = 0; c < 16; c++) { const d = Math.hypot(c - 7.5, r - 15), t = 0.3 + d / 17.4 * 1.0; out.push({ style: 'left:' + c * 20 + 'px;top:' + r * 20 + 'px;animation-delay:' + t.toFixed(2) + 's' }); } return out; })() : [],
      showTap: !!s.tapK, tapCls: 'tapm ' + (s.tapK % 2 ? 'a' : 'b'), tapStyle: 'left:' + (s.tapX || 0) + 'px;top:' + (s.tapY || 0) + 'px',
      showChar: s.live || probs.length > 0,
      charSrc: B(FACE[s.shock ? 'surprised' : s.face] || FACE.default),
      charCls: 'ch live' + (s.walk ? ' walk' : '') + (s.shock ? ' shock' : ''),
      charStyle: 'left:' + (s.pos[0] - 43.2) + 'px;top:' + (s.pos[1] - 84) + 'px;transition:left ' + s.dur + 's linear,top ' + s.dur + 's linear',
      roomLabel: probs.length ? '내 방, 문제가 생긴 가전: ' + probs.map((q) => OV[q.id][0]).join(', ') : '내 방',
      layers: probs.map((q) => ({ src: B(OV[q.id][1]) })),
      hits: probs.map((q) => ({ label: OV[q.id][0] + ' 문제 보기', open: opener(q),
        style: 'left:' + (OV[q.id][2] - 4) + 'px;top:' + (OV[q.id][3] - 4) + 'px;width:' + (OV[q.id][4] + 8) + 'px;height:' + (OV[q.id][5] + 8) + 'px' })),
      incidentRows: incidents.map((q) => ({ name: OV[q.id][0], text: OV[q.id][0] + '에서 문제가 생겼어요.', open: opener(q) })),
      noIncident: incidents.length === 0,
      incName: (OV[s.sel] || OV['washer-2'])[0],
      incPic: B(PIC[s.sel] || '/img/problem.png'), incStyle: PIC[s.sel] ? FIT : WASHFIT,
      chkPic: B('/img/ac-check.png'), chkStyle: FIT,
      topActions: ['bell'],
      topAction: (a) => { if (a === 'bell') go('alerts'); },
      tab: (k) => { if (TABS[k]) go(TABS[k]); },
      openNotice: () => this.setState({ sheet: 'notice' }),
      openEdit: () => this.setState({ view: 'edit' }),
      closeEdit: () => this.setState({ view: 'room' }),
      closeSheet: () => this.setState({ sheet: '' }),
      openCheck: () => this.setState({ sheet: 'check' }),
      startSim: () => { if (s.sheet === 'check' && checked) return; if (p.onPatch) p.onPatch({ simFrom: s.sheet === 'check' ? 'air-conditioner' : s.sel, problems: s.problems }); go('sim', 'intro'); },
      acDone: checked, acN: s.acN, acText, acBar: bar,
      checkBtn: checked ? 'inactive' : 'primary', checkLabel: checked ? '모든 미션을 완료했어요' : '시뮬레이션 시작하기',
      ownedRows: s.own.filter((id) => AP[id]).map((id) => ({ name: AP[id][0], icon: B(AP[id][1]), act: () => setOwn(s.own.filter((x) => x !== id)) })),
      addRows: Object.keys(AP).filter((id) => s.own.indexOf(id) < 0).map((id) => ({ name: AP[id][0], icon: B(AP[id][1]), act: () => setOwn(s.own.concat(id)) })),
      hasAddable: Object.keys(AP).some((id) => s.own.indexOf(id) < 0)
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      {!!v.isRoom && (
        <>
        <div style={{position: "absolute", left: "0", top: "60px", width: "393px"}}>
          <WitooDS.TopBar variant="logo" actions={v.topActions} onAction={v.topAction} />
        </div>
        <div className="room" role="img" aria-label={v.roomLabel} onClick={v.roomTap}>
          <img src="/img/home-room.svg" alt="" />
          {(v.layers || []).map((l, __i) => (
            <Fragment key={__i}>
              <img src={l.src} alt="" />
            </Fragment>
          ))}
          {!!v.showChar && (
            <>
            <div className={v.charCls} style={css(v.charStyle)}>
              <img src={v.charSrc} alt="" />
            </div>
            </>
          )}
          {!!v.showReveal && (
            <>
            <div className="rv">
              {(v.rvCells || []).map((c, __i) => (
                <Fragment key={__i}>
                  <i style={css(c.style)} />
                </Fragment>
              ))}
            </div>
            </>
          )}
          {!!v.showTap && (
            <>
            <div className={v.tapCls} style={css(v.tapStyle)} />
            </>
          )}
          {(v.hits || []).map((h, __i) => (
            <Fragment key={__i}>
              <button type="button" className="hit" style={css(h.style)} aria-label={h.label} onClick={h.open} />
            </Fragment>
          ))}
        </div>
        <button type="button" className="fab" style={{top: "565px"}} aria-label="방 안 알림" onClick={v.openNotice}>
          <img src="/img/room-btn-info.svg" alt="" style={{width: "48px", height: "35px"}} />
        </button>
        <button type="button" className="fab" style={{top: "645px"}} aria-label="가전 추가/삭제" onClick={v.openEdit}>
          <span className="pl" />
        </button>
        <div style={{position: "absolute", left: "0", top: "745px", width: "393px"}}>
          <WitooDS.TabBar active="home" onChange={v.tab} />
        </div>
        </>
      )}
      {!!v.isEdit && (
        <>
        <div className="ed">
          <div className="hd">
            <button className="bk" type="button" aria-label="뒤로" onClick={v.closeEdit} style={{left: "28px", top: "20px"}}>
              <span className="ic-back" />
            </button>
            <h1>
              가전 추가/삭제
            </h1>
          </div>
          <div className="body">
            <div>
              <h3>
                내 방 가전
              </h3>
              <div className="lst">
                <div className="li">
                  <div className="l">
                    <span className="ib">
                      <img src="/img/sink.svg" alt="" />
                    </span>
                    싱크대
                  </div>
                  <span className="sm fix">
                    고정
                  </span>
                </div>
                <div className="li">
                  <div className="l">
                    <span className="ib">
                      <img src="/img/shower.svg" alt="" />
                    </span>
                    샤워기
                  </div>
                  <span className="sm fix">
                    고정
                  </span>
                </div>
                <div className="li">
                  <div className="l">
                    <span className="ib">
                      <img src="/img/toilet.svg" alt="" />
                    </span>
                    변기
                  </div>
                  <span className="sm fix">
                    고정
                  </span>
                </div>
                {(v.ownedRows || []).map((a, __i) => (
                  <Fragment key={__i}>
                    <div className="li">
                      <div className="l">
                        <span className="ib">
                          <img src={a.icon} alt="" />
                        </span>
                        {a.name}
                      </div>
                      <button type="button" className="sm del" aria-label={`${a.name} 삭제`} onClick={a.act}>
                        삭제
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            {!!v.hasAddable && (
              <>
              <div>
                <h3>
                  추가할 수 있는 가전
                </h3>
                <div className="lst">
                  {(v.addRows || []).map((a, __i) => (
                    <Fragment key={__i}>
                      <div className="li add">
                        <div className="l">
                          <span className="ib">
                            <img src={a.icon} alt="" />
                          </span>
                          {a.name}
                        </div>
                        <button type="button" className="sm pl2" aria-label={`${a.name} 추가`} onClick={a.act}>
                          추가
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>
        </div>
        </>
      )}
      {!!v.sheetNotice && (
        <>
        <button type="button" className="dim" aria-label="닫기" onClick={v.closeSheet} />
        <div className="nt" role="dialog" aria-label="방 안 알림">
          <div className="tt">
            <span>
              방 안 알림
            </span>
            <button type="button" className="xb" aria-label="닫기" onClick={v.closeSheet} />
          </div>
          <div className="sec">
            <h3>
              돌발 상황
            </h3>
            {(v.incidentRows || []).map((r, __i) => (
              <Fragment key={__i}>
                <button type="button" className="cd" onClick={r.open}>
                  <span className="tx">
                    <span className="n">
                      {r.name}
                    </span>
                    <span className="s">
                      {r.text}
                    </span>
                  </span>
                  <span className="chv" />
                </button>
              </Fragment>
            ))}
            {!!v.noIncident && (
              <>
              <div className="cd" style={{cursor: "default"}}>
                <span className="tx">
                  <span className="s">
                    지금은 돌발 상황이 없어요.
                  </span>
                </span>
              </div>
              </>
            )}
          </div>
          <div className="sec">
            <h3>
              정기점검
            </h3>
            <button type="button" className="cd" onClick={v.openCheck}>
              <span className="tx">
                <span className="n">
                  에어컨
                  {!!v.acDone && (
                    <>
                    <span className="pill">
                      점검 시기
                    </span>
                    </>
                  )}
                </span>
                <span className="s">
                  {v.acText}
                </span>
                <span className="pb">
                  <i style={css(v.acBar)} />
                </span>
              </span>
              <span className="chv" />
            </button>
          </div>
        </div>
        </>
      )}
      {!!v.sheetIncident && (
        <>
        <button type="button" className="dim" aria-label="닫기" onClick={v.closeSheet} />
        <div className="sheet" style={{top: "509px", height: "343px", padding: "24px"}}>
          <div className="grab" />
          <h2>
            {v.incName}
          </h2>
          <div className="pic">
            <img src={v.incPic} alt="" style={css(v.incStyle)} />
          </div>
          <div style={{marginTop: "16px"}}>
            <WitooDS.Button variant="primary" overlay="true" onClick={v.startSim}>
              시뮬레이션 시작하기
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
      {!!v.sheetCheck && (
        <>
        <button type="button" className="dim" aria-label="닫기" onClick={v.closeSheet} />
        <div className="sheet" style={{top: "457px", height: "395px", padding: "24px"}}>
          <div className="grab" />
          <h2>
            에어컨
          </h2>
          <div className="pic">
            <img src={v.chkPic} alt="" style={css(v.chkStyle)} />
            {!!v.acDone && (
              <>
              <div className="note">
                <span style={{fontWeight: "600", fontSize: "16px", lineHeight: "24px"}}>
                  <span className="ic-err" style={{display: "inline-block", verticalAlign: "-1px", marginRight: "6px"}} />
                  실제 점검 시기가 되었어요!
                </span>
                <span style={{fontSize: "14px", lineHeight: "20px", color: "var(--gray-500)"}}>
                  필터 청소와 냉매 확인이 필요한 시점입니다.
                </span>
              </div>
              </>
            )}
          </div>
          <div className="prog">
            <div className="row">
              <span>
                정기 점검 미션 진행도
              </span>
              <b>
                {v.acN}{" / 5"}
              </b>
            </div>
            <div className="bar">
              <i style={css(v.acBar)} />
            </div>
          </div>
          <div style={{marginTop: "16px"}}>
            <WitooDS.Button variant={v.checkBtn} overlay="true" onClick={v.startSim}>
              {v.checkLabel}
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
