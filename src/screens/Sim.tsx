// @ts-nocheck
import { Fragment } from 'react';
import { DCLogic, makeScreen, css } from '../dc';
import { WitooDS } from '../ds/witoo';
import './Sim.css';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this._v = null;
    this.state = { stage: 'intro', i: 0, pick: -1, picks: [], end: '', collected: [] };
  }
  AC() { return !!(this.props.data && this.props.data.simFrom === 'air-conditioner'); }
  STEPS() {
    const F = { cry: '/img/face-cry.svg', sad: '/img/face-sad.svg', confused: '/img/face-confused.svg', normal: '/img/face-default.svg', happy: '/img/face-happy.svg' };
    if (this.AC()) return [
      { title: '냄새의 원인 확인하기', face: F.cry, talk: '에어컨을 켜자 퀴퀴한 냄새가 납니다. 바람은 정상적으로 나오지만 냄새가 계속됩니다. 가장 먼저 무엇을 해야 할까요?', choices: [
        { text: '에어컨을 끄고 필터를 확인한다.', kind: 'ok', res: '필터에 먼지가 쌓여 있는 것을 발견했습니다. 냄새의 원인을 확인하기 위해 필터와 내부 상태를 더 살펴볼 필요가 있습니다.' },
        { text: '온도를 최저로 낮춰 작동한다.', kind: 'bad', res: '찬바람이 강하게 나오지만 퀴퀴한 냄새는 여전합니다. 온도를 낮추는 것만으로는 냄새의 원인을 제거할 수 없습니다.' },
        { text: '송풍구에 방향제를 뿌린다.', kind: 'fail', fail: 1, res: '방향제 성분이 내부 부품에 묻어 오염이나 손상을 유발할 수 있습니다. 냄새의 원인도 해결되지 않았습니다.' }] },
      { title: '필터 청소하기', face: F.sad, talk: '에어컨 필터에 먼지가 두껍게 쌓여 있습니다. 먼지를 제거하기 위해 어떻게 청소해야 할까요?', choices: [
        { text: '필터를 분리해 세척한다.', kind: 'ok', res: '물세척이 가능한 먼지 필터의 오염을 제거했습니다. 이제 필터를 충분히 건조해야 합니다.' },
        { text: '청소기로 겉면의 먼지만 제거한다.', kind: 'weak', res: '겉면의 먼지는 줄었지만 필터 안쪽에 쌓인 오염까지 충분히 제거했는지 확인하기 어렵습니다.' },
        { text: '에어컨 작동 중 필터를 청소한다.', kind: 'fail', fail: 2, res: '작동 중인 에어컨의 내부 부품에 접촉할 위험이 생겼습니다. 안전한 청소 방법을 지키지 못했습니다.' }] },
      { title: '필터 건조하기', face: F.confused, talk: '필터 청소를 마쳤지만 아직 물기가 남아 있습니다. 에어컨에 다시 장착하기 전에 어떻게 해야 할까요?', choices: [
        { text: '직사광선 아래에서 말린다.', kind: 'weak', res: '필터가 빠르게 마르기 시작했지만 강한 햇빛과 열에 장시간 노출되면 일부 필터가 변형될 수 있습니다.' },
        { text: '통풍이 잘되는 그늘에서 말린다.', kind: 'ok', res: '필터가 변형될 위험을 줄이면서 물기를 제거했습니다. 이제 에어컨에 다시 장착할 수 있습니다.' },
        { text: '물기가 남은 채로 장착한다.', kind: 'fail', fail: 3, res: '필터에 남은 습기가 내부 오염과 냄새를 유발할 수 있습니다. 필터를 충분히 건조하지 않아 관리에 실패했습니다.' }] },
      { title: '에어컨 내부 관리하기', face: F.normal, talk: '필터 청소를 마쳤지만 에어컨을 켜보니 아직 퀴퀴한 냄새가 남아 있습니다. 내부에 남은 습기와 오염이 원인일 수 있습니다. 어떻게 해야 할까요?', choices: [
        { text: '내부에 세정제를 직접 뿌린다.', kind: 'fail', fail: 4, res: '전용 제품인지 확인하지 않은 세정제가 내부 부품에 닿아 손상이나 추가 오염을 일으킬 수 있습니다.' },
        { text: '환기하며 냄새 제거 운전을 한다.', kind: 'ok', res: '설명서에 따른 냄새 제거 운전을 통해 내부의 냄새와 습기를 줄이기 시작했습니다. 냄새가 완전히 사라졌는지 추가 확인이 필요합니다.' },
        { text: '냄새가 나는 송풍구를 테이프로 막는다.', kind: 'bad', res: '공기 흐름이 방해받고 에어컨의 정상적인 작동에도 영향을 줄 수 있습니다. 냄새의 원인은 그대로 남았습니다.' }] },
      { title: '냉방 후 관리하기', face: F.happy, talk: '에어컨 냄새가 어느 정도 줄어들었습니다. 앞으로 냄새가 다시 발생하지 않도록 어떻게 관리해야 할까요?', choices: [
        { text: '사용 후 바로 전원을 끈다.', kind: 'weak', res: '냉방 중 발생한 습기가 내부에 남을 수 있습니다. 냄새가 다시 발생할 가능성이 있습니다.' },
        { text: '송풍 기능으로 내부를 건조한다.', kind: 'ok', res: '내부 습기를 줄여 곰팡이가 번식하기 쉬운 환경을 예방하는 데 도움이 됩니다. 올바른 관리 습관을 익혔습니다.' },
        { text: '최저 온도로 10분 더 작동한다.', kind: 'bad', res: '냉방을 연장해도 내부가 충분히 건조되는 것은 아닙니다. 오히려 냉방 중 발생하는 수분이 남을 수 있습니다.' }] }
    ];
    return [
      { title: '냄새의 원인 확인하기', face: F.cry, talk: '세탁한 옷과 세탁기 내부에서 꿉꿉한 냄새가 납니다. 가장 먼저 무엇을 해야 할까요?', choices: [
        { text: '세제를 더 넣고 다시 세탁한다.', kind: 'bad', res: '세제가 많으면 잔여물이 쌓입니다. 원인은 그대로인 채 세탁만 반복하게 됩니다.' },
        { text: '세탁기 내부와 고무 패킹을 살펴본다.', kind: 'ok', res: '고무 패킹 안쪽에서 물기와 검은 오염을 발견했습니다. 냄새는 내부 오염 때문일 수 있어요.' },
        { text: '냄새를 없애려고 향수를 뿌린다.', kind: 'fail', fail: 1, res: '향수 냄새와 곰팡이 냄새가 뒤섞였고 오염은 그대로 남았습니다.' }] },
      { title: '오염된 부분 청소하기', face: F.sad, talk: '세탁기 내부에 세제 찌꺼기와 검은 오염이 보입니다. 어떻게 청소해야 할까요?', choices: [
        { text: '천으로 고무 패킹과 세제 투입구를 닦는다.', kind: 'ok', res: '패킹 틈새와 투입구의 찌꺼기를 일부 제거했습니다. 내부 세척도 필요해 보입니다.' },
        { text: '샤워기로 세탁기 안에 물을 뿌린다.', kind: 'fail', fail: 2, res: '물이 조작부와 전기 부품 틈으로 들어갈 수 있어 감전·고장 위험으로 청소를 중단했습니다.' },
        { text: '눈에 보이는 먼지만 털고 끝낸다.', kind: 'weak', res: '겉의 먼지만 줄었고 패킹 틈새의 물기와 찌꺼기는 남아 냄새가 계속 올라옵니다.' }] },
      { title: '세탁조 세척 준비하기', face: F.confused, talk: '눈에 보이는 곳은 확인했지만 세탁조 내부에서도 냄새가 납니다. 어떤 방법을 선택할까요?', choices: [
        { text: '세탁조 클리너를 준비하고 설명서를 확인한다.', kind: 'ok', res: '모델에 맞는 세척제와 적정 사용량을 확인했습니다. 세척을 진행할 준비가 되었습니다.' },
        { text: '세탁 세제를 평소보다 많이 넣는다.', kind: 'bad', res: '일반 세제는 세탁조 전용 세척제를 대신하지 못하고, 과하면 잔여물이 남습니다.' },
        { text: '락스와 식초를 섞어 세척제를 만든다.', kind: 'fail', fail: 3, res: '두 제품을 섞으면 유해한 염소가스가 발생합니다. 위험한 혼합으로 즉시 실패합니다.' }] },
      { title: '세탁조 세척하기', face: F.normal, talk: '이제 세탁조를 세척할 차례입니다. 세탁 코스가 다양한데, 어떤 방식으로 청소할까요?', choices: [
        { text: '빈 세탁기로 통세척 코스를 실행한다.', kind: 'ok', res: '세탁조 전용 코스가 내부를 세척합니다. 코스가 끝난 뒤 내부를 확인할 수 있어요.' },
        { text: '빈 세탁기로 표준 코스를 실행한다.', kind: 'weak', res: '물은 받아 작동했지만 전용 세척과는 달라, 냄새의 원인이 남았을 수 있습니다.' },
        { text: '클리너와 오염된 옷을 함께 세탁한다.', kind: 'fail', fail: 4, res: '세척제와 세탁물이 함께 들어가 옷이 손상되고 세척제가 남을 위험이 있어 실패했습니다.' }] },
      { title: '세척 후 관리하기', face: F.happy, talk: '세탁조 세척이 끝났지만 내부에 아직 물기가 남아 있습니다. 어떻게 관리해야 할까요?', choices: [
        { text: '패킹 물기를 닦고 문을 열어 건조한다.', kind: 'ok', res: '남은 물기를 없애고 습기가 빠지게 했습니다. 곰팡이가 생기기 어려운 환경이 됩니다.' },
        { text: '세척이 끝났으니 문을 바로 닫는다.', kind: 'bad', res: '내부에 습기가 남아 시간이 지나면 불쾌한 냄새가 다시 날 가능성이 높습니다.' },
        { text: '마른 천으로 내부만 닦고 문을 닫는다.', kind: 'weak', res: '표면 물기는 줄었지만 패킹 틈새와 투입구에는 습기가 남을 수 있어 추가 건조가 필요해요.' }] }
    ];
  }
  ENDS() {
    if (this.AC()) return {
      success: { chip: '성공', title: '쾌적한 에어컨', text: '필터 청소부터 내부 건조까지 올바르게 완료했습니다.', hole: true, tips: true },
      partial: { chip: '부분 성공', title: '아직 남은 냄새', text: '5단계를 마쳤지만 일부 관리가 미흡해 냄새가 남아 추가 관리가 필요합니다.' },
      bad: { chip: '실패', title: '반복되는 악취', text: '잘못된 선택이 쌓여 냄새의 원인이 해결되지 않았습니다.' },
      fail1: { chip: '실패 결말 01', title: '잘못된 냄새 제거' }, fail2: { chip: '실패 결말 02', title: '위험한 필터 청소' },
      fail3: { chip: '실패 결말 03', title: '건조되지 않은 필터' }, fail4: { chip: '실패 결말 04', title: '무분별한 세정제 사용' }
    };
    return {
      success: { chip: '성공', title: '쾌적한 세탁기', text: '오염 제거와 건조 관리를 올바르게 완료했습니다.', hole: true, tips: true },
      partial: { chip: '부분 성공', title: '아직 남은 문제', text: '세탁기 관리를 시도했지만 냄새의 원인이 충분히 제거되지 않았을 수 있습니다.' },
      bad: { chip: '실패', title: '반복되는 냄새', text: '습기와 오염이 남아 냄새가 다시 발생할 가능성이 높습니다.' },
      fail1: { chip: '실패 결말 01', title: '냄새 위에 냄새' }, fail2: { chip: '실패 결말 02', title: '잘못된 물청소' },
      fail3: { chip: '실패 결말 03', title: '위험한 세제 혼합' }, fail4: { chip: '실패 결말 04', title: '세탁물 손상 위험' }
    };
  }
  // 성공: 1~4단계 모두 올바른 선택 + 5단계 A. 5단계 B 또는 올바르지 않은 선택이 3개 이상이면 실패, 그 사이는 부분 성공.
  finalEnd(picks) {
    const S = this.STEPS();
    const kinds = S.map((st, n) => st.choices[picks[n]].kind);
    if (kinds[4] === 'bad') return 'bad';
    const off = kinds.filter((k) => k !== 'ok').length;
    return off === 0 ? 'success' : off >= 3 ? 'bad' : 'partial';
  }
  sync() {
    const v = this.props.variant || 'intro';
    if (v === this._v) return;
    this._v = v;
    clearTimeout(this.auto);
    const M = {
      intro: { stage: 'intro' }, start: { stage: 'q' }, 'start-none': { stage: 'p' }, 'start-pick': { stage: 'p', pick: 0 },
      mid: { stage: 'fb', pick: 0, picks: [0] }, 'fb-ok': { stage: 'fb', pick: 1, picks: [1] },
      'step-none': { stage: 'p', i: 1, picks: [1] }, 'step-pick': { stage: 'p', i: 1, picks: [1], pick: 1 },
      step3: { stage: 'p', i: 2, picks: [1, 0] }, step4: { stage: 'p', i: 3, picks: [1, 0, 0] }, step5: { stage: 'p', i: 4, picks: [1, 0, 0, 0] },
      'fb-fail': { stage: 'fb', i: 2, pick: 2, picks: [1, 0, 2] }, fb5: { stage: 'fb', i: 4, pick: 0, picks: [1, 0, 0, 0, 0] },
      result: { stage: 'result', end: 'success' }, 'end-partial': { stage: 'result', end: 'partial' }, 'end-bad': { stage: 'result', end: 'bad' },
      fail1: { stage: 'result', end: 'fail1', picks: [2], i: 0, pick: 2 }, fail2: { stage: 'result', end: 'fail2', picks: [1, 1], i: 1, pick: 1 },
      fail3: { stage: 'result', end: 'fail3', picks: [1, 0, 2], i: 2, pick: 2 }, fail4: { stage: 'result', end: 'fail4', picks: [1, 0, 0, 2], i: 3, pick: 2 }
    };
    this.state = Object.assign({ stage: 'intro', i: 0, pick: -1, picks: [], end: '', collected: [] }, M[v] || M.intro);
    this.schedule(this.state.stage);
  }
  schedule(stage) {
    clearTimeout(this.auto);
    if (stage === 'q') this.auto = setTimeout(() => { if (this.state.stage === 'q') this.setState({ stage: 'p', pick: -1 }); }, 2000);
    if (stage === 'fb') this.auto = setTimeout(() => {
      const s = this.state; if (s.stage !== 'fb') return;
      const cur = (this.STEPS()[s.i] || {}).choices ? this.STEPS()[s.i].choices[s.pick] : null; if (!cur) return;
      if (cur.kind === 'fail') this.to('result', { end: 'fail' + cur.fail });
      else if (s.i >= 4) this.to('result', { end: this.finalEnd(s.picks) });
      else this.to('q', { i: s.i + 1, pick: -1 });
    }, 4500);
  }
  componentWillUnmount() { clearTimeout(this.auto); }
  to(stage, extra) { this.setState(Object.assign({ stage }, extra || {})); this.schedule(stage); }
  renderVals() {
    this.sync();
    const s = this.state, p = this.props, d = p.data || {};
    const go = (a, b) => { if (p.onGo) p.onGo(a, b); };
    const ST = this.STEPS();
    const q = ST[s.i] || ST[0];
    const isGame = ['q', 'p', 'fb'].indexOf(s.stage) >= 0;
    const isPick = s.stage === 'p', fb = s.stage === 'fb';
    const B = (id) => id;
    const choices = q.choices.map((c, n) => ({ text: c.text, sel: s.pick === n, pick: () => this.setState({ pick: n }) }));
    const A = this.AC();
    const TIPS = A ? ['필터를 분리해\n물세척한다.', '송풍 기능으로\n내부를 건조한다.'] : ['천으로 고무 패킹과\n세제 투입구를 닦는다.', '세탁기 내부와\n고무 패킹을 살핀다.'];
    const cur = s.pick >= 0 ? q.choices[s.pick] : null;
    const FBFACE = { ok: '/img/face-happy.svg', weak: '/img/face-confused.svg', bad: '/img/face-sad.svg', fail: '/img/face-dizzy.svg' };
    const END = Object.assign({}, this.ENDS()[s.end] || {});
    if (/^fail/.test(s.end)) END.text = ST[s.i].choices[s.pick].res;
    const win = s.end === 'success';
    const ACI = {"problem": "/img/acsim_problem.png", "filter": "/img/acsim_filter.png", "cold": "/img/acsim_cold.png", "perfume": "/img/acsim_perfume.png", "wash": "/img/acsim_wash.png", "vac": "/img/acsim_vac.png", "shock": "/img/acsim_shock.png", "sun": "/img/acsim_sun.png", "shade": "/img/acsim_shade.png", "wet": "/img/acsim_wet.png", "spray": "/img/acsim_spray.png", "vent": "/img/acsim_vent.png", "tape": "/img/acsim_tape.png", "off": "/img/acsim_off.png", "fan": "/img/acsim_fan.png", "clean": "/img/acsim_clean.png", "partial": "/img/acsim_partial.png"};
    const IM = A ? ACI : {"problem": "/img/problem.png", "foam": "/img/foam.png", "clean": "/img/clean.png", "cleanR": "/img/clean-result.png", "cleaner": "/img/cleaner.png", "perfume": "/img/perfume.png", "wipe": "/img/wipe.png", "shock": "/img/shock.png", "gas": "/img/gas.png", "damage": "/img/damage.png", "foamEmpty": "/img/foam-empty.png", "partialR": "/img/partial-result.png"};
    const FBS = A ? [['filter', 'cold', 'perfume'], ['wash', 'vac', 'shock'], ['sun', 'shade', 'wet'], ['spray', 'vent', 'tape'], ['off', 'fan', 'cold']] : [['foam', 'problem', 'perfume'], ['wipe', 'shock', 'problem'], ['cleaner', 'foam', 'gas'], ['foamEmpty', 'cleaner', 'damage'], ['clean', 'problem', 'clean']];
    const sceneKey = fb && cur ? FBS[s.i][s.pick] : (A ? ['problem', 'filter', 'wash', 'problem', 'partial'][s.i] : s.i <= 1 ? 'problem' : s.i <= 3 ? 'cleaner' : 'clean');
    const sceneId = IM[sceneKey];
    const ENDIMG = A ? { success: 'clean', partial: 'partial', bad: 'problem', fail1: 'perfume', fail2: 'shock', fail3: 'wet', fail4: 'spray' } : { success: 'cleanR', partial: 'partialR', bad: 'problem', fail1: 'perfume', fail2: 'shock', fail3: 'gas', fail4: 'damage' };
    const endKey = ENDIMG[s.end] || 'problem';
    const advance = () => {
      if (s.stage === 'q') return this.to('p', { pick: -1 });
      if (!fb || !cur) return;
      if (cur.kind === 'fail') return this.to('result', { end: 'fail' + cur.fail });
      if (s.i >= 4) return this.to('result', { end: this.finalEnd(s.picks) });
      this.to('q', { i: s.i + 1, pick: -1 });
    };
    return {
      rootCls: 'sc' + (s.stage === 'intro' || s.stage === 'result' ? ' lt' : ' dk'),
      is: { intro: s.stage === 'intro', result: s.stage === 'result' },
      introImg: B(IM.problem), introImgStyle: 'position:absolute;left:0;top:' + (A ? 0 : -45) + 'px;width:393px;height:432px', introChip: A ? '에어컨' : '세탁', introT1: A ? '에어컨에서' : '세탁기에서', introT2: A ? '퀴퀴한 냄새가 나요' : '곰팡이 냄새가 나요',
      introProb: A ? '오랜만에 에어컨을 켰더니 퀴퀴한 냄새가 납니다. 찬바람은 정상적으로 나오지만 에어컨을 켜둘수록 방 안에 불쾌한 냄새가 퍼집니다.' : '세탁을 마친 후에도 옷에서 꿉꿉한 냄새가 나고, 세탁기 내부에서 불쾌한 곰팡이 냄새가 올라옵니다.',
      introGoal: A ? '에어컨 냄새의 원인을 확인하고 안전하게 청소한 뒤 올바른 관리 방법을 익히기.' : '냄새의 원인을 파악하고 세탁기를 올바르게 청소하여 다시 쾌적하게 사용할 수 있도록 관리하기.',
      isGame, isPick, isTalk: s.stage === 'q', isTap: s.stage === 'q' || fb, isFeedback: fb,
      showSpeech: s.stage === 'q' || isPick, showFace: !isPick,
      gameTitle: q.title, qNo: s.i + 1, qBar: 'width:' + ((s.i + 1) * 20) + '%',
      bgSrc: B(sceneId),
      bgStyle: 'left:0;top:0;width:393px;height:432px;image-rendering:auto',
      faceSrc: B(fb && cur ? FBFACE[cur.kind] : q.face),
      speech: q.talk, speechTap: 'display:none',
      feedback: cur ? cur.res : '',
      choices, hasPrev: isPick && s.i > 0, nextVariant: s.pick >= 0 ? 'primary' : 'inactive',
      advance,
      prev: () => this.to('fb', { i: s.i - 1, pick: s.picks[s.i - 1] }),
      next: () => {
        if (s.pick < 0) return;
        const picks = s.picks.slice(); picks[s.i] = s.pick;
        this.to('fb', { picks });
      },
      begin: () => this.to('q', { i: 0, pick: -1, picks: [] }),
      toHome: () => go('home'),
      endChip: END.chip || '', endTitle: END.title || '', endText: END.text || '', endHole: !!END.hole, endTips: !!END.tips,
      endBgSrc: B(IM[endKey]),
      endBgStyle: !A && (endKey === 'cleanR' || endKey === 'partialR') ? 'position:absolute;left:0;top:0;width:393px;height:353px' : 'position:absolute;left:0;top:-8px;width:393px;height:432px',
      tips: TIPS.map((text, n) => ({ text, cls: s.collected.indexOf(n) >= 0 ? 'on' : '', label: s.collected.indexOf(n) >= 0 ? '수집완료' : '수집하기',
        collect: () => { if (s.collected.indexOf(n) < 0) this.setState({ collected: s.collected.concat(n) }); } })),
      finish: () => {
        if (win && p.onPatch) p.onPatch({ solved: (d.solved || []).concat(d.simFrom && d.simFrom !== 'air-conditioner' ? [d.simFrom] : []), checkN: (d.checkN || 0) + (d.simFrom === 'air-conditioner' ? 1 : 0), holes: (d.holes || 0) + 1, tips: (d.tips || []).concat(s.collected.map((n) => TIPS[n])) });
        go('home');
      }
    };
  }
}

