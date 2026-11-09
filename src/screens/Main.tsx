// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import Alerts from './Alerts';
import Drawer from './Drawer';
import Home from './Home';
import Intro from './Intro';
import Login from './Login';
import My from './My';
import Peg from './Peg';
import PwFind from './PwFind';
import Setup from './Setup';
import Signup from './Signup';
import Sim from './Sim';
import Splash from './Splash';
import Start from './Start';
import './Main.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { screen: 'splash', variant: '', data: { email: '', nick: '', owned: [] } };
    try { const h = (window.location.hash || '').replace('#', '').split('/'); if (h[0]) this.state = { ...this.state, screen: h[0], variant: h[1] || '' }; } catch (e) {}
  }
  renderVals() {
    const BUILT = ['splash', 'start', 'signup', 'login', 'pwfind', 'intro', 'setup', 'home', 'sim', 'peg', 'drawer', 'my', 'alerts'];
    const CAT = [
      ['가입 · 로그인', [
        ['스플래시', 'splash', ''], ['시작하기', 'start', ''],
        ['회원가입', 'signup', ''], ['회원가입 · 오류', 'signup', 'error'], ['회원가입 · 이미 가입됨', 'signup', 'modal'],
        ['로그인', 'login', ''], ['로그인 · 오류', 'login', 'error'], ['로그인 · 가입되지 않은 계정', 'login', 'modal'], ['로그인 · 인증 실패', 'login', 'auth'],
        ['비밀번호 찾기', 'pwfind', ''], ['비밀번호 찾기 · 오류', 'pwfind', 'error'], ['비밀번호 찾기 · 메일 발송', 'pwfind', 'sent'], ['새 비밀번호 설정', 'pwfind', 'reset']
      ]],
      ['소개 · 내 방 만들기', [
        ['서비스 소개 1', 'intro', '1'], ['서비스 소개 2', 'intro', '2'], ['서비스 소개 3', 'intro', '3'],
        ['보유 가전 선택', 'setup', ''], ['보유 가전 선택 · 선택됨', 'setup', 'picked']
      ]],
      ['내 방', [
        ['내 방', 'home', ''], ['내 방 · 돌발/정기점검', 'home', 'mixed'], ['내 방 · 가전 추가/삭제', 'home', 'edit'],
        ['내 방 · 방 안 알림', 'home', 'notice'], ['내 방 · 돌발 상황', 'home', 'incident'], ['내 방 · 정기점검', 'home', 'check'], ['내 방 · 정기점검 완료', 'home', 'checked']
      ]],
      ['시뮬레이션', [
        ['문제 상황 설명', 'sim', 'intro'], ['게임 시작', 'sim', 'start'], ['게임 시작 · 미선택', 'sim', 'start-none'], ['게임 시작 · 선택', 'sim', 'start-pick'],
        ['중간 결과', 'sim', 'mid'], ['중간 결과 · 올바른 선택', 'sim', 'fb-ok'], ['다음 단계 · 미선택', 'sim', 'step-none'], ['다음 단계 · 선택', 'sim', 'step-pick'],
        ['3단계', 'sim', 'step3'], ['4단계', 'sim', 'step4'], ['5단계', 'sim', 'step5'], ['중간 결과 · 즉시 실패', 'sim', 'fb-fail'], ['중간 결과 · 5단계', 'sim', 'fb5'],
        ['결과 화면', 'sim', 'result'], ['결과 · 부분 성공', 'sim', 'end-partial'], ['결과 · 실패', 'sim', 'end-bad'],
        ['실패 결말 01', 'sim', 'fail1'], ['실패 결말 02', 'sim', 'fail2'], ['실패 결말 03', 'sim', 'fail3'], ['실패 결말 04', 'sim', 'fail4']
      ]],
      ['페그보드', [
        ['열린 구멍', 'peg', ''], ['열린 구멍 · 카드', 'peg', 'card'], ['열린 구멍 X', 'peg', 'none'], ['삭제된 카드', 'peg', 'deleted']
      ]],
      ['서랍', [
        ['서랍 메인', 'drawer', ''], ['카드 작성', 'drawer', 'write'], ['카드 작성 · 입력', 'drawer', 'write2'], ['게시글', 'drawer', 'post'],
        ['내가 쓴 게시글', 'drawer', 'mine'], ['내 게시글 메뉴', 'drawer', 'menu'], ['내 게시글 삭제', 'drawer', 'delete'], ['게시글 아카이빙', 'drawer', 'archive']
      ]],
      ['마이페이지', [
        ['마이페이지', 'my', ''], ['프로필 설정 · 이메일 회원', 'my', 'profile'], ['프로필 설정 · 간편 가입 회원', 'my', 'profile-social'],
        ['프로필 사진 변경', 'my', 'photo'], ['사진 접근 권한 안내', 'my', 'photo-perm'], ['닉네임 변경', 'my', 'nick'], ['닉네임 변경 · 오류', 'my', 'nick-error'],
        ['비밀번호 변경', 'my', 'pw'], ['비밀번호 변경 · 오류', 'my', 'pw-error'], ['작성 게시글 관리', 'my', 'posts'], ['작성 댓글 관리', 'my', 'comments'], ['삭제 확인', 'my', 'del'],
        ['알림 설정', 'my', 'notif'], ['알림 설정 · 기기 권한 꺼짐', 'my', 'notif-off'], ['로그아웃 확인', 'my', 'logout'], ['회원탈퇴 안내', 'my', 'leave'], ['회원탈퇴 최종 확인', 'my', 'leave2']
      ]],
      ['알림', [['알림 목록', 'alerts', ''], ['알림 없음', 'alerts', 'empty']]]
    ];
    const s = this.state;
    const go = (screen, variant) => this.setState({ screen, variant: variant || '' });
    const patch = (o) => this.setState({ data: { ...this.state.data, ...o } });
    const is = {};
    for (const b of BUILT) is[b] = s.screen === b;
    let cur = '';
    const groups = CAT.map(([title, items]) => ({
      title,
      items: items.map(([label, screen, variant]) => {
        const active = s.screen === screen && s.variant === variant;
        if (active) cur = label;
        const todo = !BUILT.includes(screen);
        return { label, cls: 'it' + (active ? ' on' : '') + (todo ? ' todo' : ''), go: () => go(screen, variant) };
      })
    }));
    return { is, go, patch, restart: () => go('start'), groups, data: s.data, variant: s.variant, missing: !BUILT.includes(s.screen), currentLabel: cur || s.screen };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div style={{display: "flex", width: "393px", height: "852px"}}>
      <div style={{position: "relative", width: "393px", height: "852px", overflow: "hidden", flex: "none"}}>
        {!!v.is.splash && (
          <>
          <Splash onGo={v.go} />
          </>
        )}
        {!!v.is.start && (
          <>
          <Start onGo={v.go} />
          </>
        )}
        {!!v.is.signup && (
          <>
          <Signup variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.login && (
          <>
          <Login variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.pwfind && (
          <>
          <PwFind variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.intro && (
          <>
          <Intro variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.setup && (
          <>
          <Setup variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.home && (
          <>
          <Home variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.sim && (
          <>
          <Sim variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.peg && (
          <>
          <Peg variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.drawer && (
          <>
          <Drawer variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.my && (
          <>
          <My variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.is.alerts && (
          <>
          <Alerts variant={v.variant} data={v.data} onGo={v.go} onPatch={v.patch} />
          </>
        )}
        {!!v.missing && (
          <>
          <div className="sc ph-scr">
            <div style={{fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "20px", lineHeight: "28px"}}>
              {v.currentLabel}
            </div>
            <div className="sub">
              이 화면은 아직 만드는 중이에요.
            </div>
            <button type="button" className="tl lnk" style={{marginTop: "12px", textDecoration: "underline"}} onClick={v.restart}>
              처음으로
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  </>
));
