/* ======================================================================
   MILL DOCS — SHARED NAV RENDERER
   Reads NAV_CONFIG (assets/nav-config.js) and builds:
     - the sidebar links
     - the current-page highlight
   Every page just needs:
     <body data-page="THIS_PAGE_ID">
       ... <nav class="sidebar" id="sidebar"></nav> ...
     <script src="assets/nav-config.js"></script>
     <script src="assets/nav.js"></script>
   ====================================================================== */
(function () {
  function buildSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || typeof NAV_CONFIG === "undefined") return;

    const activeId = document.body.getAttribute("data-page") || "";
    let html = "";

    NAV_CONFIG.forEach((entry) => {
      if (entry.type === "link") {
        html += `
          <div class="sidebar-section">
            <ul class="sidebar-list top-level">
              <li><a href="${entry.href}" class="${entry.id === activeId ? "current" : ""}">${entry.label}</a></li>
            </ul>
          </div>`;
      } else if (entry.type === "group") {
        const isOpenGroup = entry.open || entry.items.some((i) => i.id === activeId);
        html += `
          <details class="sidebar-section" ${isOpenGroup ? "open" : ""}>
            <summary>${entry.label}</summary>
            <ul class="sidebar-list">
              ${entry.items
                .map(
                  (item) =>
                    `<li><a href="${item.href}" class="${item.id === activeId ? "current" : ""}">${item.label}</a></li>`
                )
                .join("")}
            </ul>
          </details>`;
      }
    });

    sidebar.innerHTML = html;
  }

  function setupMobileToggle() {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove("open");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildSidebar();
    setupMobileToggle();
  });
})();
