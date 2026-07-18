/**
 * Post-build SEO prerender.
 *
 * Generates one static HTML file per public route (dist/<route>/index.html)
 * whose <head> carries route-specific metadata (title, description, canonical,
 * Open Graph, Twitter). The <body> — the empty `<div id="root">` and the exact
 * same hashed <script> tags — is byte-for-byte identical to dist/index.html, so
 * the client app boots and renders EXACTLY as before. Only the head differs.
 *
 * Vercel serves these static files ahead of the SPA rewrite ("/(.*)" ->
 * "/index.html"), so crawlers and social scrapers receive correct per-page
 * metadata with zero changes to the React app, routing, or components.
 *
 * The home route ("/") is intentionally left as the build's own dist/index.html
 * and is not regenerated here.
 *
 * Failure mode is intentionally non-fatal: if a tag pattern is ever not found
 * (e.g. a future build-tool change reformats the head), the script logs a
 * warning and keeps the template's value for that field instead of failing the
 * deploy. It never removes or duplicates tags — it only replaces in place.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The Team page's real roster, imported from the same module the React page
// renders from — so the Person markup below can never drift from what's on the
// page, and nothing in it is fabricated.
import { TEAM, IMAGE_DIMS } from "../src/pages/TeamPage/teamData.js";
// The CSR page's real static gallery, imported from the same module the React
// page renders from — so the ImageObject markup below can never drift from the
// images actually on the page.
import { GALLERY_IMAGES as CSR_GALLERY } from "../src/pages/CsrPage/csrData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");
const ORIGIN = "https://upescsa.in";

// Public routes with unique, content-accurate metadata. Keys are the URL slug.
const PAGES = {
  events: {
    title: "UPES CSA Events | Workshops, Hackathons & Tech Events",
    description:
      "Explore workshops, hackathons, cybersecurity events, technical sessions, and student activities organised by the UPES Cloud Security Alliance student chapter.",
    // Event-specific social image (a real banner already in public/img/
    // pageheaders). Only the events route sets this; every other route and the
    // homepage keep the site-wide image from index.html untouched.
    image: {
      url: "/img/pageheaders/events.jpg",
      alt: "UPES CSA events, workshops and hackathons banner",
      width: 1881,
      height: 1058,
      // MIME type -> emits og:image:type + og:image:secure_url for this route.
      type: "image/jpeg",
    },
    // Reference the BreadcrumbList by @id rather than restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
  blogs: {
    title: "UPES CSA Blogs | Cybersecurity, Cloud & Tech Articles",
    description:
      "Read cybersecurity, cloud security, ethical hacking, development, and technology blogs written by students of the UPES Cloud Security Alliance (CSA) community.",
    // Blogs-specific social banner (a real image already in public/img/
    // pageheaders). Only the blogs route sets this; other routes and the
    // homepage keep the site-wide image from index.html untouched.
    image: {
      url: "/img/pageheaders/blogs.jpg",
      alt: "UPES CSA blogs - cybersecurity, cloud and tech articles",
      width: 1316,
      height: 555,
      // MIME type -> emits og:image:type + og:image:secure_url for this route
      // only. Other routes' image configs omit `type`, so their output is
      // unchanged (no secure_url/type tags added elsewhere).
      type: "image/jpeg",
    },
    // Listing page: emit a page-level Blog node (see pageLd below). No per-post
    // BlogPosting - posts are client-fetched, externally hosted, and have no
    // reliable publish date, so they cannot be marked up without fabrication.
    isBlog: true,
    // Reference the BreadcrumbList by @id rather than restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
  team: {
    title: "UPES CSA Team | Student Leaders in Cyber & Cloud Security",
    description:
      "Meet the student leaders of the UPES Cloud Security Alliance (CSA) team driving cybersecurity workshops, hackathons, and cloud security initiatives at UPES.",
    // Team-specific social banner (a real image already in public/img/
    // pageheaders). Only the team route sets this; other routes and the
    // homepage keep the site-wide image from index.html untouched. Dimensions
    // are the file's real intrinsic size, measured from the source.
    image: {
      url: "/img/pageheaders/team.jpg",
      alt: "UPES CSA team - student leaders in cloud and cyber security",
      width: 1316,
      height: 555,
      type: "image/jpeg",
    },
    // The page is a roster — a collection of people — so type the WebPage node
    // as a CollectionPage (see pageLd).
    webpageType: "CollectionPage",
    // Emit schema.org Person markup for every member, plus an ItemList that
    // becomes the page's mainEntity (see `roster` handling in pageLd). Built
    // strictly from the TEAM data the page itself renders — real names, roles,
    // photos and organisation only.
    roster: TEAM,
    // Reference the BreadcrumbList by @id instead of restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
  committees: {
    title: "Committees & Domains | UPES Cloud Security Alliance",
    description:
      "Explore the committees of the UPES Cloud Security Alliance - the student leadership driving cybersecurity workshops, hackathons, and cloud security outreach.",
    // Listing/collection page: type the WebPage node as CollectionPage (see
    // pageLd). The page lists committees fetched from the API (paginated), so
    // no per-member Person schema is emitted. No dedicated committee banner
    // exists in the repo, so the social image is intentionally left as the
    // site-wide default (never invented).
    webpageType: "CollectionPage",
    // Reference the BreadcrumbList by @id rather than restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
  csr: {
    title: "CSR & Community Outreach | UPES Cloud Security Alliance",
    description:
      "Corporate Social Responsibility drives, educational outreach, and community initiatives led by the UPES Cloud Security Alliance student chapter in Dehradun.",
    // CSR-specific social banner (a real image already in public/img/
    // pageheaders; dimensions are its true intrinsic size). Without this the
    // route fell back to the site-wide logo. Only the csr route sets it, so
    // every other route and the homepage are unaffected.
    image: {
      url: "/img/pageheaders/csr.jpg",
      alt: "UPES CSA CSR and community outreach",
      width: 616,
      height: 323,
      type: "image/jpeg",
    },
    // Emit schema.org ImageObject nodes for the page's real static gallery, and
    // point the WebPage at them (see `images` handling in pageLd). Built from
    // the same data the page renders — real files, real measured dimensions,
    // real descriptions. The bento images are fetched from the API at runtime,
    // so their URLs aren't known at build time and can't be marked up here.
    images: CSR_GALLERY,
    // Reference the BreadcrumbList by @id rather than restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
  alumni: {
    title: "UPES CSA Alumni Network | Cloud Security Graduates",
    description:
      "Connect with the UPES CSA alumni network - graduates of the Cloud Security Alliance chapter sharing mentorship, career guidance, and cybersecurity expertise.",
    // Listing/collection page: type the WebPage node as CollectionPage (see
    // pageLd). No dedicated alumni banner exists in the repo, so the social
    // image is intentionally left as the site-wide default (never invented).
    // The only alumni-related assets are a 1080x1080 AVIF (AVIF is not
    // supported as an og:image by Facebook/LinkedIn/X, so it would break the
    // preview) and a 1024x1280 portrait event poster - neither is a usable
    // social banner, so forcing one would be a regression.
    webpageType: "CollectionPage",
    // Emit a Person per alumnus plus an ItemList mainEntity, built from the
    // live directory fetched at build time (see `alumniData` below). Unlike the
    // Team roster - a static module we can import - the alumni directory only
    // exists in the API, so it is fetched once here (non-fatal).
    alumniRoster: true,
    // Give the BreadcrumbList an @id and have the WebPage reference it, instead
    // of restating a bare `{"@type":"BreadcrumbList"}` stub (a dangling node
    // that structured-data validators flag).
    linkBreadcrumb: true,
  },
  "become-a-member": {
    title: "Join CSA - Become a Member | UPES Cloud Security Alliance",
    description:
      "Join the UPES Cloud Security Alliance through the 2026-27 Registration Drive and become part of our student-led cybersecurity and cloud community at UPES.",
    // Reference the BreadcrumbList by @id rather than restating an empty
    // `{"@type":"BreadcrumbList"}` stub. See `linkBreadcrumb` in pageLd.
    linkBreadcrumb: true,
  },
};

const escapeAttr = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Stable, URL-safe fragment for a Person's @id (e.g. "Prof. Keshav Sinha" ->
// "prof-keshav-sinha"), so each member is an addressable node in the graph.
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Mirrors the Alumni page's own field cleaning: the directory stores "Nil" /
// "nan" placeholders for an unknown position or company, and the page hides
// them. Drop them here too, so a placeholder can never reach the markup.
const cleanField = (value) => {
  const s = String(value ?? "").trim();
  const lower = s.toLowerCase();
  return !s || lower === "nil" || lower === "nan" ? "" : s;
};

const templatePath = resolve(DIST, "index.html");
if (!existsSync(templatePath)) {
  console.error(
    "[prerender-seo] dist/index.html not found — run `vite build` first. Skipping."
  );
  process.exit(0);
}
const template = readFileSync(templatePath, "utf8");

// The /alumni directory is fetched from the API by the page at runtime, so -
// unlike the Team roster, which is a static module this script can import - the
// data isn't available locally. Fetch the same public endpoint once at build
// time so the Person / ItemList markup ships inside dist/alumni/index.html
// (visible to crawlers that don't run JS) instead of being injected on mount.
//
// Failure is deliberately NON-FATAL and scoped: if the API is unreachable, the
// build logs a warning and /alumni simply ships without the roster schema -
// exactly the output it has today. No other route reads this, and the request
// is skipped entirely unless a page opts in via `alumniRoster`.
let alumniData = null;
if (Object.values(PAGES).some((p) => p.alumniRoster)) {
  try {
    const response = await fetch(`${ORIGIN}/api/alumni/?order=desc`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload) ? payload : payload?.data ?? [];
    alumniData = rows.filter((row) => row && String(row.name ?? "").trim());
    console.log(
      `[prerender-seo] fetched ${alumniData.length} alumni for /alumni schema.`
    );
  } catch (error) {
    console.warn(
      `[prerender-seo] WARN: alumni fetch failed (${error.message}); /alumni ships without Person/ItemList schema.`
    );
    alumniData = null;
  }
}

let generated = 0;
for (const [slug, meta] of Object.entries(PAGES)) {
  const url = `${ORIGIN}/${slug}`;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);

  let html = template;

  // Each pattern matches a single tag (attribute values contain no ">"), across
  // newlines, and is replaced in place — never appended, so no duplication.
  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title"],
    [
      /<meta[^>]*\bname="description"[^>]*>/,
      `<meta name="description" content="${description}" />`,
      "description",
    ],
    [
      /<link[^>]*\brel="canonical"[^>]*>/,
      `<link rel="canonical" href="${url}" />`,
      "canonical",
    ],
    [
      /<meta[^>]*\bproperty="og:title"[^>]*>/,
      `<meta property="og:title" content="${title}" />`,
      "og:title",
    ],
    [
      /<meta[^>]*\bproperty="og:description"[^>]*>/,
      `<meta property="og:description" content="${description}" />`,
      "og:description",
    ],
    [
      /<meta[^>]*\bproperty="og:url"[^>]*>/,
      `<meta property="og:url" content="${url}" />`,
      "og:url",
    ],
    [
      /<meta[^>]*\bname="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${title}" />`,
      "twitter:title",
    ],
    [
      /<meta[^>]*\bname="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${description}" />`,
      "twitter:description",
    ],
  ];

  for (const [pattern, replacement, label] of replacements) {
    if (!pattern.test(html)) {
      console.warn(
        `[prerender-seo] WARN: "${label}" tag not found for /${slug}; keeping template value.`
      );
      continue;
    }
    html = html.replace(pattern, replacement);
  }

  // Per-page social image: only routes that declare their own `image` override
  // the site-wide Open Graph / Twitter image from index.html. Without it, every
  // other route and the homepage keep the existing image unchanged. Each tag is
  // replaced in place (never appended), so no duplication and no invented URLs.
  if (meta.image) {
    const imageUrl = `${ORIGIN}${meta.image.url}`;
    const imageAlt = escapeAttr(meta.image.alt);
    // Base og:image, plus optional secure_url + MIME type when the route's
    // image config declares a `type`. Emitted together in a single in-place
    // replacement of the one template og:image tag, so nothing is duplicated.
    const ogImageTag = meta.image.type
      ? `<meta property="og:image" content="${imageUrl}" />\n` +
        `    <meta property="og:image:secure_url" content="${imageUrl}" />\n` +
        `    <meta property="og:image:type" content="${escapeAttr(meta.image.type)}" />`
      : `<meta property="og:image" content="${imageUrl}" />`;
    const imageReplacements = [
      [/<meta[^>]*\bproperty="og:image"[^>]*>/, ogImageTag, "og:image"],
      [
        /<meta[^>]*\bproperty="og:image:width"[^>]*>/,
        `<meta property="og:image:width" content="${meta.image.width}" />`,
        "og:image:width",
      ],
      [
        /<meta[^>]*\bproperty="og:image:height"[^>]*>/,
        `<meta property="og:image:height" content="${meta.image.height}" />`,
        "og:image:height",
      ],
      [
        /<meta[^>]*\bproperty="og:image:alt"[^>]*>/,
        `<meta property="og:image:alt" content="${imageAlt}" />`,
        "og:image:alt",
      ],
      [
        /<meta[^>]*\bname="twitter:image"[^>]*>/,
        `<meta name="twitter:image" content="${imageUrl}" />`,
        "twitter:image",
      ],
      [
        /<meta[^>]*\bname="twitter:image:alt"[^>]*>/,
        `<meta name="twitter:image:alt" content="${imageAlt}" />`,
        "twitter:image:alt",
      ],
    ];
    for (const [pattern, replacement, label] of imageReplacements) {
      if (!pattern.test(html)) {
        console.warn(
          `[prerender-seo] WARN: "${label}" tag not found for /${slug}; keeping template value.`
        );
        continue;
      }
      html = html.replace(pattern, replacement);
    }
  }

  // Per-page structured data: a BreadcrumbList (Home > Page) and a WebPage node
  // tied back to the site's Organization/WebSite (@id from index.html). JSON is
  // stringified (not attr-escaped) so quotes/specials are encoded correctly.
  const crumb = meta.title.split("|")[0].trim();

  // Routes that opt into `linkBreadcrumb` give the BreadcrumbList an @id and
  // have the WebPage point at it, rather than repeating a bare
  // `{"@type":"BreadcrumbList"}` stub with no itemListElement (which is a
  // dangling node that structured-data validators flag). Routes that don't opt
  // in keep their existing output byte-for-byte — note the keys are inserted in
  // the original order, since JSON.stringify preserves insertion order.
  const breadcrumb = { "@type": "BreadcrumbList" };
  if (meta.linkBreadcrumb) breadcrumb["@id"] = `${url}#breadcrumb`;
  breadcrumb.itemListElement = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: crumb, item: url },
  ];

  const webpage = {
    "@type": meta.webpageType ? [meta.webpageType, "WebPage"] : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${ORIGIN}/#website` },
    about: { "@id": `${ORIGIN}/#organization` },
    breadcrumb: meta.linkBreadcrumb
      ? { "@id": `${url}#breadcrumb` }
      : { "@type": "BreadcrumbList" },
  };

  const pageGraph = [breadcrumb, webpage];

  // Roster pages (currently only /team) describe each member as a schema.org
  // Person and tie them together with an ItemList that becomes the page's
  // mainEntity. Every field comes from the roster data the page renders — a
  // member with no photo simply omits `image`; nothing is invented. Persons on
  // the UPES tiers reference the site's Organization node (@id from
  // index.html) instead of restating it.
  if (meta.roster) {
    const persons = [];
    for (const tier of meta.roster) {
      const memberOf =
        tier.org === "CSA Uttarakhand"
          ? { "@type": "Organization", name: "Cloud Security Alliance Uttarakhand" }
          : { "@id": `${ORIGIN}/#organization` };

      for (const member of tier.members) {
        const person = {
          "@type": "Person",
          "@id": `${url}#person-${slugify(member.name)}`,
          name: member.name,
        };
        if (member.position) person.jobTitle = member.position;
        if (member.image) {
          const dims = IMAGE_DIMS[member.image];
          const imageUrl = `${ORIGIN}${member.image}`;
          // Real, measured intrinsic dimensions when we have them; a plain URL
          // otherwise (both are valid for Person.image).
          person.image = dims
            ? {
                "@type": "ImageObject",
                url: imageUrl,
                width: dims[0],
                height: dims[1],
              }
            : imageUrl;
        }
        person.memberOf = memberOf;
        if (member.imageLink) person.sameAs = [member.imageLink];
        persons.push(person);
      }
    }

    webpage.mainEntity = { "@id": `${url}#roster` };
    pageGraph.push(
      {
        "@type": "ItemList",
        "@id": `${url}#roster`,
        name: crumb,
        description: meta.description,
        numberOfItems: persons.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: persons.map((person, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@id": person["@id"] },
        })),
      },
      ...persons
    );
  }

  // Pages that declare `images` (currently only /csr) describe their real,
  // build-time-known photos as schema.org ImageObject nodes and link them from
  // the WebPage. Only URL, intrinsic width/height and a description are
  // emitted — all of which come from the page's own data. No caption is
  // invented: the page displays none. The route's social banner (meta.image)
  // becomes the page's primaryImageOfPage. Routes without `images` are
  // untouched, so their output is unchanged.
  if (meta.images) {
    const imageNodes = [];

    if (meta.image) {
      imageNodes.push({
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        contentUrl: `${ORIGIN}${meta.image.url}`,
        url: `${ORIGIN}${meta.image.url}`,
        width: meta.image.width,
        height: meta.image.height,
        description: meta.image.alt,
        representativeOfPage: true,
      });
      webpage.primaryImageOfPage = { "@id": `${url}#primaryimage` };
    }

    for (const img of meta.images) {
      // Stable @id from the filename, e.g. "/csr/csr1.jpg" -> "#image-csr1-jpg".
      const fileName = img.imageURL.split("/").pop();
      imageNodes.push({
        "@type": "ImageObject",
        "@id": `${url}#image-${slugify(fileName)}`,
        contentUrl: `${ORIGIN}${img.imageURL}`,
        url: `${ORIGIN}${img.imageURL}`,
        width: img.width,
        height: img.height,
        description: img.alt,
      });
    }

    webpage.image = imageNodes.map((node) => ({ "@id": node["@id"] }));
    pageGraph.push(...imageNodes);
  }

  // The /alumni directory: one schema.org Person per alumnus, tied together by
  // an ItemList that becomes the page's mainEntity. Every field comes from the
  // API record the page itself renders - name, position, company, LinkedIn and
  // photo - and the "Nil"/"nan" placeholders the page hides are dropped rather
  // than emitted. Nothing is invented, and an alumnus missing a field simply
  // omits it. Skipped entirely when the build-time fetch failed.
  if (meta.alumniRoster && alumniData?.length) {
    const slugCounts = new Map();
    const persons = alumniData.map((row) => {
      const name = String(row.name).trim();
      // The directory legitimately contains near-duplicate names (e.g. two
      // spellings of the same person), so de-collide the @id rather than emit
      // two nodes sharing one identifier.
      const base = slugify(name);
      const seen = slugCounts.get(base) ?? 0;
      slugCounts.set(base, seen + 1);
      const slugId = seen ? `${base}-${seen + 1}` : base;

      const person = {
        "@type": "Person",
        "@id": `${url}#alumnus-${slugId}`,
        name,
      };
      const jobTitle = cleanField(row.position);
      const company = cleanField(row.company);
      const image = String(row.alumniImgURL ?? "").trim();
      const linkedIn = String(row.linkedInURL ?? "").trim();
      if (jobTitle) person.jobTitle = jobTitle;
      if (company) person.worksFor = { "@type": "Organization", name: company };
      // Photo filenames contain spaces; encode so the JSON-LD carries a valid URL.
      if (image) person.image = encodeURI(image);
      if (linkedIn) person.sameAs = [linkedIn];
      person.alumniOf = { "@id": `${ORIGIN}/#organization` };
      return person;
    });

    webpage.mainEntity = { "@id": `${url}#alumni` };
    pageGraph.push(
      {
        "@type": "ItemList",
        "@id": `${url}#alumni`,
        name: crumb,
        description: meta.description,
        numberOfItems: persons.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: persons.map((person, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@id": person["@id"] },
        })),
      },
      ...persons
    );
  }

  // Listing pages (e.g. /blogs) additionally declare a page-level Blog node,
  // built only from real page data (name/description/publisher). No per-post
  // BlogPosting: individual posts are client-fetched, externally hosted, and
  // carry no reliable publish date, so they can't be marked up without
  // fabricating datePublished/author metadata.
  if (meta.isBlog) {
    pageGraph.push({
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: crumb,
      description: meta.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${url}#webpage` },
      publisher: { "@id": `${ORIGIN}/#organization` },
    });
  }
  // Escaping "<" keeps any data value from breaking out of the <script> block.
  // No existing page/roster value contains "<", so this leaves current output
  // unchanged — it only guards future data.
  const pageLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": pageGraph,
  }).replace(/</g, "\\u003c");
  if (html.includes("</head>")) {
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${pageLd}</script>\n  </head>`
    );
  }

  const outDir = resolve(DIST, slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf8");
  generated += 1;
  console.log(`[prerender-seo] wrote dist/${slug}/index.html`);
}

console.log(`[prerender-seo] done: ${generated} route(s) prerendered.`);
