import { useEffect } from "react";
import { Users, HeartHandshake, Sparkles } from "lucide-react";
import styles from "./CsrPage.module.css";

import useFetch from "../../hooks/useFetch";

import PageHeading from "../../components/PageHeading/PageHeading";
import Picture from "../../components/Picture/Picture";
// Single source of truth for the static gallery. scripts/prerender-seo.mjs
// imports the same module at build time to emit ImageObject JSON-LD into
// dist/csr/index.html, so the markup can never drift from what's rendered.
import { GALLERY_IMAGES } from "./csrData";

// CSS STYLES
const {
  csrContainer,
  csrHeader,
  content,
  impactSection,
  impactLeft,
  impactText,
  fillCard,
  label,
  heading,
  description,
  bento,
  imageCard,
  bentoMedia,
  features,
  featureCard,
  featureHead,
  featureIcon,
  featureTitle,
  featureDesc,
  gallerySection,
  galleryHead,
  galleryGrid,
  galleryCard,
  galleryOverlay,
  galleryCaption,
} = styles;

// Static feature cards (content fixed by design spec).
const FEATURES = [
  {
    icon: Users,
    title: "Community Engagement",
    desc: "Connecting with local communities through education, outreach, and volunteer initiatives.",
  },
  {
    icon: HeartHandshake,
    title: "Social Responsibility",
    desc: "Building positive social impact through collaborative CSR activities.",
  },
  {
    icon: Sparkles,
    title: "Better Tomorrow",
    desc: "Together we empower communities and create lasting change.",
  },
];

// Alt text for an API-supplied CSR image. The CSR records carry a `csrName`
// (see the backend csr model and the admin resource config); `eventName` exists
// only on the events resource, so reading it here always yielded undefined and
// every image fell back to the same generic string. Falls back to a descriptive
// default when a record has no name.
const csrAlt = (img) => img?.csrName || "UPES CSA community outreach initiative";

const CsrPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { data, error } = useFetch({
    url: `${import.meta.env.VITE_SERVER_URL}/api/csr/?limit=5`,
  });

  if (error) {
    return <h6>Something went wrong...</h6>;
  }

  // CSR images come from the API and power ONLY the bento + fill image.
  // First four form the zig-zag bento, the 5th fills the space below the text.
  // The gallery below uses its own static GALLERY_IMAGES, not this API data.
  const images = Array.isArray(data) ? data : data?.data ?? [];
  const bentoImages = images.slice(0, 4);
  const fillImage = images[4];

  return (
    <div className={csrContainer}>
      <div className={csrHeader}>
        <PageHeading imgURL="/img/hero/hero-bg.jpg" text="CSR" />
      </div>

      <div className={content}>
        {/* SECTION 1 - impact statement + premium bento */}
        <section className={impactSection}>
          <div className={impactLeft}>
            <div className={impactText}>
              <span className={label}>OUR IMPACT</span>
              <h2 className={heading}>Making a Difference Together</h2>
              <p className={description}>
                At TULAS CSA Uttarakhand Chapter, we believe technology should
                create a positive impact beyond classrooms. 
                {/* Through educational
                outreach, community engagement, and social initiatives, our
                volunteers work together to inspire, empower, and support
                communities. */}
              </p>
            </div>

            {fillImage && (
              <figure className={`${imageCard} ${fillCard}`}>
                <img
                  className={bentoMedia}
                  loading="lazy"
                  decoding="async"
                  src={fillImage.imageURL}
                  alt={csrAlt(fillImage)}
                />
              </figure>
            )}
          </div>

          {bentoImages.length > 0 && (
            <div className={bento}>
              {bentoImages.map((img, index) => (
                <figure className={imageCard} key={index}>
                  <img
                    className={bentoMedia}
                    loading="lazy"
                    decoding="async"
                    src={img.imageURL}
                    alt={csrAlt(img)}
                  />
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* FEATURE CARDS */}
        <section className={features}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <article className={featureCard} key={title}>
              <div className={featureHead}>
                <Icon
                  className={featureIcon}
                  size={28}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className={featureTitle}>{title}</h3>
              </div>
              <p className={featureDesc}>{desc}</p>
            </article>
          ))}
        </section>

        {/* CSR GALLERY */}
        <section className={gallerySection}>
          <div className={galleryHead}>
            <span className={label}>OUR CSR GALLERY</span>
            <h2 className={heading}>Moments That Inspire Change</h2>
            <p className={description}>
              A glimpse into our outreach programs, educational activities,
              volunteer initiatives, and memorable moments from our CSR
              journey.
            </p>
          </div>

          <div className={galleryGrid}>
            {GALLERY_IMAGES.map((img, index) => (
              <figure className={galleryCard} key={index}>
                <Picture
                  loading="lazy"
                  decoding="async"
                  src={img.imageURL}
                  width={img.width}
                  height={img.height}
                  alt={img.alt}
                />
                <span className={galleryOverlay} aria-hidden="true" />
                {img.eventName && (
                  <figcaption className={galleryCaption}>
                    {img.eventName}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CsrPage;
