/**
 * Team roster data (CSA 2026-27).
 *
 * Extracted verbatim from TeamPage.jsx so it has exactly ONE source of truth:
 * the page renders from it, and scripts/prerender-seo.mjs imports it at build
 * time to emit schema.org Person markup into dist/team/index.html. Plain data
 * with no imports, so Node (the prerender script) and Vite (the browser bundle)
 * can both load it.
 */

// TEAM HIERARCHY (CSA 2026-27), top -> bottom
// `image` points to the member's official photo in /public/team (full quality).
// Members without a supplied photo omit `image` and keep the initials avatar.
export const TEAM = [
  {
    label: "Cloud Security Alliance",
    // Standalone entry - not part of the student hierarchy tree (no connector).
    detached: true,
    // Org badge above the tier label. Satyam belongs to CSA Uttarakhand, not
    // UPES - the badge (gold, vs. blue for UPES) makes that split visible.
    org: "CSA Uttarakhand",
    orgVariant: "csa",
    // Button shown below the card (outside the photo), linking to the CSA
    // board-of-directors page.
    cta: {
      caption: "",
      label: "Board of Directors",
      href: "https://uk.cloudsecurityalliance.in/board-of-directors",
    },
    members: [
      {
        name: "Satyam Rastogi",
        position: "President, CSA Uttarakhand",
        image: "/team/satyamRastogi.png",
        // The photo links to the personal site.
        imageLink: "https://www.satyamrastogi.com/",
      },
    ],
  },
  {
    // Top of the connected UPES tree - the badge here covers every tier
    // chained below it by connectors.
    org: "TULAS",
    label: "TULAS Faculty Coordinator",
    members: [
      {
        name: "Dr. Saurabh Singh",
        position: "Faculty Coordinator",
        image: "/team/saurabhsingh.webp",
      },
      {
        name: "Mr. Girish Singh",
        position: "Faculty Coordinator",
        image: "/team/girishsingh.webp",
      },
      {
        name: "Ms Anita Rajwanshi",
        position: "Faculty Coordinator",
        image: "/team/anitarajwanshi.webp",
      },
      {
        name: "Ms Mansi Negi",
        position: "Faculty Coordinator",
        image: "/team/mansinegi.webp",
      },
    ],
  },
  // {
  //   label: "President",
  //   members: [
  //     {
  //       name: "Saksham Agrawal",
  //       position: "President",
  //       image: "/team/sakshamAgrawal.jpg",
  //     },
  //   ],
  // },
  // {
  //   label: "Vice President",
  //   members: [
  //     {
  //       name: "Rudra Gupta",
  //       position: "Vice President",
  //       image: "/team/rudraGupta.jpg",
  //     },
  //   ],
  // },
  // {
  //   label: "Core Committee",
  //   members: [
  //     {
  //       name: "Chhavi Gera",
  //       position: "Treasurer",
  //       image: "/team/chhaviGera.jpg",
  //     },
  //     {
  //       name: "Nityavardhan Singh Hartala",
  //       position: "Secretary",
  //       image: "/team/nityavardhanSinghHartala.jpg",
  //     },
  //     {
  //       name: "Akshaj Jain",
  //       position: "Secretary",
  //       image: "/team/akshajJain.jpg",
  //     },
  //     {
  //       name: "Suyash Subrat Patnaik",
  //       position: "Joint Secretary",
  //       image: "/team/suyashSubratPatnaik.jpg",
  //     },
  //     {
  //       name: "Rhythm Gupta",
  //       position: "Advisor",
  //       image: "/team/rhythmGupta.jpg",
  //     },
  //     {
  //       name: "Jhilmil Bansal",
  //       position: "Advisor",
  //       image: "/team/jhilmilBansal.jpg",
  //     },
  //   ],
  // },
  {
  label: "Student Team",
  members: [
    {
      name: "Santosh Singh",
      position: "VP",
      image: "/team/santoshsinghvp.webp",
    },
    {
      name: "Yashvardhan Singh",
      position: "AVP",
      image: "/team/yashvardhansinghavp.webp",
    },
    {
      name: "Parth Kashyap",
      position: "Secretary",
      image: "/team/parthkashyaps.webp",
    },
    {
      name: "Mukul Anand",
      position: "Treasurer",
      image: "/team/mukulanandt.webp",
    },

    // Technical Heads
    {
      name: "Abhishek Kumar",
      position: "Technical Head",
      image: "/team/abhishekkumarth.webp",
    },
    {
      name: "Ayush",
      position: "Technical Head",
      image: "/team/ayushth.webp",
    },
    {
      name: "Ravi Kumar Singh",
      position: "Technical Head",
      image: "/team/ravikumarsinghth.webp",
    },
    {
      name: "Sarvesh Vishwakarma",
      position: "Technical Head",
      image: "/team/sarveshvishwakarmath.webp",
    },

    // Content Writing Heads
    {
      name: "Prabhat Kumar",
      position: "Content Writing Head",
      image: "/team/prabhatkumarcwh.webp",
    },
    {
      name: "Tanvir Ansari",
      position: "Content Writing Head",
      image: "/team/tanviransaricwh.webp",
    },

    // Social Media Heads
    {
      name: "Rudra Pratap Singh",
      position: "Social Media Head",
      image: "/team/rudrapratapsinghsmh.webp",
    },
    {
      name: "Saket Kumar",
      position: "Social Media Head",
      image: "/team/saketkumarsmh.webp",
    },
    {
      name: "Sonali Kumari",
      position: "Social Media Head",
      image: "/team/sonalikumarismh.webp",
    },

    // PR
    {
      name: "Prince Rajput",
      position: "PR",
      image: "/team/princerajputpr.webp",
    },
    {
      name: "Shashank Jha",
      position: "PR",
      image: "/team/shashankjhapr.webp",
    },
  ],
},
  // {
  //   label: "Associate Heads",
  //   members: [
  //     {
  //       name: "Dhruv Kapoor",
  //       position: "Associate Events Head",
  //       image: "/team/dhruvKapoor.jpg",
  //     },
  //     {
  //       name: "Garvit Jain",
  //       position: "Associate Public Relations Head",
  //       image: "/team/garvitJain.jpg",
  //     },
  //     {
  //       name: "Yashasvani Markanday",
  //       position: "Associate Technical Head",
  //       image: "/team/yashasvaniMarkanday.jpg",
  //     },
  //     {
  //       name: "Avantika",
  //       position: "Associate Social Media Head",
  //       image: "/team/avantika.jpg",
  //     },
  //     {
  //       name: "Samiksha Ranjan",
  //       position: "Associate Editorial Head",
  //       image: "/team/samikshaRanjan.jpg",
  //     },
  //     {
  //       name: "Kushagra Ranjan",
  //       position: "Associate Registrations Head",
  //       image: "/team/kushagraRanjan.jpg",
  //     },
  //     {
  //       name: "Tanya Marwaha",
  //       position: "Associate Treasurer",
  //       image: "/team/tanyaMarwaha.jpg",
  //     },
  //   ],
  // },
];

