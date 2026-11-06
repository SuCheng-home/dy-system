(function () {
  const esc = DY.escape;
  const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五'];
  const todayIdx = Math.min(Math.max(new Date().getDay() - 1, 0), 4);

  function routeParts() {
    const hash = location.hash.replace(/^#\/?/, '') || 'home';
    return hash.split(/[/?]/).filter(Boolean);
  }

  function primaryKey(parts) {
    const key = parts[0] || 'home';
    return DY.PC_NAV.some(n => n.key === key) ? key : 'home';
  }

  function defaultPath(key) {
    return DY.PC_NAV.find(n => n.key === key)?.path || '#/home';
  }

  function activePathFor(parts) {
    const key = primaryKey(parts);
    if (key === 'home') return '#/home';
    if (parts.length === 1) return defaultPath(key);
    return '#/' + parts.join('/');
  }

  function pageMeta(sidebar, path) {
    for (const item of sidebar || []) {
      if (item.children) {
        const child = item.children.find(c => c.path === path);
        if (child) return { ...child, parent: item.label };
      } else if (item.path === path) {
        return item;
      }
    }
    return { label: '栏目' };
  }

  function navIcon(key) {
    const svg = DY.ICONS[key] || DY.ICONS.notice;
    return `<span class="dy-side-ico" aria-hidden="true">${svg}</span>`;
  }

  function headerHtml(active) {
    const user = DY.USER.admin;
    return `<header class="dy-header">
      <a class="dy-brand" href="#/home">
        <img src="assets/seal.svg" alt="${esc(DY.SCHOOL.short)}">
        <div class="dy-brand-text">
          <strong>${esc(DY.SCHOOL.name)}</strong>
          <span>${esc(DY.SCHOOL.nameEn)}</span>
        </div>
      </a>
      <nav class="dy-nav" aria-label="主导航">
        ${DY.PC_NAV.map(item => `
          <a href="${esc(item.path)}" class="${item.key === active ? 'is-active' : ''}">${esc(item.label)}</a>
        `).join('')}
      </nav>
      <div class="dy-header-right">
        <a class="dy-header-link" href="${esc(DY.SCHOOL.websiteUrl)}" title="本期不可点">${esc(DY.SCHOOL.websiteLabel)}</a>
        <div class="dy-user">
          <span class="dy-user-avatar">${esc(user.avatar)}</span>
          <span>${esc(user.name)}</span>
        </div>
      </div>
    </header>`;
  }

  function demoBarHtml() {
    return `<div class="dy-demo-bar">
      <span>演示框架 · 江苏省丹阳高级中学智慧校园</span>
      <a href="mobile.html">老师移动端</a>
      <a href="parent-mobile.html">家长移动端</a>
    </div>`;
  }

  function pageHome() {
    const todayLabel = WEEKDAYS[todayIdx];
    return `<div class="dy-page">
      <div class="dy-dash">
        <aside>
          <section class="dy-card">
            <div class="dy-card-head">个人工作台</div>
            <div class="dy-card-body">
              <div class="dy-profile">
                <div class="dy-profile-avatar">${esc(DY.USER.admin.name.slice(0, 1))}</div>
                <div>
                  <h3>${esc(DY.USER.admin.name)}</h3>
                  <p>${esc(DY.SCHOOL.name)}</p>
                </div>
              </div>
              <div class="dy-att-title">本月考勤</div>
              <div class="dy-att-row">
                <div><strong>0</strong><span>正常</span></div>
                <div><strong>0</strong><span>请假</span></div>
                <div><strong>0</strong><span>外出</span></div>
              </div>
            </div>
          </section>
          <section class="dy-card">
            <div class="dy-card-head">
              <span>待办事项</span>
              <a href="#/office/venue/today">更多</a>
            </div>
            <div class="dy-card-body">
              <div class="dy-todo-empty">暂无待办</div>
            </div>
          </section>
          <section class="dy-card">
            <div class="dy-card-head">今日课表</div>
            <div class="dy-card-body">
              <div class="dy-tabs" data-schedule-tabs>
                ${WEEKDAYS.map((d, i) => `
                  <button type="button" class="${i === todayIdx ? 'is-active' : ''}" data-day="${i}">${esc(d)}</button>
                `).join('')}
              </div>
              <div class="dy-schedule-empty" data-schedule-body>今日（${esc(todayLabel)}）暂无课表数据</div>
            </div>
          </section>
        </aside>

        <main>
          <div class="dy-motto">
            <img src="assets/motto-banner.jpg" alt="${esc(DY.SCHOOL.motto)}：校训校风教风学风">
          </div>
          <section class="dy-card">
            <div class="dy-card-head">常用入口</div>
            <div class="dy-card-body">
              <div class="dy-shortcuts">
                ${DY.PC_SHORTCUTS.map(item => item.href ? `
                  <a class="dy-shortcut is-link" href="${esc(item.href)}" data-hub-link>
                    ${DY.iconDisc(item.icon, item.color)}
                    <strong>${esc(item.title)}</strong>
                  </a>
                ` : `
                  <div class="dy-shortcut" title="本期不可点">
                    ${DY.iconDisc(item.icon, item.color)}
                    <strong>${esc(item.title)}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
          <section class="dy-card">
            <div class="dy-card-head">文明班级评比</div>
            <div class="dy-card-body">
              <div class="dy-filter">
                <input type="date" value="2026-10-28" aria-label="日期">
                <select aria-label="范围"><option>全部</option></select>
                <select aria-label="年级"><option>高三年级</option><option>高二年级</option><option>高一年级</option></select>
                <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">查询</button>
                <button type="button" class="dy-btn dy-btn-ghost" title="本期不可点">重置</button>
              </div>
              <div class="dy-table-wrap">
                <table class="dy-table">
                  <thead>
                    <tr>
                      <th class="is-left">班级</th>
                      <th>总计</th>
                      <th>总分排名</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="3">暂无数据</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        <aside>
          <section class="dy-card">
            <div class="dy-card-head">
              <span>通知公告</span>
              <a href="#/family/notice/inbox">更多</a>
            </div>
            <div class="dy-card-body">
              <div class="dy-notice-empty">暂无通知</div>
            </div>
          </section>
        </aside>
      </div>
    </div>`;
  }

  function sidebarHtml(sidebar, activePath) {
    return `<aside class="dy-sidebar">
      <div class="dy-sidebar-inner">
        ${sidebar.map(item => {
          if (item.children?.length) {
            const open = item.defaultOpen || item.children.some(c => c.path === activePath);
            return `<div class="dy-side-group ${open ? 'is-open' : ''}">
              <button type="button" class="dy-side-parent" data-action="toggleSideGroup">
                ${navIcon(item.icon)}
                <span>${esc(item.label)}</span>
                <span class="dy-side-caret" aria-hidden="true"></span>
              </button>
              <div class="dy-side-children">
                ${item.children.map(child => `
                  <a class="dy-side-child ${child.path === activePath ? 'is-active' : ''}" href="${esc(child.path)}">${esc(child.label)}</a>
                `).join('')}
              </div>
            </div>`;
          }
          return `<a class="dy-side-item ${item.path === activePath ? 'is-active' : ''}" href="${esc(item.path)}">
            ${navIcon(item.icon)}
            <span>${esc(item.label)}</span>
            ${item.pendingChildren ? '<span class="dy-side-caret" aria-hidden="true"></span>' : ''}
          </a>`;
        }).join('')}
      </div>
    </aside>`;
  }

  function pageModuleShell(meta) {
    return `<div class="dy-module-panel">
      <div class="dy-placeholder dy-placeholder-inline">
        <h2>${esc(meta.label)}</h2>
        <p>${meta.parent ? esc(meta.parent) + ' · ' : ''}栏目壳已就绪，列表与表单后续按你的意见接入。</p>
      </div>
    </div>`;
  }

  function pageNoticeInbox() {
    return `<div class="dy-module-panel">
      <div class="dy-table-wrap">
        <table class="dy-table dy-table-list">
          <thead>
            <tr>
              <th style="width:88px">序号</th>
              <th class="is-left">标题</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="2" class="dy-table-empty">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function pageVenueToday() {
    return `<div class="dy-module-panel dy-panel-pad">
      <div class="dy-filter">
        <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">预约</button>
        <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">当日明细</button>
        <input type="date" value="2026-10-28" aria-label="日期">
      </div>
      <div class="dy-table-wrap">
        <table class="dy-table dy-table-list">
          <thead>
            <tr><th class="is-left">资源名称</th></tr>
          </thead>
          <tbody>
            ${DY.VENUE_RESOURCES.map(name => `
              <tr><td class="is-left dy-cell-link">${esc(name)}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function pageSms() {
    return `<div class="dy-module-panel dy-panel-pad">
      <div class="dy-kpi-row">
        <div class="dy-kpi"><span>短信额度</span><strong>0</strong></div>
        <div class="dy-kpi"><span>已使用</span><strong class="is-ok">0</strong></div>
        <div class="dy-kpi"><span>短信剩余</span><strong class="is-warn">0</strong></div>
        <div class="dy-kpi-ring" aria-hidden="true"><span>0%</span></div>
      </div>
      <section class="dy-card dy-card-flat">
        <div class="dy-card-head">近一月使用情况</div>
        <div class="dy-card-body">
          <div class="dy-chart-empty">条数 · 暂无统计数据</div>
        </div>
      </section>
    </div>`;
  }

  function pageClassEvalDate() {
    return `<div class="dy-module-panel dy-panel-pad">
      <div class="dy-filter">
        <input type="date" value="2026-10-28" aria-label="日期">
        <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">一键满分</button>
      </div>
      <div class="dy-table-wrap">
        <table class="dy-table dy-table-list">
          <thead>
            <tr><th class="is-left">班级</th></tr>
          </thead>
          <tbody>
            <tr><td class="dy-table-empty">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function pageLeaveStats() {
    return `<div class="dy-module-panel dy-panel-pad">
      <div class="dy-filter">
        <input type="text" value="2026-10-01 - 2026-10-28" aria-label="日期范围" readonly>
        <select aria-label="状态"><option>全部状态</option></select>
        <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">统计</button>
      </div>
      <div class="dy-table-wrap">
        <table class="dy-table dy-table-list">
          <thead>
            <tr>
              <th class="is-left">学生姓名</th>
              <th>班级</th>
              <th>是否住校生</th>
              <th>请假类型</th>
              <th>体温</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="6" class="dy-table-empty">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function pageVisitStats() {
    return `<div class="dy-module-panel dy-panel-pad">
      <div class="dy-filter">
        <input type="text" value="2026-10-01 - 2026-10-28" aria-label="日期范围" readonly>
        <select aria-label="来访状态"><option>全部来访状态</option></select>
        <button type="button" class="dy-btn dy-btn-ghost" title="本期不可点">导出</button>
        <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">数据看板</button>
      </div>
      <div class="dy-table-wrap">
        <table class="dy-table dy-table-list">
          <thead>
            <tr>
              <th class="is-left">来访人</th>
              <th>手机号</th>
              <th>来访时间</th>
              <th class="is-left">来访事由</th>
            </tr>
          </thead>
          <tbody>
            ${DY.VISIT_DEMO_ROWS.map(row => `
              <tr>
                <td class="is-left">${esc(row.name)}</td>
                <td>${esc(row.phone)}</td>
                <td>${esc(row.time)}</td>
                <td class="is-left">${esc(row.reason)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function pageUsers() {
    return `<div class="dy-module-panel dy-users">
      <aside class="dy-users-tree">
        <input class="dy-users-search" type="search" placeholder="查找部门" aria-label="查找部门">
        <ul class="dy-tree">
          <li class="is-open">
            <button type="button" class="dy-tree-node is-root">${esc(DY.SCHOOL.name)}</button>
            <ul>
              <li><button type="button" class="dy-tree-node">校友</button></li>
              <li><button type="button" class="dy-tree-node is-active">教职工</button></li>
              <li><button type="button" class="dy-tree-node">学生</button></li>
            </ul>
          </li>
        </ul>
      </aside>
      <div class="dy-users-main">
        <div class="dy-users-toolbar">
          <strong>${esc(DY.SCHOOL.name)}</strong>
          <label class="dy-switch"><input type="checkbox"> 修改部门</label>
          <div class="dy-users-actions">
            <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">同步</button>
            <button type="button" class="dy-btn dy-btn-primary" title="本期不可点">移动到</button>
            <button type="button" class="dy-btn dy-btn-ghost" disabled>删除用户</button>
          </div>
        </div>
        <div class="dy-table-wrap">
          <table class="dy-table dy-table-list">
            <thead>
              <tr>
                <th style="width:40px"><input type="checkbox" aria-label="全选"></th>
                <th style="width:64px">头像</th>
                <th class="is-left">姓名</th>
                <th class="is-left">部门</th>
                <th>用户名</th>
              </tr>
            </thead>
            <tbody>
              ${DY.USER_DEMO_ROWS.map(row => `
                <tr>
                  <td><input type="checkbox" aria-label="选择${esc(row.name)}"></td>
                  <td><span class="dy-user-avatar">${esc(row.name.slice(0, 1))}</span></td>
                  <td class="is-left dy-cell-link">${esc(row.name)}</td>
                  <td class="is-left">${esc(row.dept)}</td>
                  <td>${esc(row.username)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  const PAGE_VIEWS = {
    '#/family/notice/inbox': pageNoticeInbox,
    '#/office/venue/today': pageVenueToday,
    '#/av/sms': pageSms,
    '#/evaluation/class-eval/date': pageClassEvalDate,
    '#/student/leave-stats': pageLeaveStats,
    '#/family/leave-stats': pageLeaveStats,
    '#/safety/visit/stats': pageVisitStats,
    '#/system/users': pageUsers,
  };

  function pageModule(parts) {
    const key = primaryKey(parts);
    const sidebar = DY.SIDEBARS[key];
    if (sidebar == null) return null;
    if (!sidebar.length) {
      const nav = DY.PC_NAV.find(n => n.key === key);
      return `<div class="dy-module">
        <aside class="dy-sidebar"><div class="dy-sidebar-inner">
          <div class="dy-side-empty">侧栏模块待定</div>
        </div></aside>
        <main class="dy-module-main">${pageModuleShell({ label: nav?.label || '栏目' })}</main>
      </div>`;
    }
    if (parts.length === 1) {
      location.replace(defaultPath(key));
      return '';
    }
    const path = activePathFor(parts);
    const meta = pageMeta(sidebar, path);
    const view = PAGE_VIEWS[path];
    const content = view ? view() : pageModuleShell(meta);
    return `<div class="dy-module">
      ${sidebarHtml(sidebar, path)}
      <main class="dy-module-main">${content}</main>
    </div>`;
  }

  function render() {
    const parts = routeParts();
    const active = primaryKey(parts);
    let main = '';
    if (active === 'home') main = pageHome();
    else main = pageModule(parts);
    if (main === '') return;
    if (!main) {
      const nav = DY.PC_NAV.find(n => n.key === active) || DY.PC_NAV[0];
      main = `<div class="dy-page"><div class="dy-placeholder"><h2>${esc(nav.label)}</h2><p>栏目框架已就绪。</p></div></div>`;
    }
    document.getElementById('app').innerHTML = `${demoBarHtml()}${headerHtml(active)}${main}`;
  }

  document.getElementById('app').addEventListener('click', (e) => {
    const hub = e.target.closest('[data-hub-link]');
    if (hub) {
      // 同页绝对路径跳转，避免预览器把 target=_blank 拦成 about:blank#blocked
      e.preventDefault();
      location.assign(new URL(hub.getAttribute('href'), location.href).href);
      return;
    }
    const toggle = e.target.closest('[data-action="toggleSideGroup"]');
    if (toggle) {
      toggle.closest('.dy-side-group')?.classList.toggle('is-open');
      return;
    }
    const tab = e.target.closest('[data-day]');
    if (!tab || !tab.closest('[data-schedule-tabs]')) return;
    const wrap = tab.closest('[data-schedule-tabs]');
    wrap.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === tab));
    const body = document.querySelector('[data-schedule-body]');
    if (body) {
      const label = WEEKDAYS[Number(tab.dataset.day)] || '';
      body.textContent = `${label}暂无课表数据`;
    }
  });

  window.addEventListener('hashchange', render);
  if (!location.hash) location.replace('#/home');
  else render();
})();
