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
      <div className="hero">
        <div className="hfl" />
        <div className="hsh" />
        <img className="hch" src="/img/face-default.svg" alt="" />
        <img className="hsp" src="/img/tool-sponge.svg" alt="" style={{width: "48px"}} />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "58px", top: "236px", width: "20px", animationDelay: "0s"}} />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "96px", top: "250px", width: "20px", animationDelay: ".8s"}} />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "44px", top: "262px", width: "20px", animationDelay: "1.6s"}} />
        <img className="hwr" src="/img/tool-wrench.svg" alt="" style={{width: "40px"}} />
        <img className="hsk" src="/img/tool-spark.svg" alt="" style={{left: "292px", top: "196px", width: "24px"}} />
        <img className="hsk" src="/img/tool-spark.svg" alt="" style={{left: "322px", top: "222px", width: "18px", animationDelay: ".1s"}} />
      </div>
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