// Intrinsic pixel dimensions of each /public/team photo, measured from the
// source files (never guessed). Used to set width/height on the avatar <img> so
// the browser reserves the correct box before the photo loads (less CLS +
// explicit image dimensions for SEO), and to describe each Person's photo as a
// schema.org ImageObject in the prerendered Team markup. The avatar is always
// rendered as a fixed square via CSS (object-fit: cover), so these values never
// change the visual layout - they only declare the true image size. Keyed by the
// exact `image` path in TEAM; an unmapped path just omits the attributes (no
// error).
export const IMAGE_DIMS = {
  "/team/satyamRastogi.png": [500, 500],
  "/team/keshavSinha.jpg": [1024, 1024],
  "/team/rahulKumar.jpg": [1254, 1254],
  "/team/sakshamAgrawal.jpg": [1280, 1920],
  "/team/rudraGupta.jpg": [1280, 1920],
  "/team/chhaviGera.jpg": [1280, 1920],
  "/team/nityavardhanSinghHartala.jpg": [1280, 1920],
  "/team/akshajJain.jpg": [1280, 1920],
  "/team/suyashSubratPatnaik.jpg": [1280, 1920],
  "/team/rhythmGupta.jpg": [1067, 1600],
  "/team/jhilmilBansal.jpg": [1280, 1920],
  "/team/vanshGarg.jpg": [1280, 1920],
  "/team/siyaSingh.jpg": [1280, 1920],
  "/team/parthAgarwal.jpg": [1280, 1920],
  "/team/abhiGarg.jpg": [1280, 1920],
  "/team/aditiRaj.jpg": [1280, 1920],
  "/team/yashaswiRaj.jpg": [1440, 1920],
  "/team/adityaPratapSingh.jpg": [1271, 1548],
  "/team/angelinaGurung.jpg": [941, 1304],
  "/team/ikshwaaku.jpg": [1280, 1920],
  "/team/anweshaJoshi.jpg": [1280, 1920],
  "/team/kreeshSinghNegi.jpg": [768, 1024],
  "/team/parvAgrawal.jpg": [1280, 1920],
  "/team/dhruvKapoor.jpg": [1280, 1920],
  "/team/garvitJain.jpg": [1280, 1920],
  "/team/yashasvaniMarkanday.jpg": [1280, 1920],
  "/team/avantika.jpg": [1280, 960],
  "/team/samikshaRanjan.jpg": [1280, 1920],
  "/team/kushagraRanjan.jpg": [1280, 1920],
  "/team/tanyaMarwaha.jpg": [1187, 1280],
};
