// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import './Splash.css';

class Component extends DCLogic {
  componentDidMount() {
    this.t = setTimeout(() => { if (this.props.onGo) this.props.onGo('start'); }, 1600);
  }
  componentWillUnmount() { clearTimeout(this.t); }
  renderVals() { return {}; }
}

export default makeScreen(Component, (v) => (
  <>
    <div className="sc" style={{background: "var(--primary-500)"}}>
      <img src="/img/splash-logo.svg" alt="Witoo" style={{position: "absolute", left: "135px", top: "405px", width: "133px", height: "67px"}} />
    </div>
  </>
));
