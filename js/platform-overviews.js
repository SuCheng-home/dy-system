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
      <section class="ov-hero is-dp">
        <div class="ov-hero-text">
          <span class="ov-eyebrow"><i class="ov-pulse" aria-hidden="true"></i>数据底座 · 实时同步中</span>
          <h2>全校基础数据，一处维护，处处可用</h2>
          <p>人员、组织、场地、教务、学籍五大类主数据在此统一维护，通过开放式平台实时分发给 ${P.OPEN_APPS.length} 个业务应用。</p>
          <div class="ov-live-line">今日已同步 <b data-live-count="12486">12,486</b> 条 · 最近一次 <b data-live-ago>刚刚</b></div>
        </div>
        <dl class="ov-hero-kpis">
          <div><dt>教职工</dt><dd>${counter(412)}</dd></div>
          <div><dt>在籍学生</dt><dd>${counter(3186)}</dd></div>
          <div><dt>班级</dt><dd>${counter(94)}</dd></div>
          <div><dt>场地房间</dt><dd>${counter(438)}</dd></div>
        </dl>
      </section>

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

  const CALL_APPS = P.OPEN_APPS.map(r => r[0]);
  const ALL_APIS = [...P.APIS.base, ...P.APIS.biz];
  function callRow(t, app, api, ok, ms) {
    return `<li class="ov-call"><time>${t}</time><span class="ov-call-app">${esc(app)}</span><code>${esc(api)}</code><span class="pf-tag ${ok ? 'is-ok' : 'is-danger'}">${ok ? '200' : '403'}</span><span class="ov-call-ms">${ms} ms</span></li>`;
  }
  function randomCall() {
    const d = new Date();
    const t = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => String(v).padStart(2, '0')).join(':');
    const ok = Math.random() > 0.08;
    return callRow(t, CALL_APPS[Math.floor(Math.random() * CALL_APPS.length)], ALL_APIS[Math.floor(Math.random() * ALL_APIS.length)].path, ok, ok ? 20 + Math.floor(Math.random() * 120) : 4 + Math.floor(Math.random() * 6));
  }

  V.openOverview = function () {
    const total = ALL_APIS.length;
    const initial = [
      ['09:41:07', '班牌管理系统', '/timetables/class', 1, 38], ['09:40:52', '成绩分析系统', '/students', 1, 112],
      ['09:40:11', '一卡通', '/teachers', 1, 64], ['09:39:30', '录播平台', '/rooms', 0, 6], ['09:38:02', '学生画像', '/exams', 1, 95],
    ];
    return `
      <section class="ov-hero is-open">
        <div class="ov-hero-text">
          <span class="ov-eyebrow">OPEN API · ${esc(P.API_BASE)}</span>
          <h2>一次注册，标准接入全校数据</h2>
          <p>第三方应用经审核与接口授权后，凭 access_token 调用 ${total} 个标准接口，所有数据按公共数据中心标准输出。</p>
        </div>
        <dl class="ov-hero-kpis">
          <div><dt>已接入应用</dt><dd>${counter(P.OPEN_APPS.length)}</dd></div>
          <div><dt>开放接口</dt><dd>${counter(total)}</dd></div>
          <div><dt>今日调用</dt><dd><b data-live-count="18426">18,426</b></dd></div>
          <div><dt>成功率</dt><dd>${counter(99.8, '%')}</dd></div>
        </dl>
      </section>

      ${panel('第三方应用接入流程', `<div class="ov-flow-wrap">${flowDiagram()}</div>
        <ul class="ov-flow-legend"><li><i class="is-flow"></i>主流程</li><li><i class="is-back"></i>驳回回退</li><li><i class="is-deny"></i>拒绝</li><li><i class="is-packet"></i>数据请求</li></ul>`,
        `<div class="pf-actions"><a class="dy-btn dy-btn-primary pf-btn-link" href="${href('open', 'apps')}">注册应用</a><a class="dy-btn dy-btn-ghost pf-btn-link" href="${href('open', 'auth')}">接口授权</a></div>`)}

      <div class="ov-grid is-open">
        ${panel('开放接口手册 · 目录', apiToc(), `<a class="pf-op" href="${href('open', 'api-base')}">查看完整文档</a>`)}
        <div class="pf-stack">
          ${panel('实时调用', `<ul class="ov-calls" data-live-feed>${initial.map(r => callRow(...r)).join('')}</ul>`, '<span class="ov-badge"><i class="ov-pulse" aria-hidden="true"></i>LIVE</span>')}
          ${panel('获取 access_token', `<pre class="pf-codeblock"><code>POST ${esc(P.API_BASE)}/oauth/token
{ "appKey": "ak_8f3c****2e1a",
  "appSecret": "******",
  "grantType": "client_credentials" }

→ { "code": 0, "data": {
    "accessToken": "eyJhbGciOi...",
    "expiresIn": 7200 } }</code></pre>`)}
        </div>
      </div>`;
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

  function spread() {
    let pageNo = 1;
    const chapters = [
      ['第一章', '信息标准', P.STD_INFO.map(e => e.name), 'info'],
      ['第二章', '代码编码标准', P.STD_CODES.slice(0, 5).map(e => e.name.replace(/（.*）/, '')), 'code'],
      ['第三章', '业务输出规范', P.STD_SPECS.slice(0, 4).map(e => e.name), 'spec'],
      ['第四章', '技术标准', [], 'tech'],
      ['第五章', '管理规范', [], 'mgmt'],
    ];
    const toc = chapters.map(([no, title, items, key], ci) => {
      const start = pageNo;
      const rows = items.map((it, i) => {
        const p = pageNo + 1 + i * 2;
        return `<li class="ov-tl-sub"><span>${ci + 1}.${i + 1}　${esc(it)}</span><i aria-hidden="true"></i><em>${p}</em></li>`;
      }).join('');
      pageNo += 2 + items.length * 2 + (items.length ? 0 : 4);
      const more = key === 'code' || key === 'spec' ? `<li class="ov-tl-sub is-more"><span>……</span><i aria-hidden="true"></i><em></em></li>` : '';
      return `<li class="ov-tl-ch"><a href="${href('std', key)}"><span>${no}　${esc(title)}</span><i aria-hidden="true"></i><em>${start}</em></a></li>${key === 'info' ? rows.split('</li>').slice(0, 6).join('</li>') + '</li><li class="ov-tl-sub is-more"><span>……</span><i aria-hidden="true"></i><em></em></li>' : rows + more}`;
    }).join('');
    const school = P.STD_INFO[0];
    return `<div class="ov-spread">
      <article class="ov-page is-left" aria-label="标准目录">
        <header class="ov-run">江苏省丹阳高级中学信息化管理标准</header>
        <h3 class="ov-page-title">目　录</h3>
        <ol class="ov-tl">${toc}</ol>
        <footer class="ov-folio">— Ⅰ —</footer>
      </article>
      <article class="ov-page is-right" aria-label="第一章 信息标准 节选">
        <header class="ov-run is-right">第一章　信息标准</header>
        <h3 class="ov-page-title is-left">第一章　信息标准</h3>
        <p class="ov-para"><b>1.0.1</b>　为统一学校各信息系统间数据的分类与描述，保证数据在采集、交换、传输过程中科学、规范，制定本标准。</p>
        <p class="ov-para"><b>1.0.2</b>　本标准适用于全校 ${P.STD_INFO.length} 类基础信息，各业务应用接入时应严格遵守。</p>
        <h4 class="ov-sec">1.1　学校信息</h4>
        <table class="ov-book-table"><caption>表 1.1　学校信息字段</caption>
          <thead><tr><th>字段名称</th><th>代码</th><th>类型</th><th>必填</th></tr></thead>
          <tbody>${school.fields.slice(0, 5).map(f => `<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td><td>${esc(f[4])}</td></tr>`).join('')}</tbody>
        </table>
        <span class="ov-stamp" aria-hidden="true"><i>★</i>丹阳高级中学<b>标准专用章</b></span>
        <footer class="ov-folio">— 1 —</footer>
      </article>
    </div>`;
  }

  function dataFlow() {
    const sources = ['教务系统', '学籍系统', '人事系统', '一卡通', '后勤系统', '德育评价'];
    const outs = ['班牌', '成绩分析', '学生画像', '一卡通', '移动校园'];
    const sy = i => 40 + i * 52;
    const oy = i => 62 + i * 54;
    const hubY = i => 88 + i * 37;
    const inPaths = sources.map((_, i) => `M178 ${sy(i)} C228 ${sy(i)} 220 ${hubY(i)} 270 ${hubY(i)}`);
    const outPaths = outs.map((_, i) => `M780 180 C820 180 806 ${oy(i)} 846 ${oy(i)}`);
    const box = (x, y, w, h, t, cls = '') => `<g class="ov-dnode ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle">${esc(t)}</text></g>`;
    const particles = (paths, prefix, cls, dur) => paths.map((d, i) => `<path id="${prefix}${i}" d="${d}" class="ov-dpath ${cls}"/>${[0, dur / 2].map(off => `<circle r="3.5" class="ov-particle ${cls}"><animateMotion dur="${dur}s" begin="-${(i * 0.37 + off).toFixed(2)}s" repeatCount="indefinite"><mpath href="#${prefix}${i}"/></animateMotion></circle>`).join('')}`).join('');
    return `<svg viewBox="0 0 1000 340" class="ov-dflow" role="img" aria-label="数据流动示意：业务系统数据经公共数据中心标准校验后进入统一公共数据平台，再经开放式平台分发给各应用">
      <text x="103" y="16" text-anchor="middle" class="ov-dcol">数据来源</text>
      <text x="370" y="16" text-anchor="middle" class="ov-dcol">公共数据中心</text>
      <text x="560" y="16" text-anchor="middle" class="ov-dcol">主数据</text>
      <text x="725" y="16" text-anchor="middle" class="ov-dcol">分发</text>
      <text x="912" y="16" text-anchor="middle" class="ov-dcol">数据应用</text>
      ${particles(inPaths, 'ovin', 'is-in', 2.6)}
      <path id="ovmid1" d="M470 180 H500" class="ov-dpath is-mid"/><path id="ovmid2" d="M620 180 H670" class="ov-dpath is-mid"/>
      ${['ovmid1', 'ovmid2'].map((id, i) => [0, 0.6].map(o => `<circle r="3.5" class="ov-particle is-mid"><animateMotion dur="1.2s" begin="-${i * 0.3 + o}s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion></circle>`).join('')).join('')}
      ${particles(outPaths, 'ovout', 'is-out', 2.2)}
      ${sources.map((s, i) => box(28, sy(i) - 17, 150, 34, s, 'is-src')).join('')}
      <g class="ov-hub">
        <rect x="270" y="50" width="200" height="260" rx="12"/>
        <text x="370" y="76" text-anchor="middle" class="ov-hub-t">标准化处理</text>
        ${[['采集汇聚', '统一字段口径'], ['标准校验', '必填 · 类型 · 长度'], ['编码映射', '代码表统一转换'], ['质量评估', '完整度 · 一致性']].map(([t, s], i) => `<g class="ov-stage" style="--d:${i * 0.5}s"><rect x="288" y="${92 + i * 52}" width="164" height="42" rx="6"/><text x="370" y="${110 + i * 52}" text-anchor="middle" class="ov-stage-t">${t}</text><text x="370" y="${126 + i * 52}" text-anchor="middle" class="ov-stage-s">${s}</text></g>`).join('')}
      </g>
      ${box(500, 140, 120, 80, '统一公共数据平台', 'is-master')}
      ${box(670, 152, 110, 56, '开放式平台', 'is-open')}
      ${outs.map((s, i) => box(846, oy(i) - 17, 132, 34, s, 'is-out')).join('')}
    </svg>`;
  }

  V.stdOverview = function (page, ctx) {
    return `
      <section class="ov-std-head">
        <div>
          <span class="ov-eyebrow is-dark">DZ/BZ 2026 · 第 1 版</span>
          <h2>江苏省丹阳高级中学信息化管理标准体系</h2>
          <p>统一数据在采集、交换、传输过程中的分类与描述，保证信息化系统建设、使用、管理、维护规范有序。</p>
        </div>
        <div class="pf-actions">${DY.PF.actionBtn('*下载标准文档（盖章版）', ctx)}${DY.PF.actionBtn('版本记录', ctx)}</div>
      </section>

      ${panel('标准编目', books(), '<span class="ov-note">共 5 册 · 点击书册进入</span>')}

      <div class="ov-grid is-std">
        ${panel('数据流动', `${dataFlow()}
          <dl class="ov-dstats">
            <div><dt>今日交换</dt><dd><b data-live-count="86214">86,214</b> 条</dd></div>
            <div><dt>标准字段</dt><dd>${counter(fieldCount())} 个</dd></div>
            <div><dt>代码表</dt><dd>${counter(P.STD_CODES.length)} 套</dd></div>
            <div><dt>校验通过率</dt><dd>${counter(99.2, '%')}</dd></div>
          </dl>`, '<span class="ov-badge is-green"><i class="ov-pulse" aria-hidden="true"></i>实时</span>')}
        ${panel('标准目录', spread(), '<span class="ov-note">节选 · 第一章</span>')}
      </div>`;
  };

  /* ================= 挂载与实时刷新 ================= */
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  DY.platformMount = function () {
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

  let ago = 0;
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
    ago = Math.random() > 0.5 ? 0 : ago + 2;
    document.querySelectorAll('[data-live-ago]').forEach(el => { el.textContent = ago ? `${ago} 秒前` : '刚刚'; });
    document.querySelectorAll('[data-live-feed]').forEach(list => {
      list.insertAdjacentHTML('afterbegin', randomCall());
      while (list.children.length > 6) list.lastElementChild.remove();
    });
  }, 2000);
})();
