/**
 * 三个平台的概览页（首页）：
 * - 统一公共数据平台：动态图表（折线绘制、环图、仪表环、实时柱状）
 * - 开放式平台：泳道接入流程图 + 接口手册目录 + 实时调用流
 * - 公共数据中心：标准编目书架 + 展开书页目录 + 数据流动图
 */
(function () {
  const { esc, href, ico, panel, pagesOf } = DY.PF;
  const P = DY.PLATFORM;
  const V = DY.PLATFORM_VIEWS;
  const fmt = n => Number(n).toLocaleString('zh-CN');
  const counter = (n, suffix = '') => `<b data-count="${n}" data-suffix="${suffix}">0${suffix}</b>`;
  let uid = 0;

  /* ================= 图表组件 ================= */
  function areaChart(series, labels) {
    const W = 640, H = 230, pl = 40, pr = 14, pt = 14, pb = 30;
    const n = labels.length;
    const max = Math.ceil(Math.max(...series.flatMap(s => s.data)) / 200) * 200;
    const x = i => pl + i * (W - pl - pr) / (n - 1);
    const y = v => pt + (1 - v / max) * (H - pt - pb);
    const id = `ovg${uid++}`;
    const grid = [0, 1, 2, 3, 4].map(k => {
      const v = max * k / 4;
      return `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" class="ov-grid-line"/><text x="${pl - 8}" y="${y(v) + 4}" class="ov-axis" text-anchor="end">${fmt(v)}</text>`;
    }).join('');
    const xl = labels.map((l, i) => (i % 5 === 0 || i === n - 1) ? `<text x="${x(i)}" y="${H - 8}" class="ov-axis" text-anchor="middle">${esc(l)}</text>` : '').join('');
    const paths = series.map((s, si) => {
      const line = s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
      const area = `${line} L${x(n - 1)} ${H - pb} L${pl} ${H - pb} Z`;
      const last = s.data[n - 1];
      return `<defs><linearGradient id="${id}-${si}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".22"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>
        <path d="${area}" fill="url(#${id}-${si})" class="ov-area" style="animation-delay:${0.5 + si * 0.2}s"/>
        <path d="${line}" pathLength="1" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" class="ov-line" style="animation-delay:${si * 0.2}s"/>
        <circle cx="${x(n - 1)}" cy="${y(last)}" r="4" fill="${s.color}" class="ov-dot"/><circle cx="${x(n - 1)}" cy="${y(last)}" r="4" fill="none" stroke="${s.color}" class="ov-dot-ring"/>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="ov-chart" role="img" aria-label="近 30 天数据维护量折线图">${grid}${xl}${paths}</svg>`;
  }

  function donut(parts, centerLabel, centerValue) {
    const total = parts.reduce((s, p) => s + p[1], 0);
    let acc = 0;
    const segs = parts.map(([, v, c], i) => {
      const pct = v / total * 100;
      const seg = `<circle cx="80" cy="80" r="60" pathLength="100" fill="none" stroke="${c}" stroke-width="18" stroke-dasharray="${(pct - 0.6).toFixed(2)} ${(100 - pct + 0.6).toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}" class="ov-seg" style="animation-delay:${i * 0.15}s"/>`;
      acc += pct;
      return seg;
    }).join('');
    return `<div class="ov-donut">
      <svg viewBox="0 0 160 160" role="img" aria-label="${esc(centerLabel)}构成环图"><circle cx="80" cy="80" r="60" fill="none" stroke="#eef1f5" stroke-width="18"/><g transform="rotate(-90 80 80)">${segs}</g>
        <text x="80" y="74" text-anchor="middle" class="ov-donut-label">${esc(centerLabel)}</text><text x="80" y="98" text-anchor="middle" class="ov-donut-value">${esc(centerValue)}</text></svg>
      <ul class="ov-legend">${parts.map(([l, v, c]) => `<li><i style="background:${c}"></i><span>${esc(l)}</span><b>${fmt(v)}</b><em>${(v / total * 100).toFixed(1)}%</em></li>`).join('')}</ul>
    </div>`;
  }

  function gauge(label, v, color) {
    return `<div class="ov-gauge">
      <svg viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="#eef1f5" stroke-width="7"/>
        <circle cx="42" cy="42" r="34" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="${v} 100" transform="rotate(-90 42 42)" class="ov-seg"/></svg>
      <b>${counter(v, '%')}</b><span>${esc(label)}</span>
    </div>`;
  }

  /* ================= 统一公共数据平台 ================= */
  const LIVE_APPS = ['班牌', '一卡通', '成绩分析', '学生画像', '公文流转', '场馆预约', '报修', '通知公告'];
  const seq = (n, base, amp, seed) => Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin(i / 2.6 + seed) + amp * 0.6 * Math.sin(i / 1.1 + seed * 2) + i * 6));

  V.dpOverview = function () {
    const labels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(2026, 10, 13 - 29 + i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const modules = pagesOf('dp').filter(p => !p.hidden && p.key !== 'overview');
    return `

      <div class="ov-grid is-dp">
        ${panel('近 30 天数据维护量', `${areaChart([
          { name: '新增', color: '#1677ff', data: seq(30, 260, 90, 0.4) },
          { name: '更新', color: '#0d9488', data: seq(30, 520, 150, 1.7) },
        ], labels)}`, '<ul class="ov-key"><li><i style="background:#1677ff"></i>新增</li><li><i style="background:#0d9488"></i>更新</li></ul>')}

        ${panel('人员构成', donut([['在籍学生', 3186, '#1677ff'], ['教职工', 412, '#0d9488'], ['临时人员', 57, '#d97706'], ['近三年校友', 1286, '#94a3b8']], '人员总数', fmt(4941)))}

        ${panel('实时数据调用（次 / 分钟）', `<div class="ov-live-bars" data-live-bars>${LIVE_APPS.map((a, i) => {
          const v = 30 + ((i * 37) % 60);
          return `<div class="ov-lb"><b>${v}</b><div class="ov-lb-track"><i style="height:${v}%"></i></div><span>${esc(a)}</span></div>`;
        }).join('')}</div>`, '<span class="ov-badge"><i class="ov-pulse" aria-hidden="true"></i>LIVE</span>')}

        ${panel('数据完整度', `<div class="ov-gauges">${P.DP_HEALTH.map(([l, v]) => gauge(l, v, v >= 95 ? '#16a34a' : v >= 90 ? '#1677ff' : '#d97706')).join('')}</div>`)}

        ${panel('数据模块', `<div class="ov-mods">${modules.map(m => `<a class="ov-mod" href="${href('dp', m.key)}">${ico(m.icon)}<strong>${esc(m.label)}</strong><small>${esc(m.count || '')}</small></a>`).join('')}</div>`)}

        ${panel('最近维护', `<ul class="ov-feed">${P.DP_UPDATES.map(([who, what, when]) => `<li><span class="pf-avatar">${esc(who.slice(0, 1))}</span><div><p><b>${esc(who)}</b> ${esc(what)}</p><time>${esc(when)}</time></div></li>`).join('')}</ul>`)}
      </div>`;
  };

  /* ================= 开放式平台 ================= */
  function flowDiagram() {
    const node = (x, y, label, sub, cls = '') => `<g class="ov-fnode ${cls}" transform="translate(${x} ${y})"><rect x="-62" y="-24" width="124" height="48" rx="8"/><text y="${sub ? -3 : 5}" text-anchor="middle" class="ov-fn-t">${esc(label)}</text>${sub ? `<text y="14" text-anchor="middle" class="ov-fn-s">${esc(sub)}</text>` : ''}</g>`;
    const diamond = (x, y, label) => `<g class="ov-fnode is-decision" transform="translate(${x} ${y})"><path d="M0 -34 L46 0 L0 34 L-46 0 Z"/><text y="5" text-anchor="middle" class="ov-fn-t">${esc(label)}</text></g>`;
    const edge = (d, cls = '') => `<path d="${d}" class="ov-edge ${cls}" marker-end="url(#ov-arrow)"/>`;
    const label = (x, y, t, cls = '') => `<text x="${x}" y="${y}" class="ov-elabel ${cls}">${esc(t)}</text>`;
    const lanes = [['第三方应用', 0], ['开放式平台', 110], ['学校 · 数据平台', 220]];
    const happy = 'M110 55 V275 H400 H550 V165 H630 V55 H710 V275 H940 V55';
    return `<svg viewBox="0 0 1010 330" class="ov-flow" role="img" aria-label="第三方应用接入开放式平台流程图">
      <defs><marker id="ov-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ov-arrow-head"/></marker></defs>
      ${lanes.map(([t, y], i) => `<g class="ov-lane ${i % 2 ? 'is-alt' : ''}"><rect x="0" y="${y}" width="1010" height="110"/><text x="20" y="${y + 55}" transform="rotate(-90 20 ${y + 55})" text-anchor="middle">${esc(t)}</text></g>`).join('')}
      ${edge('M110 79 V275 H188', 'is-flow')}
      ${edge('M312 275 H354', 'is-flow')}
      ${edge('M400 241 V55 H172', 'is-back')}<text x="392" y="150" text-anchor="end" class="ov-elabel is-back">驳回，修改后重新提交</text>
      ${edge('M446 275 H550 V189', 'is-flow')}${label(458, 266, '通过')}
      ${edge('M612 165 H630 V55 H648', 'is-flow')}
      ${edge('M710 79 V131', 'is-flow')}
      ${edge('M710 199 V251', 'is-flow')}${label(718, 228, '鉴权通过')}
      ${edge('M756 165 H788', 'is-deny')}${label(758, 156, '否', 'is-deny')}
      ${edge('M772 275 H940 V79', 'is-flow')}
      <path d="${happy}" id="ov-happy" fill="none" stroke="none"/>
      ${node(110, 55, '注册应用', '名称 / 编码 / 类型 / 平台')}
      ${node(250, 275, '管理员审核', '应用管理')}
      ${diamond(400, 275, '通过？')}
      ${node(550, 165, '授权接口 · 下发密钥', 'AppKey / AppSecret')}
      ${node(710, 55, '换取 access_token', 'POST /oauth/token')}
      ${diamond(710, 165, '网关鉴权')}
      ${node(850, 165, '403 拒绝访问', '未授权接口', 'is-deny')}
      ${node(710, 275, '读取主数据', '统一公共数据平台')}
      ${node(940, 55, '获得标准 JSON', '按数据标准输出', 'is-ok')}
      ${[0, 1.6, 3.2].map(b => `<circle r="5" class="ov-packet"><animateMotion dur="4.8s" begin="-${b}s" repeatCount="indefinite" rotate="auto"><mpath href="#ov-happy"/></animateMotion></circle>`).join('')}
    </svg>`;
  }

  function apiToc() {
    const chapter = (no, title, list, group) => `<div class="ov-toc-ch">
      <h4><span>第${no}章</span>${esc(title)}<em>${list.length} 个接口</em></h4>
      ${list.map((a, i) => `<a class="ov-toc-row" href="${href('open', group, a.key)}"><span class="ov-toc-no">${no}.${i + 1}</span><span class="ov-toc-name">${esc(a.name)}</span><span class="ov-toc-dots" aria-hidden="true"></span><code>${esc(a.method)} ${esc(a.path)}</code></a>`).join('')}
    </div>`;
    return `<div class="ov-toc">${chapter('一', '基础数据接口', P.APIS.base, 'api-base')}${chapter('二', '业务数据接口', P.APIS.biz, 'api-biz')}</div>`;
  }

  V.openOverview = function () {
    return `

      ${panel('第三方应用接入流程', `<div class="ov-flow-wrap">${flowDiagram()}</div>
        <ul class="ov-flow-legend"><li><i class="is-flow"></i>主流程</li><li><i class="is-back"></i>驳回回退</li><li><i class="is-deny"></i>拒绝</li><li><i class="is-packet"></i>数据请求</li></ul>`,
        `<div class="pf-actions"><a class="dy-btn dy-btn-primary pf-btn-link" href="${href('open', 'apps')}">注册应用</a><a class="dy-btn dy-btn-ghost pf-btn-link" href="${href('open', 'auth')}">接口授权</a></div>`)}

      ${panel('开放接口手册 · 目录', apiToc(), `<a class="pf-op" href="${href('open', 'api-base')}">查看完整文档</a>`)}`;
  };

  /* ================= 公共数据中心 ================= */
  const fieldCount = () => P.STD_INFO.reduce((n, e) => n + e.fields.length, 0);
  function books() {
    const vols = [
      { key: 'info', no: '01', title: '信息标准', sub: `${P.STD_INFO.length} 类实体 · ${fieldCount()} 字段`, c: '#1a2b44' },
      { key: 'code', no: '02', title: '代码编码标准', sub: `${P.STD_CODES.length} 套代码表`, c: '#1f7a3a' },
      { key: 'spec', no: '03', title: '业务输出规范', sub: `${P.STD_SPECS.length} 项业务`, c: '#243a58' },
      { key: 'tech', no: '04', title: '技术标准', sub: '接口 · 交换 · 安全', c: '#2f6b45' },
      { key: 'mgmt', no: '05', title: '管理规范', sub: '维护 · 共享 · 运维', c: '#122033' },
    ];
    return `<div class="ov-shelf">
      <div class="ov-books">${vols.map((v, i) => `<a class="ov-book" href="${href('std', v.key)}" style="--bk:${v.c};--i:${i}" aria-label="第${'一二三四五'[i]}册 ${esc(v.title)}">
        <span class="ov-book-cover">
          <span class="ov-book-code">DZ/BZ ${v.no}—2026</span>
          <span class="ov-book-vol">第${'一二三四五'[i]}册</span>
          <strong>${esc(v.title)}</strong>
          <span class="ov-book-rule" aria-hidden="true"></span>
          <span class="ov-book-sub">${esc(v.sub)}</span>
          <span class="ov-book-org">江苏省丹阳高级中学</span>
        </span>
      </a>`).join('')}</div>
      <div class="ov-shelf-board" aria-hidden="true"></div>
    </div>`;
  }

  function dataCenterScene() {
    const cyl = (cls, title, lines, extra = '') => `<div class="dc-cyl ${cls}">
      <span class="dc-tag">${esc(title)}</span>
      <div class="dc-cyl-body"><ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>${extra}</div>
    </div>`;
    const beams = cls => `<div class="dc-beams ${cls}">${[0, 1, 2].map(i => `<i style="--i:${i}"></i>`).join('')}</div>`;
    const dots = Array.from({ length: 16 }, (_, i) => `<b style="--x:${(i * 37) % 100}%;--d:${((i * 0.53) % 3).toFixed(2)}s;--s:${2 + (i % 3)}px"></b>`).join('');
    const blocks = [['database', '数据采集'], ['shield', '标准校验'], ['layers', '数据治理']];
    const steps = ['字段接入', '代码映射', '必填校验', '类型校验', '长度校验', '去重清洗', '质量评估'];
    const flow = ['数据接入', '标准校验', '编码转换', '质量检测', '写入主数据'];
    const bases = ['信息标准', '代码编码标准', '业务输出规范'];
    return `<div class="dc-fit" data-fit="1100x480"><div class="dc-scene" aria-hidden="true">
      <div class="dc-floor"></div>
      ${cyl('is-src', '数据来源', ['教务系统', '学籍系统', '人事系统', '一卡通', '后勤 · 德育'], `<div class="dc-dots">${dots}</div>`)}
      ${beams('is-left')}
      <svg class="dc-box" viewBox="0 0 1100 480">
        <defs><filter id="dc-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="dc-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7bff" stop-opacity=".16"/><stop offset="1" stop-color="#2f7bff" stop-opacity=".04"/></linearGradient></defs>
        <rect x="334" y="54" width="470" height="330" class="dc-back"/>
        <polygon points="300,86 334,54 804,54 770,86" class="dc-top"/>
        <polygon points="770,86 804,54 804,384 770,416" class="dc-side"/>
        <rect x="300" y="86" width="470" height="330" fill="url(#dc-front)" class="dc-front" filter="url(#dc-glow)"/>
        ${[[395, 416], [535, 416], [675, 416]].map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 22}" class="dc-pillar"/>`).join('')}
      </svg>
      <span class="dc-title">公共数据中心</span>
      <div class="dc-blocks">${blocks.map(([ic, t], i) => `<div class="dc-block" style="--i:${i}">${ico(ic, 'dc-block-ico')}<span>${t}</span></div>`).join('')}</div>
      <ul class="dc-steps">${steps.map((t, i) => `<li style="--i:${i}">${t}</li>`).join('')}</ul>
      <div class="dc-chev"><i></i><i></i><i></i><i></i></div>
      <div class="dc-flow"><span class="dc-cap">开始</span>${flow.map((t, i) => `<span class="dc-bar" style="--i:${i}">${t}</span>`).join('')}<span class="dc-cap">结束</span></div>
      <div class="dc-bases">${bases.map(t => `<span>${t}</span>`).join('')}</div>
      ${beams('is-right')}
      ${cyl('is-out', '数据服务', ['统一公共数据平台', '开放式平台', '班牌 · 画像', '成绩分析'], '<div class="dc-orbs"><i></i><i></i><i></i></div>')}
    </div></div>`;
  }

  V.stdOverview = function () {
    return `
      <section class="ov-dc" aria-label="数据流动：业务系统数据经公共数据中心采集、校验、治理后，以标准数据服务提供给统一公共数据平台、开放式平台及各应用">${dataCenterScene()}</section>
      ${panel('标准编目', books(), '<span class="ov-note">共 5 册 · 点击书册进入</span>')}`;
  };

  /* ================= 挂载与实时刷新 ================= */
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fitObserver = new ResizeObserver(entries => entries.forEach(({ target }) => {
    const [w, h] = target.dataset.fit.split('x').map(Number);
    const k = target.clientWidth / w;
    target.style.setProperty('--k', k);
    target.style.height = `${h * k}px`;
  }));

  DY.platformMount = function () {
    document.querySelectorAll('[data-fit]').forEach(el => fitObserver.observe(el));
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = String(target).includes('.') ? 1 : 0;
      const show = v => { el.textContent = (decimals ? v.toFixed(1) : fmt(Math.round(v))) + suffix; };
      if (reduced()) { show(target); return; }
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1100);
        show(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll('[data-live-bars] .ov-lb').forEach(lb => {
      const v = 18 + Math.floor(Math.random() * 80);
      lb.querySelector('i').style.height = `${v}%`;
      lb.querySelector('b').textContent = v;
    });
    document.querySelectorAll('[data-live-count]').forEach(el => {
      const n = Number(el.dataset.liveCount) + Math.floor(Math.random() * 9);
      el.dataset.liveCount = n;
      el.textContent = fmt(n);
    });
  }, 2000);
})();
