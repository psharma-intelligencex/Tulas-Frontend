// Declarative CMS resource catalogue. Each entry drives the sidebar nav, the
// list table, and the create/edit form generically - field keys map 1:1 to the
// backend columns (legacy tables use camelCase + "_id"; v1 tables use
// snake_case + "id").
//
// field.type: text | textarea | number | boolean | select | date | url
// A resource with `platform: true` is only shown to platform roles.

export const RESOURCES = [
  // ---- The six dynamic domains (legacy tables) ----
  {
    key: "blogs",
    label: "Blogs",
    group: "Content",
    api: "/admin/legacy/blogs",
    idKey: "_id",
    titleKey: "blogTitle",
    columns: [
      { key: "blogImageURL", type: "image" },
      { key: "blogTitle", label: "Title" },
      { key: "blogAuthor", label: "Author" },
    ],
    fields: [
      { key: "blogTitle", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "blogAuthor", label: "Author", type: "text", required: true },
      { key: "blogURL", label: "External URL", type: "url", required: true },
      { key: "blogSummary", label: "Summary", type: "textarea", required: true, colSpan: 2 },
      { key: "blogImageURL", label: "Image URL", type: "url", required: true, colSpan: 2 },
    ],
  },
  {
    key: "alumni",
    label: "Alumni",
    group: "Content",
    api: "/admin/legacy/alumni",
    idKey: "_id",
    titleKey: "name",
    columns: [
      { key: "alumniImgURL", type: "image" },
      { key: "name", label: "Name" },
      { key: "position", label: "Position" },
      { key: "company", label: "Company" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "position", label: "Position", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "linkedInURL", label: "LinkedIn URL", type: "url", required: true },
      { key: "alumniImgURL", label: "Photo URL", type: "url", required: true, colSpan: 2 },
    ],
  },
  {
    key: "committees",
    label: "Committees",
    group: "Content",
    api: "/admin/legacy/committees",
    idKey: "_id",
    titleKey: "committeeName",
    columns: [
      { key: "committeeImageURL", type: "image" },
      { key: "committeeName", label: "Name" },
    ],
    fields: [
      { key: "committeeName", label: "Name", type: "text", required: true },
      { key: "committeePageURL", label: "Page URL", type: "text" },
      { key: "committeeDescription", label: "Description", type: "textarea", required: true, colSpan: 2 },
      { key: "committeeImageURL", label: "Image URL", type: "url", colSpan: 2 },
    ],
  },
  {
    key: "csr",
    label: "CSR",
    group: "Content",
    api: "/admin/legacy/csr",
    idKey: "_id",
    titleKey: "csrName",
    columns: [
      { key: "imageURL", type: "image" },
      { key: "csrName", label: "Name" },
    ],
    fields: [
      { key: "csrName", label: "Name", type: "text", required: true },
      { key: "imageURL", label: "Image URL", type: "url", required: true },
      { key: "spanx", label: "Span X", type: "text", placeholder: "span 1" },
      { key: "spany", label: "Span Y", type: "text", placeholder: "span 1" },
    ],
  },
  {
    key: "events",
    label: "Events (Gallery)",
    group: "Content",
    api: "/admin/legacy/previous-events",
    idKey: "_id",
    titleKey: "eventName",
    columns: [
      { key: "imageURL", type: "image" },
      { key: "eventName", label: "Event" },
      { key: "eventYear", label: "Year" },
    ],
    fields: [
      { key: "eventName", label: "Event name", type: "text", required: true },
      { key: "eventYear", label: "Year", type: "text" },
      { key: "imageURL", label: "Image URL", type: "url", required: true, colSpan: 2 },
      { key: "spanx", label: "Span X", type: "text", placeholder: "span 1" },
      { key: "spany", label: "Span Y", type: "text", placeholder: "span 1" },
    ],
  },
  {
    key: "heads",
    label: "Team - Heads",
    group: "Content",
    api: "/admin/legacy/heads",
    idKey: "_id",
    titleKey: "name",
    columns: [
      { key: "headImgURL", type: "image" },
      { key: "name", label: "Name" },
      { key: "position", label: "Position" },
      { key: "category", label: "Category" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "position", label: "Position", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "order", label: "Display order", type: "number", required: true },
      { key: "csaid", label: "CSA ID", type: "text" },
      { key: "linkedInURL", label: "LinkedIn URL", type: "url" },
      { key: "headImgURL", label: "Photo URL", type: "url", required: true, colSpan: 2 },
    ],
  },
  {
    key: "core-members",
    label: "Team - Core",
    group: "Content",
    api: "/admin/legacy/core-members",
    idKey: "_id",
    titleKey: "name",
    columns: [
      { key: "name", label: "Name" },
      { key: "csaid", label: "CSA ID" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "csaid", label: "CSA ID", type: "text", required: true },
      { key: "linkedInURL", label: "LinkedIn URL", type: "url" },
    ],
  },

  // ---- v1 site content (snake_case, chapter-scoped) ----
  {
    key: "announcements",
    label: "Announcements",
    group: "Site",
    api: "/admin/announcements",
    idKey: "id",
    titleKey: "title",
    columns: [
      { key: "title", label: "Title" },
      { key: "is_published", label: "Published", type: "boolean" },
      { key: "display_order", label: "Order" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "body", label: "Body", type: "textarea", colSpan: 2 },
      { key: "link_url", label: "Link URL", type: "url" },
      { key: "display_order", label: "Display order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "sponsors",
    label: "Sponsors",
    group: "Site",
    api: "/admin/sponsors",
    idKey: "id",
    titleKey: "name",
    columns: [
      { key: "logo_url", type: "image" },
      { key: "name", label: "Name" },
      { key: "tier", label: "Tier" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "tier", label: "Tier", type: "text" },
      { key: "logo_url", label: "Logo URL", type: "url" },
      { key: "website_url", label: "Website URL", type: "url" },
      { key: "display_order", label: "Display order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    group: "Site",
    api: "/admin/partners",
    idKey: "id",
    titleKey: "name",
    columns: [
      { key: "logo_url", type: "image" },
      { key: "name", label: "Name" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "logo_url", label: "Logo URL", type: "url" },
      { key: "website_url", label: "Website URL", type: "url" },
      { key: "display_order", label: "Display order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    group: "Site",
    api: "/admin/faqs",
    idKey: "id",
    titleKey: "question",
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    fields: [
      { key: "question", label: "Question", type: "text", required: true, colSpan: 2 },
      { key: "answer", label: "Answer", type: "textarea", required: true, colSpan: 2 },
      { key: "category", label: "Category", type: "text" },
      { key: "display_order", label: "Display order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
  {
    key: "site-events",
    label: "Events (v1)",
    group: "Site",
    api: "/admin/events",
    idKey: "id",
    titleKey: "title",
    columns: [
      { key: "featured_image", type: "image" },
      { key: "title", label: "Title" },
      { key: "status", label: "Status" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      { key: "start_date_time", label: "Start", type: "datetime" },
      { key: "end_date_time", label: "End", type: "datetime" },
      { key: "venue", label: "Venue", type: "text" },
      { key: "meeting_link", label: "Meeting link", type: "url" },
      { key: "registration_url", label: "Registration URL", type: "url" },
      { key: "capacity", label: "Capacity", type: "number" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      },
      { key: "featured_image", label: "Featured image URL", type: "url", colSpan: 2 },
      { key: "is_featured", label: "Featured", type: "boolean" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "site-team",
    label: "Team (v1)",
    group: "Site",
    api: "/admin/team",
    idKey: "id",
    titleKey: "name",
    columns: [
      { key: "photo_url", type: "image" },
      { key: "name", label: "Name" },
      { key: "designation", label: "Designation" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "designation", label: "Designation", type: "text" },
      { key: "bio", label: "Bio", type: "textarea", colSpan: 2 },
      { key: "photo_url", label: "Photo URL", type: "url" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { key: "email", label: "Email", type: "text" },
      { key: "display_order", label: "Display order", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
  },
];

export const RESOURCE_BY_KEY = Object.fromEntries(RESOURCES.map((r) => [r.key, r]));

// Short helper descriptions shown on each list page's header.
export const RESOURCE_DESC = {
  blogs: "Articles and posts published on your chapter site.",
  alumni: "Notable alumni featured on the alumni page.",
  committees: "Committees and their pages.",
  csr: "Corporate social responsibility initiatives.",
  events: "Past events shown in the gallery.",
  heads: "Committee heads and leadership positions.",
  "core-members": "Core team members across committees.",
  announcements: "Notices and highlights surfaced on the site.",
  sponsors: "Sponsors displayed on your chapter site.",
  partners: "Partner organisations and collaborators.",
  faqs: "Frequently asked questions.",
  "site-events": "Rich events with schedule, speakers and registration.",
  "site-team": "Team members managed via the v1 platform.",
};

// Ordered nav groups.
export const NAV_GROUPS = ["Content", "Site", "Submissions", "Platform"];
