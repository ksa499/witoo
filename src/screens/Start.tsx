// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Start.css';

class Component extends DCLogic {
  renderVals() {
    const go = (s) => () => { if (this.props.onGo) this.props.onGo(s); };
    return { toSignup: go('signup'), toLogin: go('login') };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      <img src="/img/problem.png" alt="" style={{position: "absolute", left: "0", top: "0", width: "393px", height: "452px", objectFit: "cover", objectPosition: "center top"}} />
      <div style={{position: "absolute", left: "20px", top: "484px", width: "353px", display: "flex", flexDirection: "column", gap: "12px"}}>
        <div style={{fontFamily: "var(--font-display)", fontWeight: "700", fontSize: "24px", lineHeight: "32px"}}>
          생활 속 문제,
          <br />
          Witoo가 해결해 드려요
        </div>
        <div className="sub">
          가장 쉬운 방법으로 일상의 문제를 함께 해결하세요.
        </div>
      </div>
      <div style={{position: "absolute", left: "20px", top: "668px", width: "353px", display: "flex", flexDirection: "column", gap: "12px"}}>
        <WitooDS.Button variant="primary" onClick={v.toSignup}>
          회원가입
        </WitooDS.Button>
        <WitooDS.Button variant="outline" onClick={v.toLogin}>
          로그인
        </WitooDS.Button>
      </div>
    </div>
  </>
));
