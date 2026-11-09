// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Setup.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = { sel: [] };
  }
  sync() {
    const v = this.props.variant || '';
    if (v !== this._v) {
      this._v = v;
      const own = (this.props.data && this.props.data.owned) || [];
      this.state = { sel: v === 'picked' ? ['washer', 'air-conditioner'] : own.slice() };
    }
  }
  renderVals() {
    this.sync();
    const p = this.props, sel = this.state.sel;
    const LIST = [
      ['washer', '세탁기', '/img/washer.svg'], ['fridge', '냉장고', '/img/fridge.svg'], ['air-conditioner', '에어컨', '/img/air-conditioner.svg'],
      ['microwave', '전자레인지', '/img/microwave.svg'], ['air-purifier', '공기청정기', '/img/air-purifier.svg'], ['robot-vacuum', '로봇청소기', '/img/robot-vacuum.svg'],
      ['dryer', '건조기', '/img/dryer.svg'], ['dishwasher', '식기세척기', '/img/dishwasher.svg'], ['vacuum', '청소기', '/img/vacuum.svg']
    ];
    const items = LIST.map(([id, name, blob]) => {
      const on = sel.indexOf(id) >= 0;
      return { name, icon: blob, cls: 'ap' + (on ? ' on' : ''), pressed: on ? 'true' : 'false',
        toggle: () => this.setState({ sel: on ? sel.filter((x) => x !== id) : sel.concat(id) }) };
    });
    return {
      items, count: sel.length, btnVariant: sel.length ? 'primary' : 'inactive',
      back: () => { if (p.onGo) p.onGo('intro', '3'); },
      done: () => {
        if (!sel.length) return;
        if (p.onPatch) p.onPatch({ owned: sel, ownedSet: true, setupDone: true });
        if (p.onGo) p.onGo('home');
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
          내 방 만들기
        </h1>
      </div>
      <div className="ct" style={{gap: "16px"}}>
        <div className="col" style={{gap: "8px"}}>
          <h2 className="hdg">
            내 방에 있는 가전을 골라 주세요
          </h2>
          <div className="sub" style={{color: "var(--gray-600)"}}>
            고른 가전은 정기점검 대상이 돼요. 싱크대, 변기, 창문, 문 같은 기본 설비는 고르지 않아도 항상 방에 있어요.
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "32px"}}>
          <span className="sub" style={{color: "var(--gray-600)"}}>
            고른 가전
          </span>
          <span style={{fontWeight: "600", color: "var(--primary-600)"}}>
            {v.count}개
          </span>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 110px)", justifyContent: "space-between", gap: "12px 0"}}>
          {(v.items || []).map((a, __i) => (
            <Fragment key={__i}>
              <button type="button" className={a.cls} aria-pressed={a.pressed} onClick={a.toggle}>
                <span className="ico">
                  <img src={a.icon} alt="" />
                </span>
                <span className="nm">
                  {a.name}
                </span>
                <span className="ck" />
              </button>
            </Fragment>
          ))}
        </div>
        <div style={{fontSize: "14px", lineHeight: "20px", color: "var(--gray-600)", marginTop: "4px"}}>
          하나도 고르지 않아도 시작할 수 있어요. 가전은 내 방에서 나중에 추가하거나 뺄 수 있어요.
        </div>
      </div>
      <div style={{position: "absolute", left: "20px", top: "734px", width: "353px"}}>
        <WitooDS.Button variant={v.btnVariant} onClick={v.done}>
          완료
        </WitooDS.Button>
      </div>
    </div>
  </>
));
