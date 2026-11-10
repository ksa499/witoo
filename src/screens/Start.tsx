// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Start.css';

class Component extends DCLogic {
  renderVals() {
    const go = (s) => () => { if (this.props.onGo) this.props.onGo(s); };
    return { toSignup: go('intro'), toLogin: go('login') };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc">
      <div className="hero">
        <div className="hfl" />
        <div className="hsh" />
        <div className="hch">
          <img src="/img/face-default.svg" alt="" />
          <img className="hf hf1" src="/img/face-sleepy.svg" alt="" />
          <img className="hf hf2" src="/img/face-happy.svg" alt="" />
          <img className="hf hf3" src="/img/face-wink.svg" alt="" />
        </div>
        <img className="hsp" src="/img/tool-sponge.svg" alt="" />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "46px", top: "222px"}} />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "92px", top: "236px", animationDelay: ".8s"}} />
        <img className="hbb" src="/img/tool-bubble.svg" alt="" style={{left: "34px", top: "250px", animationDelay: "1.6s"}} />
        <img className="hwr" src="/img/tool-wrench.svg" alt="" />
        <img className="hsk" src="/img/tool-spark.svg" alt="" style={{left: "300px", top: "176px"}} />
        <img className="hsk" src="/img/tool-spark.svg" alt="" style={{left: "330px", top: "210px", animationDelay: ".1s"}} />
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
