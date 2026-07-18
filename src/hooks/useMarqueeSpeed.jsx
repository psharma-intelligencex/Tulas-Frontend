import { useEffect } from "react";

// Shared scroll speed for every marquee on the site, in pixels per second.
// Single source of truth so all marquees move at an identical, screen- and
// content-independent pace - calibrated to the Global Alliance marquee's feel.
export const MARQUEE_SPEED = 50;

/**
 * Drives a marquee track at a constant pixels-per-second speed by deriving its
 * animation-duration from the width it actually scrolls.
 *
 * The track is expected to hold two identical halves and animate
 * translateX(-50%), so one seamless loop travels scrollWidth / 2. Because the
 * duration scales with that width, the visual speed stays the same on every
 * screen size and no matter how many cards are rendered - so adding cards to
 * keep the loop seamless (never "ending") never changes how fast it moves, and
 * every marquee using this hook scrolls at exactly MARQUEE_SPEED.
 *
 * @param {import("react").RefObject<HTMLElement>} trackRef the animated track
 * @param {unknown} contentKey changes when the rendered card count changes
 */
const useMarqueeSpeed = (trackRef, contentKey) => {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const applyDuration = () => {
      // One un-duplicated half - the distance covered before the loop repeats.
      const distance = track.scrollWidth / 2;
      if (distance > 0) {
        track.style.animationDuration = `${distance / MARQUEE_SPEED}s`;
      }
    };

    applyDuration();

    // Card widths can use viewport units, so recompute when the track resizes.
    const observer = new ResizeObserver(applyDuration);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, contentKey]);
};

export default useMarqueeSpeed;
