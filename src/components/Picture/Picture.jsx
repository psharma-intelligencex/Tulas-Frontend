import PropTypes from "prop-types";

import OPTIMIZED_IMAGES from "../../utils/optimizedImages";

/**
 * Drop-in replacement for <img> that serves AVIF/WebP when an optimized variant
 * exists, falling back to the original file otherwise.
 *
 * Behaviour is deliberately conservative:
 *
 * - A <source> is emitted ONLY for variants listed in the generated manifest
 *   (scripts/optimize-images.mjs). This matters: if a <source> URL 404s the
 *   browser renders a BROKEN image — it does NOT fall back to the <img>. So a
 *   src with no entry (e.g. an API/Cloudinary URL, a logo, an icon) renders a
 *   plain <img>, byte-for-byte the previous behaviour.
 *
 * - The original file is always the <img> fallback and is never removed, so
 *   older browsers, social scrapers and any direct link keep working.
 *
 * - The <picture> wrapper is `display: contents`, so it generates no box of its
 *   own: the <img> stays the layout box exactly as before. Without this, a
 *   <picture> would become the grid/flex item (or shrink-to-fit inline box) in
 *   place of the <img> and shift the layout. Every existing CSS selector still
 *   matches, since the codebase targets images by class or descendant selector
 *   (there are no `> img` direct-child rules).
 *
 * All other props (className, width, height, alt, loading, decoding,
 * fetchpriority, style, handlers…) pass straight through to the <img>.
 */

// AVIF/WebP variants sit beside the original with the same basename.
// The result is URL-encoded because srcSet treats SPACES as its delimiter — a
// raw "…/MEMOIR 3.0.avif" would parse as two bogus candidates and break the
// image. (The <img src> below is left exactly as the caller passed it.)
const variantOf = (src, ext) =>
  encodeURI(src.replace(/\.(jpe?g|png)$/i, `.${ext}`));

const Picture = ({ src, ...imgProps }) => {
  const variants = src ? OPTIMIZED_IMAGES[src] : undefined;

  // No optimized variant on disk -> render exactly what the page rendered before.
  // `alt` (and every other attribute) arrives via imgProps, untouched.
  if (!variants) {
    return <img src={src} {...imgProps} />;
  }

  return (
    <picture style={{ display: "contents" }}>
      {variants.avif && (
        <source srcSet={variantOf(src, "avif")} type="image/avif" />
      )}
      {variants.webp && (
        <source srcSet={variantOf(src, "webp")} type="image/webp" />
      )}
      <img src={src} {...imgProps} />
    </picture>
  );
};

Picture.propTypes = {
  // The ORIGINAL image path (e.g. "/team/rudraGupta.jpg"). Always the fallback.
  src: PropTypes.string,
};

export default Picture;
