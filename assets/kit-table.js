/* ======================================================================
   MILL DOCS — KIT TABLE HELPER
   Shared by every page that displays a parts/materials table
   (e.g. finishing-mill.html, intermediate-mill.html, tmt-materials.html).

   Usage on a page:
     <script src="assets/kit-table.js"></script>
     <script>
       const KIT_DATA = [ { code:"...", size:"...", desc:"...", qty:"..." }, ... ];
       initKitPage({
         data: KIT_DATA,
         tbodyId: "kitTableBody",
         noResultsId: "noResults",
         pdfBtnId: "exportPdfBtn",
         pdfTitle: "FINISHING MILL FITTER TOOL BOX"
       });
     </script>
   Search box lives in the topbar (#globalSearch) and filters THIS page's
   table only — kept local on purpose so every page works standalone,
   even opened straight off disk with no server.
   ====================================================================== */

function kitHighlight(text, query) {
  if (!text || !query) return text || "—";
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text;
  return text.slice(0, idx) + "<mark>" + text.slice(idx, idx + query.length) + "</mark>" + text.slice(idx + query.length);
}

function renderKitTable(kit, tbodyId, noResultsId, query) {
  const tbody = document.getElementById(tbodyId);
  const noResults = document.getElementById(noResultsId);
  if (!tbody) return;
  const tableEl = tbody.closest(".kit-table");

  const rows = kit.filter(
    (k) =>
      !query ||
      k.code.toLowerCase().includes(query) ||
      k.size.toLowerCase().includes(query) ||
      k.desc.toLowerCase().includes(query)
  );

  if (rows.length === 0) {
    tbody.innerHTML = "";
    tableEl.style.display = "none";
    if (noResults) noResults.classList.add("show");
  } else {
    tableEl.style.display = "table";
    if (noResults) noResults.classList.remove("show");
    tbody.innerHTML = rows
      .map(
        (k) => `
        <tr class="${k.isSet ? "set-child" : ""}">
          <td class="code">${k.code ? kitHighlight(k.code, query) : "—"}</td>
          <td class="size">${kitHighlight(k.size, query)}</td>
          <td class="desc">${kitHighlight(k.desc, query)}</td>
          <td class="qty ${k.qty ? "" : "empty"}">${k.qty ? kitHighlight(k.qty, query) : "—"}</td>
        </tr>`
      )
      .join("");
  }
}

function initKitSearch(data, tbodyId, noResultsId) {
  const input = document.getElementById("globalSearch");
  const feedback = document.getElementById("search-feedback");
  const clear = document.getElementById("clearSearch");

  function run() {
    const query = input ? input.value.trim().toLowerCase() : "";
    if (feedback) feedback.style.display = query ? "block" : "none";
    renderKitTable(data, tbodyId, noResultsId, query);
  }

  if (input) input.addEventListener("input", run);
  if (clear)
    clear.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      run();
    });

  run();
}

function initKitPdfExport(btnId, pdfTitle, data) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener("click", () => {
    const printWindow = document.createElement("div");
    printWindow.style.padding = "20px";
    printWindow.style.background = "#ffffff";
    printWindow.style.color = "#000000";
    printWindow.style.fontFamily = "var(--mono)";

    const mainTitle = document.createElement("h1");
    mainTitle.innerText = pdfTitle;
    mainTitle.style.fontFamily = "var(--mono)";
    mainTitle.style.fontSize = "22px";
    mainTitle.style.borderBottom = "2px solid #000000";
    mainTitle.style.paddingBottom = "8px";
    mainTitle.style.marginBottom = "30px";
    mainTitle.style.textTransform = "uppercase";
    printWindow.appendChild(mainTitle);

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.innerHTML = `
      <thead>
        <tr style="border-bottom: 1px solid #000000; font-size: 11px;">
          <th style="text-align: left; padding: 6px; font-family: var(--mono);">MAT CODE</th>
          <th style="text-align: left; padding: 6px; font-family: var(--mono);">SIZE</th>
          <th style="text-align: left; padding: 6px; font-family: var(--mono);">DESCRIPTION</th>
          <th style="text-align: center; padding: 6px; font-family: var(--mono);">QTY</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item) => `
          <tr style="border-bottom: 1px solid #e0e0e0; font-size: 11px; ${item.isSet ? "color: #555555; font-style: italic;" : ""}">
            <td style="padding: 6px; font-family: var(--mono);">${item.code || "—"}</td>
            <td style="padding: 6px; font-family: var(--mono);">${item.size || "—"}</td>
            <td style="padding: 6px; font-family: var(--mono);">${item.desc}</td>
            <td style="padding: 6px; text-align: center; font-family: var(--mono);">${item.qty || "—"}</td>
          </tr>`
          )
          .join("")}
      </tbody>`;
    printWindow.appendChild(table);

    const opt = {
      margin: 15,
      filename: pdfTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(printWindow).save();
  });
}

function initKitPage({ data, tbodyId, noResultsId, pdfBtnId, pdfTitle }) {
  initKitSearch(data, tbodyId, noResultsId);
  if (pdfBtnId) initKitPdfExport(pdfBtnId, pdfTitle, data);
}
