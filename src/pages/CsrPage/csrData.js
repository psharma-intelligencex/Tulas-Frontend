/**
 * Static CSR gallery data.
 *
 * Extracted from CsrPage.jsx so there is exactly ONE source of truth: the page
 * renders from it, and scripts/prerender-seo.mjs imports it at build time to
 * emit schema.org ImageObject markup into dist/csr/index.html. Plain data with
 * no imports, so both Node (the prerender script) and Vite (the browser bundle)
 * can load it.
 */

// Gallery images shown under "Moments That Inspire Change". Served as frontend
// static assets from /public/csr/ - intentionally NOT from the backend, so this
// gallery is self-contained and never depends on VITE_SERVER_URL or the
// production server.
//
// `width`/`height` are the files' real intrinsic pixel sizes (measured from the
// sources, never guessed). `alt` describes what each photo actually shows -
// previously every card fell back to the same generic "CSR moment" string
// because it read an `eventName` field that does not exist on this data.
//
// NOTE: csr11.png is a JPEG that carries a .png extension. Browsers sniff the
// real type and render it correctly, so the filename is left alone (renaming it
// would change a live asset URL).
export const GALLERY_IMAGES = [
  {
    imageURL: "/csr/csr1.jpg",
    width: 1200,
    height: 1600,
    alt: "UPES CSA volunteer presenting a cyber-safety awareness slide on the Five Habits of a Trust Guardian to participants seated in a computer lab",
  },
  {
    imageURL: "/csr/csr3.jpg",
    width: 1200,
    height: 1600,
    alt: "UPES CSA volunteer addressing participants at their workstations during a digital literacy outreach session",
  },
  {
    imageURL: "/csr/csr5.jpg",
    width: 900,
    height: 1600,
    alt: "Group photo of participants and UPES CSA volunteers at the close of a community outreach session",
  },
  {
    imageURL: "/csr/csr11.png",
    width: 1200,
    height: 1600,
    alt: "Certificate of appreciation presented to a session facilitator at a UPES CSA community outreach programme",
  },
];
