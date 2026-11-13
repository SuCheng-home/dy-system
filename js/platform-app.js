/**
 * 统建四大平台应用渲染：路由 #/p/<应用>/<页面>/<子项>
 * 由 pc-app.js 调用 DY.renderPlatform(parts)
 */
(function () {
  const esc = DY.escape;
  const P = DY.PLATFORM;
  const DANGER_OPS = ['删除', '禁用', '驳回', '移除', '收回', '停用'];
  const DRAG_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>';

  const appBy = key => P.APPS.find(a => a.key === key);
  const pagesOf = appKey => P.MENUS[appKey].flatMap(g => g.items.map(it => ({ ...it, group: g.group })));
  const href = (...seg) => '#/p/' + seg.filter(Boolean).join('/');
  const ico = (key, cls = 'pf-ico') => `<span class="${cls}" aria-hidden="true">${DY.ICONS[key] || DY.ICONS.apps}</span>`;

  /* ---------- 基础组件 ---------- */
  function parseAction(raw) {
    let s = raw;
    const primary = s.startsWith('*');
    if (primary) s = s.slice(1);
    const [left, dialog] = s.split('!');
    const [label, page] = left.split('>');
    return { label, page, dialog, primary };
  }

  function actionBtn(raw, ctx) {
    const a = parseAction(raw);
    const cls = `dy-btn ${a.primary ? 'dy-btn-primary' : 'dy-btn-ghost'}`;
    if (a.page) return `<a class="${cls} pf-btn-link" href="${href(ctx.app, a.page)}">${esc(a.label)}</a>`;
    if (a.dialog) return `<button type="button" class="${cls}" data-open-dialog="${esc(a.dialog)}">${esc(a.label)}</button>`;
    return `<button type="button" class="${cls}" data-demo="${esc(a.label)}">${esc(a.label)}</button>`;
  }

  function filterHtml(f) {
    if (f.select) return `<select class="pf-input" aria-label="筛选">${f.select.map(o => `<option>${esc(o)}</option>`).join('')}</select>`;
    if (f.search) return `<label class="pf-search"><input class="pf-input" type="search" placeholder="${esc(f.search)}" aria-label="${esc(f.search)}" data-table-search>${ico('inspect', 'pf-search-ico')}</label>`;
    if (f.date) return `<input class="pf-input" type="date" value="${esc(f.date)}" aria-label="日期">`;
    if (f.seg) return `<div class="pf-seg" role="group" data-seg>${f.seg.map((o, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}">${esc(o)}</button>`).join('')}</div>`;
    return '';
  }

  function toolbar(filters = [], actions = [], ctx) {
    if (!filters.length && !actions.length) return '';
    return `<div class="pf-toolbar">
      <div class="pf-filters">${filters.map(filterHtml).join('')}</div>
      <div class="pf-actions">${actions.map(a => actionBtn(a, ctx)).join('')}</div>
    </div>`;
  }

  function tag(v) {
    const [t, tone = 'info'] = String(v).split('|');
    return `<span class="pf-tag is-${esc(tone)}">${esc(t)}</span>`;
  }

  function opLink(op, ctx) {
    const [label, page] = op.split('>');
    const danger = DANGER_OPS.some(d => label.includes(d)) ? ' is-danger' : '';
    if (page) return `<a class="pf-op${danger}" href="${href(ctx.app, page)}">${esc(label)}</a>`;
    return `<button type="button" class="pf-op${danger}" data-demo="${esc(label)}">${esc(label)}</button>`;
  }

  function cell(col, v, ctx) {
    switch (col.type) {
      case 'check': return '<input type="checkbox" aria-label="选择本行">';
      case 'drag': return `<span class="pf-drag" title="拖拽排序">${DRAG_SVG}</span>`;
      case 'link': {
        const [t, page] = String(v).split('>');
        return page ? `<a class="pf-link" href="${href(ctx.app, page)}">${esc(t)}</a>` : `<span class="pf-link">${esc(t)}</span>`;
      }
      case 'tag': return tag(v);
      case 'chips': return `<div class="pf-chips">${(v || []).map(c => `<span class="pf-chip">${esc(c)}</span>`).join('')}</div>`;
      case 'avatar': return `<span class="pf-avatar">${esc(String(v).slice(0, 1))}</span>`;
      case 'seal': return '<img class="pf-seal" src="assets/seal.svg" alt="公章预览">';
      case 'ops': return `<div class="pf-ops">${(v || []).map(op => opLink(op, ctx)).join('')}</div>`;
      case 'mono': return `<code class="pf-mono">${esc(v)}</code>`;
      default: return esc(v);
    }
  }

  function table(columns, rows, ctx) {
    const draggable = columns.some(c => c.type === 'drag');
    const head = columns.map(c => {
      const cls = c.align === 'left' ? ' class="is-left"' : '';
      if (c.type === 'check') return '<th class="pf-th-check"><input type="checkbox" aria-label="全选" data-check-all></th>';
      if (c.type === 'drag') return '<th class="pf-th-drag"><span class="sr-only">排序</span></th>';
      return `<th${cls}>${esc(c.label || '')}</th>`;
    }).join('');
    const body = rows.length ? rows.map(r => `<tr${draggable ? ' draggable="true"' : ''}>${columns.map((c, i) => `<td${c.align === 'left' ? ' class="is-left"' : ''}>${cell(c, r[i], ctx)}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columns.length}" class="pf-empty">暂无数据</td></tr>`;
    return `<div class="pf-table-wrap"><table class="pf-table"${draggable ? ' data-sortable' : ''}><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function pager(total) {
    const pages = Math.max(1, Math.ceil(total / 20));
    const nums = pages <= 5 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, '…', pages];
    return `<div class="pf-pager">
      <span>共 ${Number(total).toLocaleString('zh-CN')} 条</span>
      <select class="pf-input" aria-label="每页条数"><option>20 条/页</option><option>50 条/页</option></select>
      <div class="pf-pages">${nums.map(n => `<button type="button" class="${n === 1 ? 'is-active' : ''}" ${n === '…' ? 'disabled' : ''}>${n}</button>`).join('')}</div>
    </div>`;
  }

  function treeHtml(nodes) {
    return `<ul>${nodes.map(n => `<li class="${n.open ? 'is-open' : ''}">
      <button type="button" class="pf-tree-node ${n.active ? 'is-active' : ''}" data-tree-node>${n.children ? '<span class="pf-caret" aria-hidden="true"></span>' : '<span class="pf-caret-space"></span>'}${esc(n.label)}</button>
      ${n.children ? treeHtml(n.children) : ''}
    </li>`).join('')}</ul>`;
  }

  function panel(title, inner, extra = '') {
    return `<section class="pf-panel">${title ? `<header class="pf-panel-head"><h3>${esc(title)}</h3>${extra}</header>` : ''}${inner}</section>`;
  }

  function kpis(list) {
    return `<div class="pf-kpis">${list.map(([label, value, tone]) => `<div class="pf-kpi"><span>${esc(label)}</span><strong class="${tone ? 'is-' + tone : ''}">${esc(value)}</strong></div>`).join('')}</div>`;
  }

  function bars(list, unit = '') {
    const max = Math.max(...list.map(x => x[1]));
    return `<div class="pf-bars">${list.map(([label, v]) => `<div class="pf-bar-col"><span class="pf-bar-val">${v}${unit}</span><div class="pf-bar-fill" style="height:${Math.round(v / max * 100)}%"></div><span class="pf-bar-label">${esc(label)}</span></div>`).join('')}</div>`;
  }

  function hbars(list, suffix = '') {
    const max = Math.max(...list.map(x => x[1]));
    return `<ul class="pf-hbars">${list.map(([label, v]) => `<li><span>${esc(label)}</span><div class="pf-hbar"><i style="width:${Math.round(v / max * 100)}%"></i></div><b>${v}${suffix}</b></li>`).join('')}</ul>`;
  }

  function tabs(list, rootId) {
    return `<div class="pf-tabs" role="tablist">${list.map((t, i) => `<button type="button" role="tab" class="${i === 0 ? 'is-active' : ''}" data-tab="${rootId}-${i}">${esc(t)}</button>`).join('')}</div>`;
  }
  const tabPanel = (rootId, i, inner) => `<div class="pf-tab-panel" data-tab-panel="${rootId}-${i}" ${i === 0 ? '' : 'hidden'}>${inner}</div>`;

  function listNav(items, activeKey, linkFn) {
    return `<nav class="pf-listnav">${items.map(it => `<a href="${linkFn(it)}" class="${it.key === activeKey ? 'is-active' : ''}">${esc(it.name)}${it.meta ? `<small>${esc(it.meta)}</small>` : ''}</a>`).join('')}</nav>`;
  }

  /* ---------- 通用表格页 ---------- */
  function viewTable(page, ctx) {
    const steps = page.steps ? `<ol class="pf-steps">${page.steps.map((s, i) => `<li><b>${i + 1}</b><span>${esc(s)}</span></li>`).join('')}</ol>` : '';
    const summary = page.summary ? `<dl class="pf-summary">${page.summary.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '';
    const main = `${toolbar(page.filters, page.actions, ctx)}${summary}${table(page.columns, page.rows, ctx)}${pager(page.total || page.rows.length)}`;
    const body = page.tree
      ? `<div class="pf-split"><aside class="pf-tree" aria-label="分类">${treeHtml(page.tree)}</aside><div class="pf-split-main">${main}</div></div>`
      : main;
    let html = `${steps}${panel('', body)}`;
    if (page.secondary) {
      const s = page.secondary;
      html += panel(s.title, table(s.columns, s.rows, ctx), `<div class="pf-actions">${(s.actions || []).map(a => actionBtn(a, ctx)).join('')}</div>`);
    }
    return html;
  }

  /* ---------- 统一公共数据平台 ---------- */
  function viewDpOverview(page, ctx) {
    const modules = pagesOf('dp').filter(p => !p.hidden && p.key !== 'overview');
    const grouped = P.MENUS.dp.filter(g => g.group !== '概览').map(g => `
      <div class="pf-mod-group">
        <h4>${esc(g.group)}</h4>
        <div class="pf-mod-grid">${modules.filter(m => m.group === g.group).map(m => `
          <a class="pf-mod" href="${href('dp', m.key)}">${ico(m.icon)}<span><strong>${esc(m.label)}</strong><small>${esc(m.count || '')}</small></span></a>`).join('')}
        </div>
      </div>`).join('');
    return `
      ${kpis([['教职工', '412'], ['在籍学生', '3,186'], ['班级（行政 / 教学）', '66 / 28'], ['场地房间', '438'], ['临时人员', '57', 'warn']])}
      <div class="pf-cols-2-1">
        ${panel('数据模块', grouped)}
        <div class="pf-stack">
          ${panel('数据完整度', hbars(P.DP_HEALTH, '%'))}
          ${panel('最近维护', `<ul class="pf-feed">${P.DP_UPDATES.map(([who, what, when]) => `<li><span class="pf-avatar">${esc(who.slice(0, 1))}</span><div><p><b>${esc(who)}</b> ${esc(what)}</p><time>${esc(when)}</time></div></li>`).join('')}</ul>`)}
        </div>
      </div>`;
  }

  function permGroups(mode, level) {
    let n = 0;
    const checked = () => (n++ * 0.37) % 1 < level;
    const web = DY.PC_NAV.filter(x => x.key !== 'home').map(nav => ({
      title: nav.label,
      items: (DY.SIDEBARS[nav.key] || []).flatMap(it => it.children ? it.children.map(c => `${it.label} · ${c.label}`) : [it.label]),
    }));
    const mobile = DY.TEACHER_GROUPS.map(g => ({ title: `老师端 · ${g.title}`, items: g.apps.map(a => a.title) }))
      .concat(DY.PARENT_GROUPS.map(g => ({ title: `家长端 · ${g.title}`, items: g.apps.map(a => a.title) })));
    const render = groups => `<div class="pf-perm-grid">${groups.map(g => {
      const items = g.items.map(label => ({ label, on: checked() }));
      const all = items.every(i => i.on);
      return `<fieldset class="pf-perm-group" data-check-scope>
        <legend><label><input type="checkbox" data-check-group ${all ? 'checked' : ''}> ${esc(g.title)}</label></legend>
        ${items.map(i => `<label class="pf-perm-item"><input type="checkbox" ${i.on ? 'checked' : ''}> ${esc(i.label)}</label>`).join('')}
      </fieldset>`;
    }).join('')}</div>`;
    return { web: render(web), mobile: render(mobile) };
  }

  function viewPermEditor(page, ctx) {
    let left = '';
    let head = '';
    let level = 0.5;
    if (page.mode === 'role') {
      const role = P.ROLES.find(r => r.key === ctx.sub) || P.ROLES[0];
      level = role.level;
      left = `<aside class="pf-side-list"><div class="pf-side-list-head"><strong>角色</strong>${actionBtn('*新增角色', ctx)}</div>${listNav(P.ROLES.map(r => ({ key: r.key, name: r.name, meta: `${r.members.length} 人` })), role.key, it => href(ctx.app, 'roles', it.key))}</aside>`;
      head = `<div class="pf-perm-head">
        <div><label class="pf-field-inline">角色名称 <input class="pf-input" value="${esc(role.name)}" aria-label="角色名称"></label></div>
        <div class="pf-members"><span>角色人员</span>${role.members.map(m => `<span class="pf-chip">${esc(m)}</span>`).join('')}<button type="button" class="pf-chip is-add" data-demo="添加人员">+ 添加人员</button></div>
      </div>`;
    } else {
      level = 0.6;
      left = `<aside class="pf-side-list"><div class="pf-person">
        <span class="pf-avatar is-lg">苏</span>
        <strong>苏诚</strong><small>工号 10005 · 教务处、数学</small>
        <div class="pf-chips">${['教务管理员', '任课教师'].map(r => `<span class="pf-chip">${r}</span>`).join('')}</div>
        <p class="pf-note">个人权限 = 所属角色权限 + 下方单独勾选项</p>
        <a class="dy-btn dy-btn-ghost pf-btn-link" href="${href(ctx.app, 'teachers')}">返回教师管理</a>
      </div></aside>`;
    }
    const g = permGroups(page.mode, level);
    return panel('', `<div class="pf-split">${left}<div class="pf-split-main">
      ${head}
      <div class="pf-toolbar">${tabs(['WEB 端功能权限', '移动端功能权限'], 'perm')}<div class="pf-actions">${actionBtn('*保存权限', ctx)}</div></div>
      ${tabPanel('perm', 0, g.web)}${tabPanel('perm', 1, g.mobile)}
    </div></div>`);
  }

  function viewTempStats() {
    const d = P.TEMP_STATS;
    let acc = 0;
    const stops = d.sources.map(([, v, c]) => { const s = `${c} ${acc}% ${acc + v}%`; acc += v; return s; }).join(', ');
    const donut = `<div class="pf-donut-wrap"><div class="pf-donut" style="background:conic-gradient(${stops})"><span>校外人员<br><b>721</b></span></div>
      <ul class="pf-legend">${d.sources.map(([l, v, c]) => `<li><i style="background:${c}"></i>${esc(l)}<b>${v}%</b></li>`).join('')}</ul></div>`;
    const typeTable = `<div class="pf-table-wrap"><table class="pf-table"><thead><tr><th class="is-left">人员类型</th><th>累计人数</th><th>当前人数</th><th>待审核</th><th>已转正</th><th>已驳回</th></tr></thead><tbody>${d.types.map(r => `<tr><td class="is-left">${esc(r[0])}</td>${r.slice(1).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const end = new Date(2026, 10, 13);
    const days = d.daily.map((v, i) => {
      const day = new Date(end.getTime() - (d.daily.length - 1 - i) * 864e5);
      return [`${day.getMonth() + 1}/${day.getDate()}`, v];
    });
    return `${kpis(d.kpis)}
      <div class="pf-cols-2">
        ${panel('各类型人数与审核情况', typeTable)}
        ${panel('校外人员来源途径', donut)}
        ${panel('每月临时人员功能使用次数', bars(d.monthly))}
        ${panel('临时人员常用表单次数', hbars(d.forms, ' 次'))}
      </div>
      ${panel('每日新增临时人员（近 14 天）', bars(days), `<div class="pf-seg">${['全部', '临时学生', '临时校友', '临时教师', '校外人员'].map((t, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}">${t}</button>`).join('')}</div>`)}`;
  }

  function viewSchool(page, ctx) {
    const s = P.SCHOOL_INFO;
    return `<div class="pf-cols-1-1">
      ${panel('主校区', `<div class="pf-school">
        <img src="assets/seal.svg" alt="${esc(s.name)} 校徽" class="pf-school-logo">
        <dl class="pf-dl">
          <div><dt>学校名称</dt><dd>${esc(s.name)}</dd></div>
          <div><dt>学校性质</dt><dd>${esc(s.nature)}</dd></div>
          <div><dt>学校简介</dt><dd>${esc(s.intro)}</dd></div>
          <div><dt>校徽</dt><dd><button type="button" class="pf-op" data-demo="更换校徽">更换校徽</button></dd></div>
        </dl>
      </div>`, `<div class="pf-actions">${actionBtn('*编辑主校区', ctx)}</div>`)}
      ${panel('校区列表', `<div class="pf-table-wrap"><table class="pf-table" data-sortable><thead><tr><th class="pf-th-drag"><span class="sr-only">排序</span></th><th class="is-left">校区名称</th><th>类型</th><th>地址</th><th>班级数</th><th>操作</th></tr></thead><tbody>
        ${s.branches.map(b => `<tr draggable="true"><td><span class="pf-drag" title="拖拽排序">${DRAG_SVG}</span></td><td class="is-left">${esc(b.name)}</td><td>${tag(b.main ? '主校区|ok' : '分校区|info')}</td><td>${esc(b.addr)}</td><td>${b.classes}</td><td><div class="pf-ops">${opLink('编辑', ctx)}${b.main ? '' : opLink('删除', ctx)}</div></td></tr>`).join('')}
      </tbody></table></div><p class="pf-note">拖拽行可调整校区排序</p>`, `<div class="pf-actions">${actionBtn('*新增分校区', ctx)}</div>`)}
    </div>`;
  }

  function viewSemester(page, ctx) {
    const cols = [{ label: '学年' }, { label: '学期' }, { label: '开始日期' }, { label: '结束日期' }, { label: '教学周' }, { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' }];
    const start = new Date(2026, 7, 31);
    const marks = { 1: '开学', 7: '国庆', 10: '期中考试', 20: '期末考试', 21: '寒假' };
    const weeks = Array.from({ length: 21 }, (_, i) => {
      const a = new Date(start.getTime() + i * 7 * 864e5);
      const b = new Date(a.getTime() + 6 * 864e5);
      const f = d => `${d.getMonth() + 1}.${d.getDate()}`;
      return `<li class="${marks[i + 1] ? 'is-mark' : ''} ${i === 10 ? 'is-now' : ''}"><b>第 ${i + 1} 周</b><span>${f(a)} - ${f(b)}</span>${marks[i + 1] ? `<em>${marks[i + 1]}</em>` : ''}</li>`;
    }).join('');
    return `${panel('', `${toolbar([], ['*新增学年', '新增学期'], ctx)}${table(cols, P.SEMESTERS, ctx)}`)}
      ${panel('校历 · 2026-2027 第一学期（自动生成）', `<ul class="pf-calendar">${weeks}</ul>`, `<div class="pf-actions">${actionBtn('导出校历', ctx)}${actionBtn('打印', ctx)}</div>`)}`;
  }

  function viewPost(page, ctx) {
    const d = P.POST;
    const matrix = `<div class="pf-table-wrap"><table class="pf-table pf-matrix"><thead>
      <tr><th class="is-left">班级</th><th>班主任</th>${d.subjects.map(s => `<th>${esc(s[0])}</th>`).join('')}</tr>
      <tr class="pf-sub-head"><th class="is-left">周课时</th><th>—</th>${d.subjects.map(s => `<th><input class="pf-input pf-mini" value="${s[1]}" aria-label="${esc(s[0])}周课时"></th>`).join('')}</tr>
      <tr class="pf-sub-head"><th class="is-left">备课组长</th><th>—</th>${d.subjects.map(s => `<th>${esc(s[2])}</th>`).join('')}</tr>
    </thead><tbody>${d.classes.map(([cls, head, ts]) => `<tr><td class="is-left">${esc(cls)}</td><td><span class="pf-chip is-strong">${esc(head)}</span></td>${ts.map(t => `<td><button type="button" class="pf-cell-btn" data-demo="更换任课教师">${esc(t)}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const walkCols = [{ label: '教学班', align: 'left' }, { label: '学科' }, { label: '任课教师' }, { label: '周课时' }, { label: '学生数' }];
    const statCols = [{ label: '教师', align: 'left' }, { label: '学科' }, { label: '周课时' }, { label: '选修' }, { label: '社团' }, { label: '监考时段' }, { label: '代课记录' }, { label: '合计工作量' }];
    return panel('', `
      <div class="pf-toolbar">
        <div class="pf-filters">${filterHtml({ select: ['高一年级', '高二年级', '高三年级'] })}${tabs(['行政班岗位', '走班岗位', '岗位统计'], 'post')}</div>
        <div class="pf-actions">${['*保存', '调整学科顺序', '导出'].map(a => actionBtn(a, ctx)).join('')}</div>
      </div>
      ${tabPanel('post', 0, matrix + '<p class="pf-note">点击单元格可更换任课教师；表头可自定义每个学科的周课时。</p>')}
      ${tabPanel('post', 1, table(walkCols, d.walk, ctx))}
      ${tabPanel('post', 2, table(statCols, d.stats, ctx))}`);
  }

  /* ---------- 统一应用管理 ---------- */
  function viewAppMarket(page, ctx) {
    const cards = P.MARKET.map(a => `<article class="pf-app-card" data-app-card data-type="${a.type}" data-cat="${esc(a.cat)}" data-installed="${a.installed ? '1' : '0'}" data-name="${esc(a.name)}" ${a.installed ? '' : 'hidden'}>
      ${DY.iconDisc(a.icon, a.color).replace('dy-ico', 'dy-ico pf-app-ico')}
      <div class="pf-app-body">
        <h4>${esc(a.name)} ${a.type === 'int' ? '<span class="pf-tag is-muted">集成</span>' : ''}</h4>
        <p>${esc(a.desc)}</p>
        <div class="pf-app-foot">
          <span class="pf-app-cat">${esc(a.cat)}</span>
          ${a.installed
            ? `<div class="pf-ops"><button type="button" class="pf-op" data-demo="打开 ${esc(a.name)}">打开</button><a class="pf-op" href="${href(ctx.app, 'app-auth')}">角色查看</a></div>`
            : `<button type="button" class="dy-btn dy-btn-primary pf-btn-sm" data-install>安装</button>`}
        </div>
      </div>
    </article>`).join('');
    return panel('', `
      <div class="pf-market-filters" data-market>
        <div class="pf-market-row"><span>安装状态</span><div class="pf-seg" data-mf="installed"><button type="button" class="is-active" data-v="1">已安装</button><button type="button" data-v="0">未安装</button><button type="button" data-v="">全部</button></div>
          <label class="pf-search pf-push"><input class="pf-input" type="search" placeholder="应用名称" aria-label="应用名称" data-mf-search>${ico('inspect', 'pf-search-ico')}</label></div>
        <div class="pf-market-row"><span>应用类型</span><div class="pf-seg" data-mf="type"><button type="button" class="is-active" data-v="">全部</button><button type="button" data-v="sys">系统应用</button><button type="button" data-v="int">集成应用</button></div></div>
        <div class="pf-market-row"><span>适用类型</span><div class="pf-seg is-wrap" data-mf="cat"><button type="button" class="is-active" data-v="">全部</button>${P.APP_CATS.map(c => `<button type="button" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      </div>
      <div class="pf-market-grid" data-market-grid>${cards}</div>
      <p class="pf-empty" data-market-empty hidden>没有符合条件的应用</p>`);
  }

  function viewRoleUsers(page, ctx) {
    const role = P.ROLES.find(r => r.key === ctx.sub) || P.ROLES[4];
    const people = ['巴展翔', '包云娟', '柳响成', '步飞', '步金花', '边卫刚'];
    const rows = (role.members[0].startsWith('(') ? people : role.members.concat(people.slice(0, 3))).map((n, i) => ['', n, `1${String(i + 11).padStart(4, '0')}`, ['高三年级部', '高一年级部', '语文组', '数学组'][i % 4], '2026-09-01', ['移除']]);
    const cols = [{ type: 'check' }, { label: '姓名', align: 'left' }, { label: '工号' }, { label: '部门' }, { label: '加入时间' }, { label: '操作', type: 'ops' }];
    return panel('', `<div class="pf-split">
      <aside class="pf-side-list"><div class="pf-side-list-head"><strong>角色</strong></div>${listNav(P.ROLES.map(r => ({ key: r.key, name: r.name, meta: r.desc })), role.key, it => href(ctx.app, 'role-users', it.key))}</aside>
      <div class="pf-split-main">
        <div class="pf-toolbar"><div class="pf-filters"><strong class="pf-title-sm">${esc(role.name)}</strong>${filterHtml({ search: '姓名 / 工号' })}</div><div class="pf-actions">${['*添加用户', '批量移除'].map(a => actionBtn(a, ctx)).join('')}</div></div>
        ${table(cols, rows, ctx)}
      </div>
    </div>`);
  }

  function viewAuthMatrix(page, ctx) {
    const apps = P.MARKET.filter(a => a.installed);
    const roles = P.ROLES;
    const head = `<tr><th class="is-left">应用 \\ 角色</th>${roles.map(r => `<th>${esc(r.name)}</th>`).join('')}</tr>`;
    const body = apps.map((a, i) => `<tr><td class="is-left"><span class="pf-app-mini">${DY.iconDisc(a.icon, a.color)}${esc(a.name)}</span></td>${roles.map((r, j) => {
      const on = r.level >= 1 || ((i * 3 + j * 5) % 10) / 10 < r.level;
      return `<td><input type="checkbox" ${on ? 'checked' : ''} aria-label="${esc(r.name)} 可访问 ${esc(a.name)}"></td>`;
    }).join('')}</tr>`).join('');
    return panel('', `${toolbar([{ seg: ['按角色授权', '按用户授权'] }, { search: '应用名称' }], ['*保存授权', '复制授权'], ctx)}
      <div class="pf-table-wrap"><table class="pf-table pf-matrix is-check"><thead>${head}</thead><tbody>${body}</tbody></table></div>
      <p class="pf-note">勾选即该角色下所有用户可在工作台看到并打开对应应用；单个教师的额外授权在「教师授权」中设置。</p>`);
  }

  /* 登录安全：演示状态仅存内存 */
  const LOGIN = { fails: 0, lockedUntil: 0, offset: 0, step: 'login', role: 'teacher', campus: '', lastActive: 0, code: '' };
  const now = () => Date.now() + LOGIN.offset;
  const PASSWORD = 'Dy@2026';

  function loginPanelHtml() {
    if (LOGIN.step === 'campus') {
      return `<div class="pf-login-step"><h4>第 2 步 · 选择校区</h4><p class="pf-note">管理员账号验证通过，请选择要进入的校区。</p>
        <div class="pf-campus">${['本部校区', '城南校区'].map(c => `<button type="button" class="pf-campus-btn" data-campus="${c}">${ico('dorm')}<span>${c}</span></button>`).join('')}</div></div>`;
    }
    if (LOGIN.step === 'sms') {
      return `<form class="pf-login-step" data-sms-form><h4>第 3 步 · 手机验证码</h4><p class="pf-note">已进入「${esc(LOGIN.campus)}」，验证码将发送至 135****0912。</p>
        <div class="pf-sms-row"><input class="pf-input" name="code" inputmode="numeric" maxlength="6" placeholder="6 位验证码" aria-label="验证码" required><button type="button" class="dy-btn dy-btn-ghost" data-sms-send>获取验证码</button></div>
        <p class="pf-hint" data-sms-hint></p>
        <button type="submit" class="dy-btn dy-btn-primary pf-block">验证并登录</button></form>`;
    }
    if (LOGIN.step === 'done') {
      return `<div class="pf-login-step pf-login-done">${ico('shield', 'pf-ico is-ok')}<h4>登录成功</h4>
        <p>${LOGIN.role === 'admin' ? `管理员 · ${esc(LOGIN.campus)}（双因子验证通过）` : '教师账号登录'}</p>
        <p class="pf-session">会话剩余 <b data-session>15:00</b>（15 分钟无操作自动失效，任意操作重新计时）</p>
        <div class="pf-actions"><button type="button" class="dy-btn dy-btn-ghost" data-login-reset>退出登录</button><button type="button" class="dy-btn dy-btn-ghost" data-session-expire>模拟 15 分钟无操作</button></div></div>`;
    }
    const isAdmin = LOGIN.role === 'admin';
    return `<form class="pf-login-step" data-login-form autocomplete="off">
      <div class="pf-seg pf-block" data-login-role><button type="button" class="${isAdmin ? '' : 'is-active'}" data-v="teacher">教师账号</button><button type="button" class="${isAdmin ? 'is-active' : ''}" data-v="admin">管理员账号</button></div>
      <label class="pf-field">账号<input class="pf-input" name="account" value="${isAdmin ? 'admin' : '10005'}" required></label>
      <label class="pf-field">密码<input class="pf-input" name="password" type="password" placeholder="演示正确密码：${PASSWORD}" required></label>
      <p class="pf-hint" data-login-hint>${LOGIN.fails ? `已连续错误 ${LOGIN.fails} 次` : (isAdmin ? '管理员需：账号密码 → 选择校区 → 手机验证码' : '连续输错 3 次将锁定 15 分钟')}</p>
      <button type="submit" class="dy-btn dy-btn-primary pf-block">登录</button>
      <p class="pf-cipher" data-cipher>前端加密传输：输入密码后显示</p>
    </form>`;
  }

  function viewLoginSecurity(page, ctx) {
    const rule = (title, desc, ctrl) => `<div class="pf-rule"><div><strong>${esc(title)}</strong><p>${desc}</p></div><div class="pf-rule-ctrl">${ctrl}</div></div>`;
    const sw = on => `<label class="pf-toggle"><input type="checkbox" ${on ? 'checked' : ''}><span></span><em class="sr-only">开关</em></label>`;
    const num = (v, unit, label) => `<label class="pf-num"><input class="pf-input pf-mini" type="number" value="${v}" aria-label="${label}"> ${unit}</label>`;
    return `<div class="pf-cols-1-1">
      ${panel('登录安全策略', `
        ${rule('登录失败锁定', '连续输错账号或密码达到次数后锁定，锁定期内提示「请在 xx 分钟后再次登录」，并保留已输入的账号与密码。', `${num(3, '次', '失败次数')}${num(15, '分钟', '锁定时长')}`)}
        ${rule('锁定提示文案', '第 3 次错误时 toast：', `<code class="pf-mono">账号或密码错误，请在15分钟后再次登录</code>`)}
        ${rule('管理员双因子登录', '账号密码 → 选择校区 → 进入校区后验证手机验证码。', sw(true))}
        ${rule('密码加密', '前端加密存储、加密传输，服务端不落明文。', sw(true))}
        ${rule('管理员会话超时', '15 分钟未进行操作则登录失效。', num(15, '分钟', '会话超时'))}
        <div class="pf-panel-foot">${actionBtn('*保存策略', ctx)}</div>`)}
      ${panel('登录流程体验', `<div class="pf-login" data-login-panel>${loginPanelHtml()}</div>
        <div class="pf-login-tools"><button type="button" class="pf-op" data-ff>模拟时间 +5 分钟</button><button type="button" class="pf-op" data-login-clear>重置演示</button></div>`, '<span class="pf-tag is-muted">演示</span>')}
    </div>`;
  }

  /* ---------- 开放式平台 ---------- */
  function viewOpenOverview(page, ctx) {
    const steps = ['注册应用', '获取 AppKey / AppSecret', '申请接口授权', '换取 access_token', '调用开放接口'];
    const total = P.APIS.base.length + P.APIS.biz.length;
    return `${kpis([['已接入应用', String(P.OPEN_APPS.length)], ['开放接口', String(total)], ['今日调用', '18,426'], ['调用成功率', '99.8%', 'ok'], ['待审核应用', '1', 'warn']])}
      ${panel('第三方接入流程', `<ol class="pf-steps is-flow">${steps.map((s, i) => `<li><b>${i + 1}</b><span>${esc(s)}</span></li>`).join('')}</ol>
        <pre class="pf-codeblock"><code>POST ${esc(P.API_BASE)}/oauth/token
Content-Type: application/json

{ "appKey": "ak_8f3c****2e1a", "appSecret": "******", "grantType": "client_credentials" }

→ { "code": 0, "data": { "accessToken": "eyJhbGciOi...", "expiresIn": 7200 } }</code></pre>`)}
      <div class="pf-cols-1-1">
        ${panel('接口目录', `<div class="pf-api-dir">
          <div><h4>基础数据接口 <small>${P.APIS.base.length}</small></h4><div class="pf-chips">${P.APIS.base.map(a => `<a class="pf-chip is-link" href="${href('open', 'api-base', a.key)}">${esc(a.name)}</a>`).join('')}</div></div>
          <div><h4>业务数据接口 <small>${P.APIS.biz.length}</small></h4><div class="pf-chips">${P.APIS.biz.map(a => `<a class="pf-chip is-link" href="${href('open', 'api-biz', a.key)}">${esc(a.name)}</a>`).join('')}</div></div>
        </div>`)}
        ${panel('近 7 日调用量（千次）', bars([['11-07', 15.2], ['11-08', 6.1], ['11-09', 5.4], ['11-10', 17.9], ['11-11', 18.8], ['11-12', 19.3], ['11-13', 18.4]]))}
      </div>`;
  }

  function viewApiAuth(page, ctx) {
    const apps = P.OPEN_APPS.map((r, i) => ({ key: String(i), name: r[0], meta: `编码 ${r[1]}` }));
    const active = apps.find(a => a.key === ctx.sub) || apps[0];
    const idx = Number(active.key);
    const group = (title, list, offset) => {
      const items = list.map((a, i) => ({ a, on: ((i + offset + idx * 2) % 3) !== 0 }));
      return `<fieldset class="pf-perm-group" data-check-scope>
        <legend><label><input type="checkbox" data-check-group ${items.every(x => x.on) ? 'checked' : ''}> ${esc(title)}</label></legend>
        ${items.map(({ a, on }) => `<label class="pf-perm-item is-api"><input type="checkbox" ${on ? 'checked' : ''}> <span>${esc(a.name)}</span><code class="pf-mono">${esc(a.method)} ${esc(a.path)}</code></label>`).join('')}
      </fieldset>`;
    };
    return panel('', `<div class="pf-split">
      <aside class="pf-side-list"><div class="pf-side-list-head"><strong>第三方应用</strong></div>${listNav(apps, active.key, it => href(ctx.app, 'auth', it.key))}</aside>
      <div class="pf-split-main">
        <div class="pf-toolbar"><div class="pf-filters"><strong class="pf-title-sm">${esc(active.name)} · 接口权限</strong></div><div class="pf-actions">${['*保存', '全部收回'].map(a => actionBtn(a, ctx)).join('')}</div></div>
        <div class="pf-perm-grid is-2">${group('基础数据接口', P.APIS.base, 0)}${group('业务数据接口', P.APIS.biz, 1)}</div>
      </div>
    </div>`);
  }

  function sampleJson(api) {
    const obj = {};
    api.fields.forEach(f => { obj[f[0]] = f[3]; });
    const listy = !/current|^\/school$/.test(api.path);
    const data = listy ? { total: 1, list: [obj] } : obj;
    return JSON.stringify({ code: 0, msg: 'success', data }, null, 2);
  }

  function usecaseHtml(uc, systemName) {
    return `<div class="pf-usecase" role="img" aria-label="用例图：${esc(uc.actors.join('、'))} 与 ${esc(systemName)}">
      <div class="pf-uc-actors">${uc.actors.map(a => `<div class="pf-uc-actor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="5" r="3"/><path d="M12 8v7M6 11h12M12 15l-4 6M12 15l4 6"/></svg><span>${esc(a)}</span></div>`).join('')}</div>
      <div class="pf-uc-lines" aria-hidden="true"></div>
      <div class="pf-uc-system"><span class="pf-uc-title">${esc(systemName)}</span>${uc.cases.map(c => `<span class="pf-uc-case">${esc(c)}</span>`).join('')}</div>
    </div>`;
  }

  function viewApiDocs(page, ctx) {
    const list = P.APIS[page.apiGroup];
    const api = list.find(a => a.key === ctx.sub) || list[0];
    const paramCols = [{ label: '参数名', type: 'mono', align: 'left' }, { label: '类型' }, { label: '必填' }, { label: '说明', align: 'left' }];
    const fieldCols = [{ label: '字段', type: 'mono', align: 'left' }, { label: '类型' }, { label: '说明', align: 'left' }];
    return panel('', `<div class="pf-split">
      <aside class="pf-side-list"><div class="pf-side-list-head"><strong>${page.apiGroup === 'base' ? '基础数据接口' : '业务数据接口'}</strong></div>${listNav(list.map(a => ({ key: a.key, name: a.name, meta: a.path })), api.key, it => href(ctx.app, page.key, it.key))}</aside>
      <div class="pf-split-main pf-doc">
        <div class="pf-doc-head"><h3>${esc(api.name)}</h3><p>${esc(api.desc)}</p></div>
        <div class="pf-endpoint"><span class="pf-method">${esc(api.method)}</span><code>${esc(P.API_BASE + api.path)}</code><button type="button" class="pf-op" data-copy="${esc(P.API_BASE + api.path)}">复制</button></div>
        <h4>请求头</h4>
        ${table([{ label: '名称', type: 'mono', align: 'left' }, { label: '值', type: 'mono', align: 'left' }, { label: '说明', align: 'left' }], [['Authorization', 'Bearer {access_token}', '通过 /oauth/token 获取'], ['Content-Type', 'application/json', '']], ctx)}
        <h4>请求参数</h4>
        ${table(paramCols, api.params, ctx)}
        <h4>返回结果</h4>
        ${table(fieldCols, api.fields.map(f => [f[0], f[1], f[2]]), ctx)}
        <pre class="pf-codeblock"><code>${esc(sampleJson(api))}</code></pre>
        ${api.usecase ? `<h4>用例图</h4>${usecaseHtml(api.usecase, '开放式平台 · ' + api.name + '接口')}` : ''}
      </div>
    </div>`);
  }

  /* ---------- 公共数据中心 ---------- */
  function viewStdOverview(page, ctx) {
    const blocks = [
      ['info', '信息标准', 'database', `${P.STD_INFO.length} 类实体 · ${P.STD_INFO.reduce((n, e) => n + e.fields.length, 0)} 个标准字段`, '学校、时段、场地、教师、年级、班级、学籍、部门、学科、校区、学年、学期、角色'],
      ['code', '代码编码标准', 'dict', `${P.STD_CODES.length} 套代码表`, '性别、学籍性质、在校状态、场地类型、班级类型等统一编码'],
      ['spec', '业务输出规范', 'docflow', `${P.STD_SPECS.length} 项业务`, '功能描述 + 用例图 + 数据结构'],
      ['tech', '技术标准', 'api', '4 项', '接口、数据交换、认证授权、加密脱敏'],
      ['mgmt', '管理规范', 'audit', '4 项', '数据维护、共享审批、账号权限、运维应急'],
    ];
    return `<div class="pf-std-hero">
        <div><h3>江苏省丹阳高级中学 信息化管理标准体系</h3><p>统一数据在采集、交换、传输过程中的分类与描述，确保信息化管理系统建设、使用、管理、维护规范有序。</p></div>
        <div class="pf-actions">${actionBtn('*下载标准文档（盖章版）', ctx)}${actionBtn('版本记录', ctx)}</div>
      </div>
      <div class="pf-std-grid">${blocks.map(([k, t, i, m, d]) => `<a class="pf-std-card" href="${href('std', k)}">${ico(i)}<h4>${esc(t)}</h4><b>${esc(m)}</b><p>${esc(d)}</p></a>`).join('')}</div>
      ${panel('标准如何被使用', `<div class="pf-flow">
        ${[['公共数据中心', '定义标准字段与代码'], ['统一公共数据平台', '按标准维护基础数据'], ['开放式平台', '按标准对外输出接口'], ['统一应用管理', '各应用按标准对接']].map(([t, d], i, arr) => `<div class="pf-flow-node"><strong>${esc(t)}</strong><span>${esc(d)}</span></div>${i < arr.length - 1 ? '<span class="pf-flow-arrow" aria-hidden="true">→</span>' : ''}`).join('')}
      </div>`)}`;
  }

  function viewStdMaster(page, ctx) {
    const isInfo = page.source === 'info';
    const list = isInfo ? P.STD_INFO : P.STD_CODES;
    const cur = list.find(x => x.key === ctx.sub) || list[0];
    const cols = isInfo
      ? [{ label: '字段名称', align: 'left' }, { label: '字段代码', type: 'mono' }, { label: '数据类型' }, { label: '长度' }, { label: '必填' }, { label: '字段说明', align: 'left' }]
      : [{ label: '代码', type: 'mono' }, { label: '名称', align: 'left' }, { label: '说明', align: 'left' }];
    const rows = isInfo ? cur.fields : cur.rows;
    const legend = isInfo ? '<p class="pf-note">数据类型：C 字符型 · N 数值型 · D 日期型 · T 时间 / 文本型 · B 布尔型</p>' : '';
    return panel('', `<div class="pf-split">
      <aside class="pf-side-list"><div class="pf-side-list-head"><strong>${isInfo ? '信息实体' : '代码集'}</strong></div>${listNav(list.map(x => ({ key: x.key, name: x.name, meta: isInfo ? `${x.fields.length} 个字段` : `${x.rows.length} 项` })), cur.key, it => href(ctx.app, page.key, it.key))}</aside>
      <div class="pf-split-main">
        <div class="pf-toolbar"><div class="pf-filters"><strong class="pf-title-sm">${esc(cur.name)}</strong><span class="pf-tag is-ok">v1.0 已发布</span></div><div class="pf-actions">${['*编辑', '导出', '历史版本'].map(a => actionBtn(a, ctx)).join('')}</div></div>
        ${table(cols, rows, ctx)}${legend}
      </div>
    </div>`);
  }

  function viewStdSpec(page, ctx) {
    const list = P.STD_SPECS;
    const cur = list.find(x => x.key === ctx.sub) || list[0];
    return panel('', `<div class="pf-split">
      <aside class="pf-side-list"><div class="pf-side-list-head"><strong>业务规范</strong></div>${listNav(list.map(x => ({ key: x.key, name: x.name })), cur.key, it => href(ctx.app, 'spec', it.key))}</aside>
      <div class="pf-split-main pf-doc">
        <div class="pf-doc-head"><h3>${esc(cur.name)} · 输出标准规范</h3><div class="pf-actions">${actionBtn('导出说明（盖章版）', ctx)}</div></div>
        <h4>功能描述</h4><p class="pf-doc-text">${esc(cur.desc)}</p>
        <h4>用例图</h4>${usecaseHtml({ actors: cur.actors, cases: cur.cases }, cur.name + '系统')}
        <h4>数据结构</h4>
        ${table([{ label: '字段', type: 'mono', align: 'left' }, { label: '类型' }, { label: '说明', align: 'left' }], cur.fields, ctx)}
      </div>
    </div>`);
  }

  const VIEWS = {
    table: viewTable, dpOverview: viewDpOverview, permEditor: viewPermEditor, tempStats: viewTempStats,
    school: viewSchool, semester: viewSemester, post: viewPost,
    appMarket: viewAppMarket, roleUsers: viewRoleUsers, authMatrix: viewAuthMatrix, loginSecurity: viewLoginSecurity,
    openOverview: viewOpenOverview, apiAuth: viewApiAuth, apiDocs: viewApiDocs,
    stdOverview: viewStdOverview, stdMaster: viewStdMaster, stdSpec: viewStdSpec,
  };

  /* ---------- 外壳 ---------- */
  function shell(app, page, content) {
    const activeKey = page.hidden ? page.parent : page.key;
    const side = P.MENUS[app.key].map(g => `<div class="pf-side-group">
      <div class="pf-side-title">${esc(g.group)}</div>
      ${g.items.filter(it => !it.hidden).map(it => `<a class="pf-side-item ${it.key === activeKey ? 'is-active' : ''}" href="${href(app.key, it.key)}" ${it.key === activeKey ? 'aria-current="page"' : ''}>${ico(it.icon, 'dy-side-ico')}<span>${esc(it.label)}</span></a>`).join('')}
    </div>`).join('');
    return `<div class="pf" style="--pf-c:${esc(app.color)}">
      <div class="pf-bar">
        <div class="pf-id">
          ${DY.iconDisc(app.icon, app.color)}
          <div><strong>${esc(app.name)}</strong><span>${esc(app.en)} · ${esc(DY.SCHOOL.name)}</span></div>
        </div>
        <nav class="pf-switch" aria-label="平台应用切换">
          ${P.APPS.map(a => `<a href="${href(a.key)}" class="${a.key === app.key ? 'is-active' : ''}" style="--c:${esc(a.color)}">${ico(a.icon)}<span>${esc(a.name)}</span></a>`).join('')}
        </nav>
        <a class="pf-back" href="#/home">返回工作台</a>
      </div>
      <div class="pf-body">
        <aside class="pf-side" aria-label="${esc(app.name)} 菜单"><div class="pf-side-inner">${side}</div></aside>
        <main class="pf-main">
          <div class="pf-head">
            <nav class="pf-crumb" aria-label="面包屑"><a href="${href(app.key)}">${esc(app.name)}</a><span>/</span><span>${esc(page.group)}</span><span>/</span><span>${esc(page.label)}</span></nav>
            <h1>${esc(page.label)}</h1>
            <p>${esc(page.desc || '')}</p>
          </div>
          <div class="pf-content">${content}</div>
        </main>
      </div>
      ${app.key === 'open' ? registerDialog() : ''}
    </div>`;
  }

  function registerDialog() {
    return `<dialog class="pf-dialog" id="register" aria-labelledby="register-title">
      <form method="dialog" data-register-form>
        <header><h3 id="register-title">注册应用</h3><button type="button" class="pf-op" data-close-dialog aria-label="关闭">关闭</button></header>
        <div class="pf-dialog-body">
          <label class="pf-field">应用名称<input class="pf-input" name="name" required placeholder="如：智慧食堂"></label>
          <label class="pf-field">应用编码<input class="pf-input" name="code" required placeholder="5 位数字" pattern="\\d{5}"></label>
          <label class="pf-field">应用类型<select class="pf-input" name="type">${P.APP_CATS.map(c => `<option>${esc(c)}</option>`).join('')}</select></label>
          <label class="pf-field">适用平台<select class="pf-input" name="platform"><option>Web</option><option>移动端</option><option>微校+</option><option>班牌</option></select></label>
          <label class="pf-field">回调地址<input class="pf-input" name="callback" type="url" placeholder="https://"></label>
          <div class="pf-keys" data-keys hidden></div>
        </div>
        <footer><button type="button" class="dy-btn dy-btn-ghost" data-close-dialog>取消</button><button type="submit" class="dy-btn dy-btn-primary">生成密钥并注册</button></footer>
      </form>
    </dialog>`;
  }

  DY.renderPlatform = function (parts) {
    const app = appBy(parts[1]);
    if (!app) { location.replace(href('dp')); return ''; }
    const pages = pagesOf(app.key);
    const page = pages.find(p => p.key === parts[2]);
    if (!page) { location.replace(href(app.key, pages[0].key)); return ''; }
    const ctx = { app: app.key, sub: parts[3] };
    const view = VIEWS[page.view] || viewTable;
    document.title = `${page.label} · ${app.name} · ${DY.SCHOOL.name}`;
    return shell(app, page, view(page, ctx));
  };

  /* ---------- 交互 ---------- */
  DY.toast = function (msg, tone = '') {
    let box = document.querySelector('.pf-toast-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'pf-toast-box';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = `pf-toast ${tone ? 'is-' + tone : ''}`;
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  };

  function applyMarketFilter(root) {
    const get = k => root.querySelector(`[data-mf="${k}"] .is-active`)?.dataset.v ?? '';
    const installed = get('installed');
    const type = get('type');
    const cat = get('cat');
    const q = (root.querySelector('[data-mf-search]')?.value || '').trim();
    let shown = 0;
    document.querySelectorAll('[data-app-card]').forEach(card => {
      const ok = (!installed || card.dataset.installed === installed) && (!type || card.dataset.type === type)
        && (!cat || card.dataset.cat === cat) && (!q || card.dataset.name.includes(q));
      card.hidden = !ok;
      if (ok) shown++;
    });
    const empty = document.querySelector('[data-market-empty]');
    if (empty) empty.hidden = shown > 0;
  }

  async function digest(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return btoa(unescape(encodeURIComponent(text))).split('').reverse().join('');
    }
  }

  function setLoginPanel() {
    const box = document.querySelector('[data-login-panel]');
    if (box) box.innerHTML = loginPanelHtml();
    if (LOGIN.step === 'done') LOGIN.lastActive = now();
    tickSession();
  }

  function tickSession() {
    const el = document.querySelector('[data-session]');
    if (!el || LOGIN.step !== 'done') return;
    const left = Math.max(0, 15 * 60 * 1000 - (now() - LOGIN.lastActive));
    if (left <= 0) {
      LOGIN.step = 'login';
      setLoginPanel();
      DY.toast('15 分钟未操作，登录已失效，请重新登录', 'warn');
      return;
    }
    const s = Math.ceil(left / 1000);
    el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  setInterval(tickSession, 1000);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pf')) return;
    if (LOGIN.step === 'done' && e.target.closest('[data-login-panel]') && !e.target.closest('[data-session-expire]')) LOGIN.lastActive = now();

    const seg = e.target.closest('.pf-seg > button');
    if (seg) {
      seg.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === seg));
      const market = seg.closest('[data-market]');
      if (market) applyMarketFilter(market);
      const role = seg.closest('[data-login-role]');
      if (role) { LOGIN.role = seg.dataset.v; LOGIN.fails = 0; setLoginPanel(); }
      return;
    }

    const tab = e.target.closest('[data-tab]');
    if (tab) {
      const prefix = tab.dataset.tab.replace(/-\d+$/, '');
      tab.parentElement.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('is-active', b === tab));
      document.querySelectorAll(`[data-tab-panel^="${prefix}-"]`).forEach(p => { p.hidden = p.dataset.tabPanel !== tab.dataset.tab; });
      return;
    }

    const node = e.target.closest('[data-tree-node]');
    if (node) {
      const li = node.parentElement;
      if (li.querySelector('ul')) li.classList.toggle('is-open');
      node.closest('.pf-tree').querySelectorAll('[data-tree-node]').forEach(n => n.classList.toggle('is-active', n === node));
      return;
    }

    const install = e.target.closest('[data-install]');
    if (install) {
      const card = install.closest('[data-app-card]');
      card.dataset.installed = '1';
      install.outerHTML = '<span class="pf-tag is-ok">已安装</span>';
      DY.toast(`已安装「${card.dataset.name}」，可在「应用授权」中分配角色`, 'ok');
      return;
    }

    const opener = e.target.closest('[data-open-dialog]');
    if (opener) { document.getElementById(opener.dataset.openDialog)?.showModal(); return; }
    const closer = e.target.closest('[data-close-dialog]');
    if (closer) { closer.closest('dialog')?.close(); return; }

    const copy = e.target.closest('[data-copy]');
    if (copy) {
      navigator.clipboard?.writeText(copy.dataset.copy).then(() => DY.toast('已复制接口地址', 'ok'), () => DY.toast('复制失败，请手动选择'));
      return;
    }

    const campus = e.target.closest('[data-campus]');
    if (campus) { LOGIN.campus = campus.dataset.campus; LOGIN.step = 'sms'; setLoginPanel(); return; }
    if (e.target.closest('[data-sms-send]')) {
      LOGIN.code = String(Math.floor(100000 + Math.random() * 900000));
      const hint = document.querySelector('[data-sms-hint]');
      if (hint) hint.textContent = `演示：验证码 ${LOGIN.code} 已发送（5 分钟内有效）`;
      return;
    }
    if (e.target.closest('[data-login-reset]')) { LOGIN.step = 'login'; setLoginPanel(); return; }
    if (e.target.closest('[data-session-expire]')) { LOGIN.lastActive = now() - 15 * 60 * 1000; tickSession(); return; }
    if (e.target.closest('[data-ff]')) {
      LOGIN.offset += 5 * 60 * 1000;
      const left = LOGIN.lockedUntil - now();
      DY.toast(left > 0 ? `时间已前进 5 分钟，锁定剩余约 ${Math.ceil(left / 60000)} 分钟` : '时间已前进 5 分钟');
      tickSession();
      return;
    }
    if (e.target.closest('[data-login-clear]')) {
      Object.assign(LOGIN, { fails: 0, lockedUntil: 0, offset: 0, step: 'login', campus: '', code: '' });
      setLoginPanel();
      return;
    }

    const demo = e.target.closest('[data-demo]');
    if (demo) DY.toast(`「${demo.dataset.demo}」将对接现有系统功能`);
  });

  document.addEventListener('change', (e) => {
    const group = e.target.closest('[data-check-group]');
    if (group) {
      group.closest('[data-check-scope]').querySelectorAll('input[type="checkbox"]').forEach(c => { c.checked = group.checked; });
      return;
    }
    const all = e.target.closest('[data-check-all]');
    if (all) all.closest('table').querySelectorAll('tbody input[type="checkbox"]').forEach(c => { c.checked = all.checked; });
  });

  document.addEventListener('input', async (e) => {
    if (e.target.matches('[data-mf-search]')) { applyMarketFilter(e.target.closest('[data-market]')); return; }
    if (e.target.matches('[data-login-form] input[name="password"]')) {
      const out = document.querySelector('[data-cipher]');
      const v = e.target.value;
      if (out) out.textContent = v ? `前端加密传输：sha256 = ${(await digest(v)).slice(0, 32)}…` : '前端加密传输：输入密码后显示';
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.matches('[data-login-form]')) {
      e.preventDefault();
      const hint = form.querySelector('[data-login-hint]');
      const left = LOGIN.lockedUntil - now();
      if (left > 0) {
        const msg = `请在${Math.ceil(left / 60000)}分钟后再次登录`;
        DY.toast(msg, 'warn');
        hint.textContent = `账号已锁定 · ${msg}`;
        return;
      }
      if (form.password.value !== PASSWORD) {
        LOGIN.fails += 1;
        if (LOGIN.fails >= 3) {
          LOGIN.lockedUntil = now() + 15 * 60 * 1000;
          LOGIN.fails = 0;
          DY.toast('账号或密码错误，请在15分钟后再次登录', 'danger');
          hint.textContent = '账号已锁定 15 分钟（已保留输入的账号与密码）';
        } else {
          DY.toast(`账号或密码错误，还可尝试 ${3 - LOGIN.fails} 次`, 'danger');
          hint.textContent = `已连续错误 ${LOGIN.fails} 次`;
        }
        return;
      }
      LOGIN.fails = 0;
      LOGIN.step = LOGIN.role === 'admin' ? 'campus' : 'done';
      setLoginPanel();
      return;
    }
    if (form.matches('[data-sms-form]')) {
      e.preventDefault();
      if (!LOGIN.code || form.code.value !== LOGIN.code) { DY.toast('验证码错误或未获取', 'danger'); return; }
      LOGIN.step = 'done';
      setLoginPanel();
      DY.toast('双因子验证通过', 'ok');
      return;
    }
    if (form.matches('[data-register-form]')) {
      e.preventDefault();
      const rnd = n => Array.from(crypto.getRandomValues(new Uint8Array(n))).map(b => b.toString(16).padStart(2, '0')).join('');
      const keys = form.querySelector('[data-keys]');
      keys.hidden = false;
      keys.innerHTML = `<p>注册成功，请妥善保存（AppSecret 仅显示一次）：</p><code class="pf-mono">AppKey: ak_${rnd(8)}</code><code class="pf-mono">AppSecret: ${rnd(16)}</code>`;
      DY.toast(`「${form.name.value}」已注册，待管理员审核`, 'ok');
    }
  });

  let dragRow = null;
  document.addEventListener('dragstart', (e) => {
    const row = e.target.closest?.('[data-sortable] tbody tr');
    if (!row) return;
    dragRow = row;
    row.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  document.addEventListener('dragover', (e) => {
    const row = e.target.closest?.('[data-sortable] tbody tr');
    if (!dragRow || !row || row === dragRow || row.parentElement !== dragRow.parentElement) return;
    e.preventDefault();
    const rect = row.getBoundingClientRect();
    row.parentElement.insertBefore(dragRow, e.clientY > rect.top + rect.height / 2 ? row.nextSibling : row);
  });
  document.addEventListener('dragend', () => {
    if (!dragRow) return;
    dragRow.classList.remove('is-dragging');
    dragRow = null;
    DY.toast('排序已更新', 'ok');
  });
})();
