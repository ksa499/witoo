// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Login.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = this.initial('');
  }
  initial(v) {
    const b = { email: '', pw: '', show: false, err: '', modal: false, auth: false };
    if (v === 'error') return { ...b, email: 'user@example.com', pw: 'wrong1234', err: '이메일 또는 비밀번호를 확인해 주세요' };
    if (v === 'modal') return { ...b, email: 'new@email.com', pw: 'password1', modal: true };
    if (v === 'auth') return { ...b, auth: true };
    return b;
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = this.initial(v); }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, d = p.data || {};
    const go = (a, b) => () => { if (p.onGo) p.onGo(a, b); };
    const set = (k) => (e) => this.setState({ [k]: e.target.value, err: '' });
    const filled = !!(s.email && s.pw);
    const social = this.props.variant === 'modal';
    return {
      email: s.email, pw: s.pw, err: s.err, modal: s.modal, auth: s.auth,
      emailCls: 'inp', pwCls: 'inp' + (s.err ? ' err' : ''),
      pwType: s.show ? 'text' : 'password',
      btnVariant: filled ? 'primary' : 'inactive',
      kakaoLabel: social ? '카카오로 로그인' : '카카오로 시작하기', googleLabel: social ? '구글로 로그인' : '구글로 시작하기',
      setEmail: set('email'), setPw: set('pw'),
      fillEmail: () => { if (!s.email) this.setState({ email: 'user@example.com', err: '' }); },
      fillPw: () => { if (!s.pw) this.setState({ pw: 'password1', err: '' }); },
      toggleShow: () => this.setState({ show: !s.show }),
      closeModal: () => this.setState({ modal: false }),
      retry: () => this.setState({ auth: false }),
      social: () => this.setState({ auth: true }),
      back: go('start'), toPw: go('pwfind'), toSignup: go('signup'),
      submit: () => {
        if (!filled) return;
        const accounts = { 'user@example.com': 'password1' };
        if (d.email && d.pw) accounts[d.email] = d.pw;
        if (!(s.email in accounts)) { this.setState({ modal: true }); return; }
        if (accounts[s.email] !== s.pw) { this.setState({ err: '이메일 또는 비밀번호를 확인해 주세요' }); return; }
        if (p.onPatch) p.onPatch({ email: s.email, nick: d.nick || '위투', loggedIn: true });
        if (p.onGo) p.onGo(d.setupDone ? 'home' : 'intro', d.setupDone ? '' : '1');
      }
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
          로그인
        </h1>
      </div>
      <div className="ct">
        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
          <div className="fld">
            <label htmlFor="li-email">
              이메일
            </label>
            <div className={v.emailCls}>
              <input id="li-email" type="email" placeholder="example@email.com" value={v.email} onChange={v.setEmail} onFocus={v.fillEmail} />
            </div>
          </div>
          <div className="fld">
            <label htmlFor="li-pw">
              비밀번호
            </label>
            <div className={v.pwCls}>
              <input id="li-pw" type={v.pwType} value={v.pw} onChange={v.setPw} onFocus={v.fillPw} />
              <button type="button" className="ic-eye" aria-label="비밀번호 보기" onClick={v.toggleShow} />
            </div>
            {!!v.err && (
              <>
              <div className="hlp err">
                <span className="ic-err" />
                {v.err}
              </div>
              </>
            )}
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "14px", alignItems: "stretch"}}>
          <WitooDS.Button variant={v.btnVariant} onClick={v.submit}>
            로그인
          </WitooDS.Button>
          <button type="button" className="tl lnk" onClick={v.toPw}>
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <div className="dv">
          또는 간편하게 로그인하기
        </div>
        {!!v.auth && (
          <>
          <div className="bn">
            <span className="ic-err" />
            <span className="t">
              인증에 실패했어요. 잠시 후 다시 시도해 주세요
            </span>
            <button type="button" onClick={v.retry}>
              다시 시도
            </button>
          </div>
          </>
        )}
        <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
          <button className="sb" type="button" onClick={v.social}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="#FEE500" />
              <path fill="#191919" d="M12 5.500c-4.100 0-7.400 2.600-7.400 5.800 0 2.100 1.400 3.900 3.500 4.900l-.8 2.800c-.1.300.2.500.5.300l3.300-2.200c.3 0 .6.100.9.100 4.100 0 7.400-2.600 7.400-5.900S16.100 5.500 12 5.500z" />
            </svg>
            {v.kakaoLabel}
          </button>
          <button className="sb" type="button" onClick={v.social}>
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.500c3.540 0 6.710 1.220 9.210 3.600l6.850-6.850C35.900 2.380 30.470 0 24 0 14.620 0 6.510 5.380 2.560 13.220l7.980 6.190C12.430 13.720 17.740 9.500 24 9.500z" />
              <path fill="#4285F4" d="M46.980 24.550c0-1.570-.15-3.090-.38-4.550H24v9.020h12.940c-.58 2.960-2.260 5.480-4.780 7.180l7.730 6c4.510-4.180 7.090-10.360 7.090-17.650z" />
              <path fill="#FBBC05" d="M10.530 28.590c-.48-1.450-.76-2.990-.76-4.590s.27-3.140.76-4.590l-7.980-6.190C.92 16.460 0 20.120 0 24c0 3.880.92 7.540 2.560 10.780l7.970-6.190z" />
              <path fill="#34A853" d="M24 48c6.480 0 11.930-2.130 15.890-5.810l-7.730-6c-2.150 1.450-4.920 2.300-8.160 2.300-6.260 0-11.570-4.220-13.470-9.910l-7.980 6.190C6.510 42.620 14.620 48 24 48z" />
            </svg>
            {v.googleLabel}
          </button>
        </div>
        <div style={{display: "flex", justifyContent: "center", gap: "8px", fontSize: "16px", lineHeight: "24px"}}>
          <span style={{color: "var(--gray-600)"}}>
            아직 회원이 아니신가요?
          </span>
          <button type="button" className="tl" style={{fontWeight: "600", color: "var(--gray-900)"}} onClick={v.toSignup}>
            회원가입
          </button>
        </div>
      </div>
      {!!v.modal && (
        <>
        <div className="ov" />
        <div className="md c" style={{top: "258px"}} role="dialog" aria-label="가입되지 않은 계정이에요">
          <div className="info">
            i
          </div>
          <h2>
            가입되지 않은 계정이에요
          </h2>
          <p>
            아직 가입 전이라면
            <br />
            회원가입 후 이용할 수 있어요.
          </p>
          <div className="ac">
            <WitooDS.Button variant="primary" onClick={v.toSignup}>
              회원가입하기
            </WitooDS.Button>
            <WitooDS.Button variant="outline" onClick={v.closeModal}>
              닫기
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
