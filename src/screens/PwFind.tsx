// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './PwFind.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = this.initial('');
  }
  initial(v) {
    const b = { step: 'email', email: '', err: '', pw: '', pw2: '', show: false, errPw: '', errPw2: '', resent: false };
    if (v === 'error') return { ...b, email: 'already@email.com', err: '이메일로 가입한 회원만 이용할 수 있어요' };
    if (v === 'sent') return { ...b, step: 'sent', email: 'user@example.com' };
    if (v === 'reset') return { ...b, step: 'reset' };
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
    const set = (k, e2) => (e) => this.setState({ [k]: e.target.value, [e2]: '' });
    return {
      is: { email: s.step === 'email', sent: s.step === 'sent', reset: s.step === 'reset' },
      title: s.step === 'reset' ? '새 비밀번호 설정' : '비밀번호 찾기',
      email: s.email, err: s.err, pw: s.pw, pw2: s.pw2, errPw: s.errPw, errPw2: s.errPw2,
      emailCls: 'inp' + (s.err ? ' err' : ''), pwCls: 'inp' + (s.errPw ? ' err' : ''), pw2Cls: 'inp' + (s.errPw2 ? ' err' : ''),
      pwType: s.show ? 'text' : 'password', noPwErr: !s.errPw,
      btnVariant: s.email ? 'primary' : 'inactive',
      resetVariant: s.pw && s.pw2 ? 'primary' : 'inactive',
      resendLabel: s.resent ? '메일을 다시 보냈어요' : '메일 다시 보내기',
      setEmail: set('email', 'err'), setPw: set('pw', 'errPw'), setPw2: set('pw2', 'errPw2'),
      toggleShow: () => this.setState({ show: !s.show }),
      back: () => {
        if (s.step === 'email') { if (p.onGo) p.onGo('login'); } else this.setState({ step: 'email' });
      },
      send: () => {
        if (!s.email) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) { this.setState({ err: '이메일 형식을 확인해 주세요' }); return; }
        if (s.email === 'already@email.com') { this.setState({ err: '이메일로 가입한 회원만 이용할 수 있어요' }); return; }
        this.setState({ step: 'sent', resent: false });
      },
      resend: () => this.setState({ resent: true }),
      toLogin: go('login'),
      toReset: () => this.setState({ step: 'reset', pw: '', pw2: '' }),
      change: () => {
        if (!(s.pw && s.pw2)) return;
        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(s.pw)) { this.setState({ errPw: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 해요' }); return; }
        if (s.pw !== s.pw2) { this.setState({ errPw2: '비밀번호가 일치하지 않아요' }); return; }
        if (p.onPatch) p.onPatch({ pw: s.pw, email: d.email || s.email });
        if (p.onGo) p.onGo('login');
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
          {v.title}
        </h1>
      </div>
      {!!v.is.email && (
        <>
        <div className="ct">
          <h2 className="hdg">
            가입한 이메일로
            <br />
            인증 메일을 보내 드려요
          </h2>
          <div className="fld">
            <label htmlFor="pf-email">
              이메일
            </label>
            <div className={v.emailCls}>
              <input id="pf-email" type="email" placeholder="example@email.com" value={v.email} onChange={v.setEmail} />
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
          <WitooDS.Button variant={v.btnVariant} onClick={v.send}>
            인증 메일 보내기
          </WitooDS.Button>
          <div className="col" style={{alignItems: "center", gap: "4px"}}>
            <span className="lnk" style={{color: "var(--gray-600)"}}>
              이메일이 기억나지 않으시나요?
            </span>
            <button type="button" className="tl lnk" style={{fontWeight: "600", textDecoration: "underline"}}>
              고객센터 문의하기
            </button>
          </div>
        </div>
        </>
      )}
      {!!v.is.sent && (
        <>
        <div className="ill" style={{position: "absolute", left: "101px", top: "164px"}} />
        <div className="ct ctr" style={{top: "380px"}}>
          <div className="col" style={{gap: "12px"}}>
            <h2 className="hdg">
              인증 메일을 보냈어요
            </h2>
            <div className="sub">
              메일함을 확인해 주세요.
              <br />
              인증 메일은 30분 동안 유효해요.
            </div>
          </div>
          <div className="col" style={{gap: "12px"}}>
            <WitooDS.Button variant="outline" onClick={v.resend}>
              {v.resendLabel}
            </WitooDS.Button>
            <WitooDS.Button variant="primary" onClick={v.toLogin}>
              로그인으로 돌아가기
            </WitooDS.Button>
          </div>
          <button type="button" className="tl lnk" style={{color: "var(--gray-500)"}} onClick={v.toReset}>
            (프로토타입) 메일 속 링크 열기
          </button>
        </div>
        </>
      )}
      {!!v.is.reset && (
        <>
        <div className="ct">
          <h2 className="hdg">
            새롭게 사용할
            <br />
            비밀번호를 입력해 주세요
          </h2>
          <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <div className="fld">
              <label htmlFor="pf-pw">
                새 비밀번호
              </label>
              <div className={v.pwCls}>
                <input id="pf-pw" type={v.pwType} value={v.pw} onChange={v.setPw} />
                <button type="button" className="ic-eye" aria-label="비밀번호 보기" onClick={v.toggleShow} />
              </div>
              {!!v.errPw && (
                <>
                <div className="hlp err">
                  <span className="ic-err" />
                  {v.errPw}
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
              <label htmlFor="pf-pw2">
                새 비밀번호 확인
              </label>
              <div className={v.pw2Cls}>
                <input id="pf-pw2" type={v.pwType} placeholder="비밀번호를 한 번 더 입력해 주세요" value={v.pw2} onChange={v.setPw2} />
              </div>
              {!!v.errPw2 && (
                <>
                <div className="hlp err">
                  <span className="ic-err" />
                  {v.errPw2}
                </div>
                </>
              )}
            </div>
          </div>
          <WitooDS.Button variant={v.resetVariant} onClick={v.change}>
            비밀번호 변경하기
          </WitooDS.Button>
        </div>
        </>
      )}
    </div>
  </>
));
