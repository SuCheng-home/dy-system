(function () {
  const esc = DY.escape;

  const TOOL_SVGS = {
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"/><path d="M5 12h14"/></svg>',
    barcode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7v10M7 7v10M10 7v10M12 7v10M15 7v10M18 7v10M21 7v10"/></svg>',
    face: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8"/></svg>',
  };

  function render() {
    const user = DY.USER.teacher;
    document.getElementById('app').innerHTML = `
      <div class="dym-stage">
        <div class="dym-phone" data-mobile-shell>
          <div class="dym-app">
            <header class="dym-banner" aria-hidden="true">
              <div class="dym-banner-photo"></div>
              <div class="dym-banner-mask"></div>
            </header>
            <div class="dym-id-card">
              <img class="dym-avatar" src="${esc(user.avatar)}" alt="">
              <div class="dym-id-meta">
                <h1>${esc(user.name)}</h1>
                <p>${esc(DY.SCHOOL.name)}</p>
              </div>
              <div class="dym-tools" aria-label="快捷工具">
                <span class="dym-tool" title="扫一扫">${TOOL_SVGS.scan}</span>
                <span class="dym-tool" title="扫码">${TOOL_SVGS.barcode}</span>
                <span class="dym-tool" title="人脸">${TOOL_SVGS.face}</span>
              </div>
            </div>
            <div class="dym-body">
              ${DY.TEACHER_GROUPS.map(group => `
                <section class="dym-card" style="--c:${esc(group.color)}">
                  <div class="dym-card-head">
                    <span class="dym-card-dot"></span>
                    <h2>${esc(group.title)}</h2>
                  </div>
                  <div class="dym-palace">
                    ${group.apps.map(app => `
                      <div class="dym-cell" title="本期不可点">
                        ${DY.iconDisc(app.icon, app.color)}
                        <strong>${esc(app.title)}</strong>
                      </div>
                    `).join('')}
                  </div>
                </section>
              `).join('')}
              <div class="dym-footer-links">
                <a href="index.html">管理端</a>
                <a href="parent-mobile.html">家长端</a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  render();
})();
