(function () {
  const esc = DY.escape;

  function render() {
    const child = DY.USER.parentChild;
    document.getElementById('app').innerHTML = `
      <div class="dyp-stage">
        <div class="dyp-phone" data-mobile-shell>
          <div class="dyp-app">
            <header class="dyp-banner">
              <div class="dyp-banner-solid"></div>
              <div class="dyp-banner-photo" aria-hidden="true"></div>
              <div class="dyp-id">
                <img class="dyp-avatar" src="${esc(child.avatar)}" alt="">
                <div class="dyp-id-meta">
                  <div class="dyp-name-row">
                    <h1>${esc(child.name)}</h1>
                    <a class="dyp-chip" href="mobile.html" title="切换为老师">老师</a>
                  </div>
                  <p>${esc(child.className)} · ${esc(DY.SCHOOL.short)}</p>
                </div>
              </div>
            </header>
            <div class="dyp-body">
              ${DY.PARENT_GROUPS.map(group => `
                <section class="dyp-card" style="--c:${esc(group.color)}">
                  <div class="dyp-card-head">
                    <span class="dyp-card-dot"></span>
                    <h2>${esc(group.title)}</h2>
                  </div>
                  <div class="dyp-palace">
                    ${group.apps.map(app => `
                      <div class="dyp-cell" title="本期不可点">
                        ${DY.iconDisc(app.icon, app.color)}
                        <strong>${esc(app.title)}</strong>
                      </div>
                    `).join('')}
                  </div>
                </section>
              `).join('')}
              <div class="dyp-footer-links">
                <a href="index.html">管理端</a>
                <a href="mobile.html">老师端</a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  render();
})();