export default makeScreen(Component, (v) => (
  <>
    <div className={v.rootCls}>
      {!!v.is.intro && (
        <>
        <div className="hd">
          <button className="bk" type="button" aria-label="뒤로" onClick={v.toHome}>
            <span className="ic-back" />
          </button>
          <h1>
            시뮬레이션 상황
          </h1>
        </div>
        <div className="scr" style={{bottom: "93px"}}>
          <div style={{position: "relative", height: "353px", overflow: "hidden", background: "#fff"}}>
            <img className="bg" src={v.introImg} alt="" style={css(v.introImgStyle)} />
          </div>
          <div style={{padding: "40px 20px 32px", display: "flex", flexDirection: "column", gap: "32px"}}>
            <div>
              <span className="chip">
                {v.introChip}
              </span>
              <h2 className="ttl" style={{marginTop: "12px"}}>
                {v.introT1}
                <br />
                {v.introT2}
              </h2>
            </div>
            <div>
              <h3 className="hl">
                발생한 문제
              </h3>
              <p className="bd">
                {v.introProb}
              </p>
            </div>
            <div>
              <h3 className="hl">
                목표
              </h3>
              <p className="bd">
                {v.introGoal}
              </p>
            </div>
          </div>
        </div>
        <div style={{position: "absolute", left: "0", bottom: "0", width: "393px", height: "93px", background: "#fff", padding: "0 20px", boxSizing: "border-box"}}>
          <WitooDS.Button variant="primary" onClick={v.begin}>
            시뮬레이션 시작하기
          </WitooDS.Button>
        </div>
        </>
      )}
      {!!v.isGame && (
        <>
        <div className="hd">
          <button className="bk" type="button" aria-label="나가기" onClick={v.toHome}>
            <span className="ic-back" />
          </button>
          <h1>
            {v.gameTitle}
          </h1>
        </div>
        <div className="pg">
          <div className="r">
            <span>
              Question
            </span>
            <span>
              {v.qNo}{" / 5"}
            </span>
          </div>
          <div className="b">
            <i style={css(v.qBar)} />
          </div>
        </div>
        <div className="scn">
          <img className="bg" src={v.bgSrc} alt="" style={css(v.bgStyle)} />
          {!!v.showFace && (
            <>
            <img className="fc" src={v.faceSrc} alt="" />
            </>
          )}
          {!!v.isTap && (
            <>
            <button type="button" className="tap" aria-label="계속하기" onClick={v.advance} />
            </>
          )}
          {!!v.isPick && (
            <>
            <div style={{position: "absolute", inset: "0", background: "rgba(0, 0, 0, 0.4)"}} />
            <div style={{position: "absolute", left: "20px", top: "24px", width: "354px", height: "378px", display: "flex", flexDirection: "column"}}>
              <div style={{flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "8px", paddingBottom: "12px"}}>
                {(v.choices || []).map((c, __i) => (
                  <Fragment key={__i}>
                    <WitooDS.ChoiceButton selected={c.sel} onClick={c.pick}>
                      {c.text}
                    </WitooDS.ChoiceButton>
                  </Fragment>
                ))}
              </div>
              <div style={{display: "flex", gap: "8px"}}>
                {!!v.hasPrev && (
                  <>
                  <div style={{width: "132px", flex: "none"}}>
                    <button type="button" className="prv" onClick={v.prev}>
                      이전
                    </button>
                  </div>
                  </>
                )}
                <div style={{flex: "1"}}>
                  <WitooDS.Button variant={v.nextVariant} onClick={v.next}>
                    다음
                  </WitooDS.Button>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
        {!!v.showSpeech && (
          <>
          <div className="sp" style={{bottom: "49px", minHeight: "136px"}}>
            <svg className="tl2" viewBox="0 0 30 28" aria-hidden="true">
              <path d="M1 28 L15 1.500 L29 28 Z" fill="#eaf9ef" stroke="#97dfad" strokeWidth="1.5" strokeLinejoin="miter" />
              <rect x="0" y="26.500" width="30" height="3" fill="#eaf9ef" />
            </svg>
            <button type="button" className="tap" aria-label="계속하기" onClick={v.advance} style={css(v.speechTap)} />
            {v.speech}
          </div>
          </>
        )}
        {!!v.isFeedback && (
          <>
          <div className="sp fb" style={{bottom: "49px", minHeight: "163px"}}>
            <button type="button" className="tap" aria-label="계속하기" onClick={v.advance} />
            {v.feedback}
          </div>
          </>
        )}
        </>
      )}
      {!!v.is.result && (
        <>
        <div className="hd">
          <button className="bk" type="button" aria-label="닫기" onClick={v.finish} style={{left: "20px", top: "12px", width: "40px", height: "40px"}}>
            <span className="xb" />
          </button>
          <h1>
            시뮬레이션 결과
          </h1>
        </div>
        <div className="scr">
          <div style={{position: "relative", height: "353px", overflow: "hidden", background: "#fff"}}>
            <img className="bg" src={v.endBgSrc} alt="" style={css(v.endBgStyle)} />
          </div>
          <div style={{padding: "40px 20px 40px", display: "flex", flexDirection: "column", gap: "36px"}}>
            <div>
              <span className="chip">
                {v.endChip}
              </span>
              {!!v.endHole && (
                <>
                <span className="chip" style={{marginLeft: "8px"}}>
                  구멍+1
                </span>
                </>
              )}
              <h2 className="ttl">
                {v.endTitle}
              </h2>
            </div>
            <div>
              <h3 className="hl">
                결과
              </h3>
              <p className="bd">
                {v.endText}
              </p>
            </div>
            {!!v.endTips && (
              <>
              <div>
                <h3 className="hl" style={{marginBottom: "16px"}}>
                  발견한 생활 꿀tip
                </h3>
                <div style={{display: "flex", gap: "12px"}}>
                  {(v.tips || []).map((t, __i) => (
                    <Fragment key={__i}>
                      <div className="tip">
                        <div>
                          <img src="/img/tip-bee.svg" alt="" width="20" height="20" style={{display: "block", marginBottom: "0"}} />
                          <p>
                            {t.text}
                          </p>
                        </div>
                        <button type="button" className={t.cls} onClick={t.collect}>
                          {t.label}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              </>
            )}
            <WitooDS.Button variant="primary" onClick={v.finish}>
              완료
            </WitooDS.Button>
          </div>
        </div>
        </>
      )}
    </div>
  </>
));
