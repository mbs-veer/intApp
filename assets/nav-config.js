/* ======================================================================
   MILL DOCS — NAVIGATION CONFIG
   This is the ONLY place you need to touch when adding a new page.
   1. Create your new page (copy template.html, see its header comment).
   2. Add one entry below, inside an existing group or a new one.
   3. Give it the same "id" you set on <body data-page="..."> in that page.
   Sidebar + breadcrumb "Section" label on every page rebuild from this
   automatically — nothing else needs to change.
   ====================================================================== */
const NAV_CONFIG = [
  {
    type: "link",
    id: "home",
    label: "🏠 Home Dashboard",
    href: "index.html"
  },
  {
    type: "group",
    label: "Tool Kits",
    open: true,
    items: [
      { id: "finishing",    label: "Finishing Mill Fitter Box",    href: "finishing-mill.html" },
      { id: "intermediate", label: "Intermediate Mill Fitter Box", href: "intermediate-mill.html" }
    ]
  },
  {
    type: "group",
    label: "TMT System",
    open: true,
    items: [
      { id: "bolts", label: "TMT Materials", href: "tmt-materials.html" }
    ]
  }

  /* Example — adding a brand-new section:
  {
    type: "group",
    label: "New Section",
    open: true,
    items: [
      { id: "my-new-page", label: "My New Page", href: "my-new-page.html" }
    ]
  }
  */
];
