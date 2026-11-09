// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Signup.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = this.initial('');
  }
  initial(v) {
    if (v === 'error') return { email: 'already@email.com', pw: '1234', nick: '중복닉네임', show: false, modal: false,
      errs: { email: '이미 가입된 이메일이에요', pw: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 해요', nick: '이미 사용 중인 닉네임이에요' } };
    if (v === 'modal') return { email: 'already@email.com', pw: 'password1', nick: '', show: false, modal: true, errs: {} };
    return { email: '', pw: '', nick: '', show: false, modal: false, errs: {} };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) { this._v = v; this.state = this.initial(v); }
  }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props;
    const set = (k) => (e) => { const errs = { ...s.errs }; delete errs[k]; this.setState({ [k]: e.target.value, errs }); };
    const filled = !!(s.email && s.pw && s.nick);
    const box = (k) => 'inp' + (s.errs[k] ? ' err' : '');
    return {
      email: s.email, pw: s.pw, nick: s.nick, errs: s.errs, modal: s.modal,
      emailCls: box('email'), pwCls: box('pw'), nickCls: box('nick'),
      pwType: s.show ? 'text' : 'password', noPwErr: !s.errs.pw,
      btnVariant: filled ? 'primary' : 'inactive',
      setEmail: set('email'), setPw: set('pw'), setNick: set('nick'),
      toggleShow: () => this.setState({ show: !s.show }),
      closeModal: () => this.setState({ modal: false }),
      toLogin: () => { if (p.onGo) p.onGo('login'); },
      back: () => { if (p.onGo) p.onGo('start'); },
      social: () => { if (p.onPatch) p.onPatch({ email: 'social@kakao.com', nick: '위투', social: true }); if (p.onGo) p.onGo('intro', '1'); },
      submit: () => {
        if (!filled) return;
        const errs = {};
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) errs.email = '이메일 형식을 확인해 주세요';
        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(s.pw)) errs.pw = '비밀번호는 8자 이상, 영문과 숫자를 포함해야 해요';
        if (s.nick.length < 2 || s.nick.length > 12) errs.nick = '닉네임은 2자 이상 12자 이하로 입력해 주세요';
        else if (s.nick === '중복닉네임') errs.nick = '이미 사용 중인 닉네임이에요';
        if (!errs.email && s.email === 'already@email.com') { this.setState({ errs, modal: true }); return; }
        if (Object.keys(errs).length) { this.setState({ errs }); return; }
        if (p.onPatch) p.onPatch({ email: s.email, pw: s.pw, nick: s.nick, social: false });
        if (p.onGo) p.onGo('intro', '1');
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
          회원가입
        </h1>
      </div>
      <div className="ct">
        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
          <div className="fld">
            <label htmlFor="su-email">
              이메일
            </label>
            <div className={v.emailCls}>
              <input id="su-email" type="email" placeholder="example@email.com" value={v.email} onChange={v.setEmail} />
            </div>
            {!!v.errs.email && (
              <>
              <div className="hlp err">
                <span className="ic-err" />
                {v.errs.email}
              </div>
              </>
            )}
          </div>
          <div className="fld">
            <label htmlFor="su-pw">
              비밀번호
            </label>
            <div className={v.pwCls}>
              <input id="su-pw" type={v.pwType} value={v.pw} onChange={v.setPw} />
              <button type="button" className="ic-eye" aria-label="비밀번호 보기" onClick={v.toggleShow} />
            </div>
            {!!v.errs.pw && (
              <>
              <div className="hlp err">
                <span className="ic-err" />
                {v.errs.pw}
              </div>
              </>
            )}
            {!!v.noPwErr && (
              <>
              <div className="hlp">
                8자 이상, 영문과 숫자를 포함해 주세요
              </div>
              </>
            )}
          </div>
          <div className="fld">
            <label htmlFor="su-nick">
              닉네임
            </label>
            <div className={v.nickCls}>
              <input id="su-nick" type="text" placeholder="2~12자로 입력해 주세요" value={v.nick} onChange={v.setNick} />
            </div>
            {!!v.errs.nick && (
              <>
              <div className="hlp err">
                <span className="ic-err" />
                {v.errs.nick}
              </div>
              </>
            )}
          </div>
        </div>
        <WitooDS.Button variant={v.btnVariant} onClick={v.submit}>
          회원가입
        </WitooDS.Button>
        <div className="dv">
          또는 간편하게 가입하기
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
          <button className="sb" type="button" onClick={v.social}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="#FEE500" />
              <path fill="#191919" d="M12 5.500c-4.100 0-7.400 2.600-7.400 5.800 0 2.100 1.400 3.900 3.500 4.900l-.8 2.800c-.1.300.2.500.5.300l3.300-2.200c.3 0 .6.100.9.100 4.100 0 7.400-2.600 7.400-5.900S16.100 5.500 12 5.500z" />
            </svg>
            카카오로 시작하기
          </button>
          <button className="sb" type="button" onClick={v.social}>
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.500c3.540 0 6.710 1.220 9.210 3.600l6.850-6.850C35.900 2.380 30.470 0 24 0 14.620 0 6.510 5.380 2.560 13.220l7.980 6.190C12.430 13.720 17.740 9.500 24 9.500z" />
              <path fill="#4285F4" d="M46.980 24.550c0-1.570-.15-3.090-.38-4.550H24v9.020h12.940c-.58 2.960-2.260 5.480-4.780 7.180l7.730 6c4.510-4.180 7.090-10.360 7.090-17.650z" />
              <path fill="#FBBC05" d="M10.530 28.590c-.48-1.450-.76-2.990-.76-4.590s.27-3.140.76-4.590l-7.980-6.190C.92 16.460 0 20.120 0 24c0 3.880.92 7.540 2.560 10.780l7.970-6.190z" />
              <path fill="#34A853" d="M24 48c6.480 0 11.930-2.130 15.890-5.810l-7.730-6c-2.150 1.450-4.920 2.300-8.160 2.300-6.260 0-11.570-4.220-13.470-9.910l-7.980 6.190C6.510 42.620 14.620 48 24 48z" />
            </svg>
            구글로 시작하기
          </button>
        </div>
      </div>
      {!!v.modal && (
        <>
        <div className="ov" />
        <div className="md" style={{top: "271px"}} role="dialog" aria-label="이미 가입된 계정이 있어요">
          <h2>
            이미 가입된 계정이 있어요
          </h2>
          <p>
            같은 이메일로 가입한 계정이 있어서
            <br />
            새로 만들지 않고, 기존 계정으로
            <br />
            로그인해 주세요.
          </p>
          <div className="ac">
            <WitooDS.Button variant="primary" onClick={v.toLogin}>
              로그인하러 가기
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
