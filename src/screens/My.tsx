// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './My.css';

const POSTS = [
  { title: '효율적인 주방 정리 노하우 공유합니다', body: '요즘 주방 정리에 꽂혀서 이것저것 시도해 봤는데 가장 효과가 좋았던 방법을 공유해요. 서랍 칸막이를 활용하면 훨씬 깔끔해져요.', meta: '10분 전 · 좋아요 12 · 댓글 3', thumb: true },
  { title: '집안일 분담 어떻게 하시나요?', body: '맞벌이 부부인데 집안일 때문에 스트레스가 많네요. 다들 어떻게 분담하는지 궁금해서 글 남겨요. 좋은 방법 있으면 알려주세요.', meta: '1시간 전 · 좋아요 5 · 댓글 8', thumb: false },
  { title: '오늘 대청소 완료했습니다!', body: '미루고 미루던 베란다까지 싹 치우고 나니까 속이 다 시원하네요. 청소 순서 팁도 같이 남겨요.', meta: '3시간 전 · 좋아요 24 · 댓글 5', thumb: true },
  { title: '세제 추천 부탁드려요', body: '친환경 세제 중에 세척력 좋은 제품 있을까요? 아이 키우는 집이라 성분도 꼼꼼히 보고 싶어요.', meta: '어제 · 좋아요 8 · 댓글 15', thumb: false }
];
const CMS = [
  { text: '저도 이 방법 써봤는데 확실히 효과가 좋더라고요! 특히 과정이 간단해서 따라 하기 쉬웠어요.', meta: '5분 전' },
  { text: '혹시 사용하신 제품 정보 좀 알 수 있을까요? 저희 집도 비슷한 문제가 있어서요.', meta: '1시간 전' },
  { text: '좋은 정보 감사합니다. 다음에 문제 생기면 꼭 따라해봐야겠어요.', meta: '3시간 전' },
  { text: '이건 정말 꿀팁이네요. 공유해주셔서 감사해요. 많은 분들이 보면 좋겠어요.', meta: '어제' }
];
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = this.initial('');
  }
  initial(v) {
    const view = { '': 'main', profile: 'profile', 'profile-social': 'profile', sheet: 'profile', perm: 'profile', nick: 'nick', 'nick-err': 'nick', pw: 'pw', 'pw-err': 'pw', posts: 'posts', comments: 'posts', delete: 'posts', notif: 'notif', 'notif-off': 'notif', logout: 'main', withdraw: 'withdraw', 'withdraw-confirm': 'withdraw' }[v] || 'main';
    return {
      view, ptab: v === 'comments' ? 'c' : 'p', dlg: v === 'delete' ? 'del' : v === 'logout' ? 'out' : v === 'withdraw-confirm' ? 'wd' : null,
      sheet: v === 'sheet', perm: v === 'perm', delIdx: v === 'delete' ? 1 : -1,
      nickIn: v === 'nick-err' ? '깔' : v === 'nick' ? '깔끔이' : null, nickTry: v === 'nick-err',
      pw0: v === 'pw-err' ? '••••••••' : '', pw1: v === 'pw-err' ? '••••' : '', pw2: v === 'pw-err' ? '••••' : '', pwTry: v === 'pw-err',
      permOff: v === 'notif-off', tg: v === 'notif-off' ? [false, false, false] : [true, true, true],
      chk: v === 'withdraw-confirm', social: v === 'profile-social', rmP: [], rmC: []
    };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = this.initial(v); }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, d = p.data || {};
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    const nick = d.nick || '깔끔이', email = d.email || 'witoo@email.com';
    const isSocial = s.social || (d.social === true && p.variant !== 'profile');
    const view = s.view;
    const TITLES = { profile: '프로필 설정', nick: '닉네임 변경', pw: '비밀번호 변경', posts: '작성 게시글/댓글', notif: '알림 설정', withdraw: '회원탈퇴' };
    const set = (o) => this.setState(o);
    // nick
    const nv = s.nickIn === null ? nick : s.nickIn;
    const nerr = (nv.length < 2 || nv.length > 12) && (s.nickTry || nv.length > 12);
    const nok = nv.length >= 2 && nv.length <= 12;
    // pw
    const okPw = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const e0 = s.pwTry && s.pw0 && s.pw0 !== (d.pw || 'password1') && s.pw0 !== '••••••••' ? '' : (s.pwTry && s.pw0 === '••••••••' ? '현재 비밀번호가 맞지 않아요' : '');
    const e0b = s.pwTry && s.pw0 && s.pw0 !== (d.pw || 'password1') ? '현재 비밀번호가 맞지 않아요' : '';
    const e1 = s.pwTry && s.pw1 && !okPw.test(s.pw1);
    const fillAll = !!(s.pw0 && s.pw1 && s.pw2);
    // lists
    const postRows = s.ptab === 'p' ? POSTS.map((x, i) => ({ ...x, i })).filter((x) => s.rmP.indexOf(x.i) < 0).map((x) => ({ ...x, del: () => set({ dlg: 'del', delIdx: x.i }) })) : [];
    const cmRows = s.ptab === 'c' ? CMS.map((x, i) => ({ ...x, i })).filter((x) => s.rmC.indexOf(x.i) < 0).map((x) => ({ ...x, del: () => set({ dlg: 'del', delIdx: x.i }) })) : [];
    const D = { del: ['삭제할까요?', '삭제한 글은 되돌릴 수 없어요.', '삭제'], out: ['로그아웃할까요?', '로그아웃하면 다시 로그인해야 해요.', '로그아웃'], wd: ['정말 탈퇴할까요?', '탈퇴하면 계정과 채팅 기록이 삭제되고\n되돌릴 수 없어요.', '탈퇴하기'] };
    const dd = s.dlg ? D[s.dlg] : ['', '', ''];
    const TG = [['댓글 알림', '내 게시글에 댓글이 달리면 알려드려요'], ['인기 게시글 알림', '오늘의 인기 게시글을 알려드려요'], ['정기점검 알림', '점검일이 다가오면 알려드려요']];
    return {
      isMain: view === 'main', isSub: view !== 'main', showTab: view === 'posts' || view === 'notif' || view === 'withdraw',
      title: TITLES[view] || '', nick, email,
      topAction: (a) => { if (a === 'bell') go('alerts'); },
      tab: (k) => { const m = { home: 'home', pegboard: 'peg', drawer: 'drawer', mypage: 'my' }; if (k !== 'mypage' && m[k]) go(m[k]); },
      back: () => { if (view === 'nick' || view === 'pw') set({ view: 'profile', nickIn: null, nickTry: false, pw0: '', pw1: '', pw2: '', pwTry: false }); else set({ view: 'main', chk: false }); },
      toProfile: () => set({ view: 'profile' }), toPosts: () => set({ view: 'posts', ptab: 'p' }), toNotif: () => set({ view: 'notif' }), toWithdraw: () => set({ view: 'withdraw', chk: false }),
      askLogout: () => set({ dlg: 'out' }),
      // profile
      isProfile: view === 'profile', hasPw: !isSocial, nickRowCls: 'my-row' + (isSocial ? ' last' : ''),
      openSheet: () => set({ sheet: true }), askPerm: () => set({ sheet: false, perm: true }),
      toNick: () => set({ view: 'nick', nickIn: null, nickTry: false }), toPw: () => set({ view: 'pw' }),
      sheet: s.sheet, perm: s.perm, dlg: !!s.dlg, dlgTitle: dd[0], dlgBody: dd[1], dlgOkLabel: dd[2],
      closeAll: () => set({ sheet: false, perm: false, dlg: null }),
      dlgOk: () => {
        if (s.dlg === 'del') { if (s.ptab === 'p') set({ rmP: s.rmP.concat(s.delIdx), dlg: null }); else set({ rmC: s.rmC.concat(s.delIdx), dlg: null }); }
        else if (s.dlg === 'out') { set({ dlg: null }); go('start'); }
        else if (s.dlg === 'wd') { set({ dlg: null }); go('start'); }
      },
      // nick
      isNick: view === 'nick', nickVal: nv, nickBox: 'my-i' + (nerr ? ' er' : ''), nickHelpCls: 'my-h' + (nerr ? ' er' : ''),
      nickHelp: nerr ? '닉네임은 2자 이상 12자 이하로 입력해 주세요' : '2~12자로 입력해 주세요', nickCount: nv.length,
      setNick: (e) => set({ nickIn: e.target.value, nickTry: true }),
      nickBtn: nok ? 'primary' : 'inactive',
      saveNick: () => { if (!nok) return; if (p.onPatch) p.onPatch({ nick: nv }); set({ view: 'profile', nickIn: null, nickTry: false }); },
      // pw
      isPw: view === 'pw', pw0: s.pw0, pw1: s.pw1, pw2: s.pw2,
      pw0Cls: 'my-i' + (e0b || (s.pwTry && s.pw0 === '••••••••') ? ' er' : ''), pw1Cls: 'my-i' + (e1 ? ' er' : ''),
      e0: e0b || e0, h1: e1 ? '비밀번호는 8자 이상, 영문과 숫자를 포함해야 해요' : '8자 이상, 영문과 숫자를 포함해 주세요', h1Cls: 'my-h' + (e1 ? ' er' : ''),
      setPw0: (e) => set({ pw0: e.target.value }), setPw1: (e) => set({ pw1: e.target.value }), setPw2: (e) => set({ pw2: e.target.value }),
      pwBtn: fillAll ? 'primary' : 'inactive',
      savePw: () => {
        if (!fillAll) return;
        const bad = s.pw0 !== (d.pw || 'password1') || !okPw.test(s.pw1) || s.pw1 !== s.pw2;
        if (bad && s.pw0 !== '••••••••') { set({ pwTry: true }); if (s.pw0 === (d.pw || 'password1') && s.pw1 !== s.pw2) { set({ pw2: '' }); } return; }
        if (s.pw0 === '••••••••') { set({ pwTry: true }); return; }
        if (p.onPatch) p.onPatch({ pw: s.pw1 }); set({ view: 'profile', pw0: '', pw1: '', pw2: '', pwTry: false });
      },
      // posts
      isPosts: view === 'posts', tabP: s.ptab === 'p' ? 'on' : '', tabC: s.ptab === 'c' ? 'on' : '',
      showPosts: () => set({ ptab: 'p' }), showCms: () => set({ ptab: 'c' }), postRows, cmRows,
      listEmpty: postRows.length + cmRows.length === 0, emptyText: s.ptab === 'p' ? '작성한 게시글이 없어요' : '작성한 댓글이 없어요',
      // notif
      isNotif: view === 'notif', permOff: s.permOff, cardOp: s.permOff ? 'margin-top:16px;opacity:.5' : '',
      grantPerm: () => set({ permOff: false, tg: [true, true, true] }),
      toggles: TG.map((t, i) => ({ title: t[0], desc: t[1], cls: 'my-nr' + (i === 2 ? ' last' : ''), tg: 'my-tg' + (s.tg[i] ? ' on' : ''), on: () => { if (s.permOff) return; const n = s.tg.slice(); n[i] = !n[i]; set({ tg: n }); } })),
      // withdraw
      isWithdraw: view === 'withdraw', chkCls: s.chk ? 'on' : '', toggleChk: () => set({ chk: !s.chk }),
      wdBtn: s.chk ? 'primary' : 'inactive', askWithdraw: () => { if (s.chk) set({ dlg: 'wd' }); }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      {!!v.isMain && (
        <>
        <div style={{position: "absolute", left: "0", top: "60px", width: "393px"}}>
          <WitooDS.TopBar title="마이페이지" onAction={v.topAction} />
        </div>
        <div className="my-av" style={{left: "20px", top: "140px", width: "72px", height: "72px"}}>
          <img src="/img/avatar.svg" alt="" style={{left: "12px", top: "16px", width: "48px", height: "56px"}} />
        </div>
        <div style={{position: "absolute", left: "108px", top: "151px"}}>
          <div style={{fontSize: "20px", lineHeight: "28px", fontWeight: "600", color: "#252422"}}>
            {v.nick}
          </div>
          <div style={{fontSize: "14px", lineHeight: "20px", color: "#6e6d66", marginTop: "2px"}}>
            {v.email}
          </div>
        </div>
        <div className="my-card" style={{top: "252px"}}>
          <button type="button" className="my-row" onClick={v.toProfile}>
            <img className="ico" src="/img/my-1f464-20.svg" alt="" />
            <span className="lb">
              프로필 설정
            </span>
            <span className="cv" />
          </button>
          <button type="button" className="my-row" onClick={v.toPosts}>
            <img className="ico" src="/img/my-1f4ac-20.svg" alt="" />
            <span className="lb">
              작성 게시글/댓글 관리
            </span>
            <span className="cv" />
          </button>
          <button type="button" className="my-row last" onClick={v.toNotif}>
            <img className="ico" src="/img/my-1f514-20.svg" alt="" />
            <span className="lb">
              알림 설정
            </span>
            <span className="cv" />
          </button>
        </div>
        <div className="my-ac">
          <button type="button" style={{color: "#494944"}} onClick={v.askLogout}>
            로그아웃
          </button>
          <button type="button" style={{color: "#b7b6aa"}} onClick={v.toWithdraw}>
            회원탈퇴
          </button>
        </div>
        <div style={{position: "absolute", left: "0", top: "745px", width: "393px"}}>
          <WitooDS.TabBar active="mypage" onChange={v.tab} />
        </div>
        </>
      )}
      {!!v.isSub && (
        <>
        <div className="hd">
          <button className="bk" type="button" aria-label="뒤로" onClick={v.back}>
            <span className="ic-back" />
          </button>
          <h1>
            {v.title}
          </h1>
        </div>
        </>
      )}
      {!!v.isProfile && (
        <>
        <div className="my-av" style={{left: "148px", top: "148px", width: "96px", height: "96px"}}>
          <img src="/img/avatar.svg" alt="" style={{left: "18px", top: "26px", width: "60px", height: "70px"}} />
        </div>
        <button type="button" style={{position: "absolute", left: "210px", top: "210px", width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #e2e2dd", background: "#fff", padding: "0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"}} aria-label="프로필 사진 변경" onClick={v.openSheet}>
          <img src="/img/my-camera.svg" alt="" style={{width: "16px", height: "16px"}} />
        </button>
        <div className="my-card" style={{top: "284px"}}>
          <button type="button" className={v.nickRowCls} onClick={v.toNick}>
            <span className="lb">
              닉네임
            </span>
            <span className="vl">
              {v.nick}
            </span>
            <span className="cv" />
          </button>
          {!!v.hasPw && (
            <>
            <button type="button" className="my-row last" onClick={v.toPw}>
              <span className="lb">
                비밀번호 변경
              </span>
              <span className="cv" />
            </button>
            </>
          )}
        </div>
        </>
      )}
      {!!v.isNick && (
        <>
        <div className="my-fl">
          <div className="my-f">
            <label>
              닉네임
            </label>
            <div className={v.nickBox}>
              <input type="text" value={v.nickVal} placeholder="2~12자로 입력해 주세요" onChange={v.setNick} />
            </div>
            <div className={v.nickHelpCls}>
              <span>
                {v.nickHelp}
              </span>
              <b>
                {v.nickCount}/12
              </b>
            </div>
          </div>
        </div>
        <div className="my-bt">
          <WitooDS.Button variant={v.nickBtn} onClick={v.saveNick}>
            저장
          </WitooDS.Button>
        </div>
        </>
      )}
      {!!v.isPw && (
        <>
        <div className="my-fl" style={{gap: "20px"}}>
          <div className="my-f">
            <label>
              현재 비밀번호
            </label>
            <div className={v.pw0Cls}>
              <input type="password" value={v.pw0} placeholder="현재 비밀번호를 입력해 주세요" onChange={v.setPw0} />
            </div>
            {!!v.e0 && (
              <>
              <div className="my-h er">
                <span>
                  {v.e0}
                </span>
              </div>
              </>
            )}
          </div>
          <div className="my-f">
            <label>
              새 비밀번호
            </label>
            <div className={v.pw1Cls}>
              <input type="password" value={v.pw1} placeholder="새 비밀번호를 입력해 주세요" onChange={v.setPw1} />
            </div>
            <div className={v.h1Cls}>
              <span>
                {v.h1}
              </span>
            </div>
          </div>
          <div className="my-f">
            <label>
              새 비밀번호 확인
            </label>
            <div className="my-i">
              <input type="password" value={v.pw2} placeholder="새 비밀번호를 다시 입력해 주세요" onChange={v.setPw2} />
            </div>
          </div>
        </div>
        <div className="my-bt">
          <WitooDS.Button variant={v.pwBtn} onClick={v.savePw}>
            변경하기
          </WitooDS.Button>
        </div>
        </>
      )}
      {!!v.isPosts && (
        <>
        <div className="my-tabs">
          <button type="button" className={v.tabP} onClick={v.showPosts}>
            게시글
          </button>
          <button type="button" className={v.tabC} onClick={v.showCms}>
            댓글
          </button>
        </div>
        <div className="my-ls">
          {(v.postRows || []).map((r, __i) => (
            <Fragment key={__i}>
              <div className="my-ps">
                <div className="my-bd">
                  <div className="tx">
                    <h3>
                      {r.title}
                    </h3>
                    <p>
                      {r.body}
                    </p>
                  </div>
                  {!!r.thumb && (
                    <>
                    <div className="th">
                      <img src="/img/post-image.jpg" alt="" />
                    </div>
                    </>
                  )}
                </div>
                <div className="my-mt">
                  <span>
                    {r.meta}
                  </span>
                  <button type="button" onClick={r.del}>
                    삭제
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
          {(v.cmRows || []).map((r, __i) => (
            <Fragment key={__i}>
              <div className="my-ps">
                <div style={{fontSize: "16px", lineHeight: "24px", color: "#252422", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "48px"}}>
                  {r.text}
                </div>
                <div className="my-og">
                  <b>
                    원글
                  </b>
                  <span>
                    싱크대 물이 안 빠질 때 이렇게 해결했어요
                  </span>
                </div>
                <div className="my-mt">
                  <span>
                    {r.meta}
                  </span>
                  <button type="button" onClick={r.del}>
                    삭제
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
          {!!v.listEmpty && (
            <>
            <div className="my-em">
              {v.emptyText}
            </div>
            </>
          )}
        </div>
        </>
      )}
      {!!v.isNotif && (
        <>
        <div className="my-fl">
          {!!v.permOff && (
            <>
            <div className="my-bn">
              <div className="ms">
                <i>
                  !
                </i>
                <div>
                  <b>
                    기기의 알림이 꺼져 있어요
                  </b>
                  <span>
                    알림을 받으려면 기기 설정에서 알림 권한을 켜 주세요.
                  </span>
                </div>
              </div>
              <button type="button" onClick={v.grantPerm}>
                권한 켜기
              </button>
            </div>
            </>
          )}
          <div className="my-card" style={css(`position:relative;left:0;${v.cardOp}`)}>
            {(v.toggles || []).map((t, __i) => (
              <Fragment key={__i}>
                <div className={t.cls}>
                  <div>
                    <b>
                      {t.title}
                    </b>
                    <span>
                      {t.desc}
                    </span>
                  </div>
                  <button type="button" className={t.tg} aria-label={t.title} onClick={t.on}>
                    <i />
                  </button>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        </>
      )}
      {!!v.isWithdraw && (
        <>
        <div style={{position: "absolute", left: "20px", top: "140px", width: "353px", fontSize: "24px", lineHeight: "32px", fontWeight: "600", color: "#252422"}}>
          탈퇴하기 전에
          <br />
          확인해 주세요
        </div>
        <div className="my-nt">
          <div>
            <i>
              •
            </i>
            <span>
              계정과 채팅 기록 등 개인 정보가 모두 삭제돼요
            </span>
          </div>
          <div>
            <i>
              •
            </i>
            <span>
              삭제된 정보는 되돌릴 수 없어요
            </span>
          </div>
          <div>
            <i>
              •
            </i>
            <span>
              {"커뮤니티에 남긴 게시글과 댓글은 '탈퇴한 사용자'로 표시되고 그대로 남아요"}
            </span>
          </div>
        </div>
        <button type="button" className="my-cf" onClick={v.toggleChk}>
          <i className={v.chkCls} />
          위 내용을 모두 확인했어요
        </button>
        <div style={{position: "absolute", left: "20px", top: "673px", width: "353px"}}>
          <WitooDS.Button variant={v.wdBtn} onClick={v.askWithdraw}>
            탈퇴하기
          </WitooDS.Button>
        </div>
        </>
      )}
      {!!v.showTab && (
        <>
        <div style={{position: "absolute", left: "0", top: "745px", width: "393px"}}>
          <WitooDS.TabBar active="mypage" onChange={v.tab} />
        </div>
        </>
      )}
      {!!v.sheet && (
        <>
        <div className="my-ov" onClick={v.closeAll} />
        <div className="my-sh" role="dialog" aria-label="프로필 사진 변경">
          <div className="hn">
            <i />
          </div>
          <button type="button" onClick={v.askPerm}>
            앨범에서 사진 선택
          </button>
          <button type="button" onClick={v.closeAll}>
            기본 이미지로 변경
          </button>
          <div className="gap" />
          <button type="button" className="cl" onClick={v.closeAll}>
            닫기
          </button>
        </div>
        </>
      )}
      {!!v.perm && (
        <>
        <div className="my-ov" onClick={v.closeAll} />
        <div className="my-md" style={{top: "280px"}} role="dialog">
          <h2>
            사진 접근 권한이 필요해요
          </h2>
          <p>
            프로필 사진을 바꾸려면 사진 접근을
            <br />
            허용해 주세요.
          </p>
          <div className="ac">
            <WitooDS.Button variant="primary" onClick={v.closeAll}>
              허용하기
            </WitooDS.Button>
            <WitooDS.Button variant="outline" onClick={v.closeAll}>
              취소
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
      {!!v.dlg && (
        <>
        <div className="my-ov" onClick={v.closeAll} />
        <div className="my-md" style={{top: "326px"}} role="dialog">
          <h2>
            {v.dlgTitle}
          </h2>
          <p>
            {v.dlgBody}
          </p>
          <div className="ac2">
            <button type="button" className="bg" onClick={v.closeAll}>
              취소
            </button>
            <button type="button" className="bo" onClick={v.dlgOk}>
              {v.dlgOkLabel}
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
