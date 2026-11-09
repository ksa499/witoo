// @ts-nocheck
// Tiny adapter that lets the converted screens keep their original
// "class with renderVals()" logic while rendering as normal React components.
import { useEffect, useRef, useState } from 'react';

export class DCLogic {
  props: any;
  state: any = {};
  _update: () => void = () => {};
  constructor(props: any) { this.props = props; }
  setState(patch: any) {
    const next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = { ...this.state, ...next };
    this._update();
  }
}

export function makeScreen(Cls: any, render: (v: any) => any) {
  return function Screen(props: any) {
    const [, setTick] = useState(0);
    const ref = useRef<any>(null);
    if (!ref.current) {
      ref.current = new Cls(props);
      ref.current._update = () => setTick((t) => t + 1);
    }
    const inst = ref.current;
    inst.props = props;
    useEffect(() => {
      inst.componentDidMount && inst.componentDidMount();
      return () => { inst.componentWillUnmount && inst.componentWillUnmount(); inst._update = () => {}; };
    }, []);
    return render(inst.renderVals());
  };
}

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
/** "left:0; top:10px" -> { left: '0', top: '10px' } */
export function css(str: any) {
  if (!str) return undefined;
  if (typeof str === 'object') return str;
  const o: any = {};
  String(str).split(';').forEach((d) => {
    const i = d.indexOf(':');
    if (i < 0) return;
    const k = d.slice(0, i).trim(), val = d.slice(i + 1).trim();
    if (k) o[k.startsWith('--') ? k : camel(k)] = val;
  });
  return o;
}
