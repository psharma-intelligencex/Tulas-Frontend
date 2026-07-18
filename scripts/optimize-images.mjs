/**
 * One-off (re-runnable) image optimizer.
 *
 * Generates WebP + AVIF variants ALONGSIDE the originals for eligible
 * photographs in public/. Originals are never modified or deleted — they remain
 * the <picture> fallback, and every og:image / external URL keeps working.
 *
 * Eligibility (deliberately conservative — see the project's image brief):
 *   - referenced from a .jsx file (unreferenced assets are not worth shipping)
 *   - a photograph: opaque (no alpha channel)
 *   - NOT a logo, icon, illustration or sponsor mark (those stay untouched)
 *   - at least MIN_BYTES, so small UI graphics are left alone
 *
 * Quality gate: each variant is decoded and compared to the original with SSIM.
 * A variant is kept ONLY if it is (a) visually lossless (SSIM >= SSIM_MIN),
 * (b) genuinely smaller than the original, and (c) pixel-identical in
 * dimensions. Anything failing a check is deleted, and the original is used as
 * before — so a bad encode can never reach the site.
 *
 * Output: writes src/utils/optimizedImages.js, the manifest the <Picture>
 * component reads. Picture only emits a <source> for variants listed there, so
 * a <source> can never 404 (a 404ing <source> renders a BROKEN image — the
 * browser does not fall back to <img>).
 *
 * Usage: node scripts/optimize-images.mjs [--force]
 * Requires ffmpeg on PATH (libwebp + libaom-av1 + avif muxer).
 */

import { execFileSync, spawnSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { dirname, resolve, join, sep, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const TMP = join(ROOT, "node_modules", ".cache");

const MIN_BYTES = 20 * 1024; // below this, an image is a small UI graphic
const SSIM_MIN = 0.98; // "visually lossless" floor

// Quality ladders. We start cheap and step UP in quality until the encode is
// visually lossless (SSIM >= SSIM_MIN) while still beating the original's size.
// The first rung that satisfies both wins; if no rung does, the variant is
// dropped entirely and the original is served unchanged.
const WEBP_LADDER = [82, 88, 92, 95];
const AVIF_LADDER = [32, 28, 24, 20];

// Folders whose contents are logos / icons / vector-ish UI art — never converted.
const SKIP_DIRS = ["icons", "logo", "illustrations", "sponsors"];

const walk = (d, acc = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    e.isDirectory() ? walk(p, acc) : acc.push(p);
  }
  return acc;
};

const webPath = (abs) =>
  "/" + abs.slice(PUBLIC.length + 1).split(sep).join("/");

// ---- format probing (no dependencies) ----
const pngHasAlpha = (b) => {
  const colorType = b[25]; // 4 = gray+alpha, 6 = RGBA, 3 = palette (+tRNS)
  if (colorType === 4 || colorType === 6) return true;
  return colorType === 3 && b.includes(Buffer.from("tRNS"));
};
const probe = (f) => {
  const b = readFileSync(f);
  if (b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a")
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), alpha: pngHasAlpha(b) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), alpha: false };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
};

const ffmpeg = (args) =>
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

// SSIM of `variant` against `original`, via ffmpeg's ssim filter.
// NOTE: ffmpeg writes the filter's summary line to STDERR, not stdout, so this
// must use spawnSync and read stderr — execFileSync's return value (stdout) is
// empty here and would score every variant 0.
const ssim = (original, variant) => {
  const r = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", original, "-i", variant, "-lavfi", "ssim", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const m = /All:([0-9.]+)/.exec(`${r.stderr || ""}${r.stdout || ""}`);
  return m ? parseFloat(m[1]) : 0;
};

// ---- select eligible photographs ----
const srcText = walk(join(ROOT, "src"))
  .filter((f) => /\.jsx?$/.test(f))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const candidates = [];
for (const f of walk(PUBLIC)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const rel = f.slice(PUBLIC.length + 1).split(sep);
  if (SKIP_DIRS.includes(rel[0])) continue;
  const web = webPath(f);
  const size = statSync(f).size;
  if (size < MIN_BYTES) continue;
  // Must be used from JSX. This also (correctly) excludes the og:image-only
  // banners in pageheaders/ — social scrapers don't reliably render AVIF/WebP,
  // so those must stay JPEG and gain nothing from a variant.
  if (!srcText.includes(web) && !srcText.includes(basename(f))) continue;
  const info = probe(f);
  if (!info) continue;
  if (info.alpha) continue; // transparent asset -> skipped by policy
  candidates.push({ file: f, web, size, ...info });
}

console.log(`[optimize-images] eligible photographs: ${candidates.length}`);

const manifest = {};
const report = [];
let savedAvif = 0;
let origTotal = 0;

for (const c of candidates) {
  const noExt = c.file.slice(0, -extname(c.file).length);
  const webp = `${noExt}.webp`;
  const avif = `${noExt}.avif`;
  const entry = {};
  const row = { web: c.web, orig: c.size, w: c.w, h: c.h };

  for (const [kind, out] of [["webp", webp], ["avif", avif]]) {
    const ladder = kind === "webp" ? WEBP_LADDER : AVIF_LADDER;
    let best = null;
    let why = "no rung met the quality/size bar";

    for (const q of ladder) {
      try {
        if (kind === "webp") {
          ffmpeg(["-i", c.file, "-c:v", "libwebp", "-quality", String(q), "-compression_level", "6", out]);
        } else {
          ffmpeg(["-i", c.file, "-c:v", "libaom-av1", "-still-picture", "1", "-crf", String(q), "-b:v", "0", "-cpu-used", "6", "-pix_fmt", "yuv420p", out]);
        }
        const outSize = statSync(out).size;
        // ffmpeg's ssim filter requires both inputs to have identical
        // dimensions, so a size mismatch throws here and the variant is
        // discarded — dimension (and therefore CLS) safety is enforced here.
        const score = ssim(c.file, out);

        if (outSize >= c.size) {
          // Higher quality only gets bigger, so no later rung can win.
          why = "larger than original";
          break;
        }
        if (score >= SSIM_MIN) {
          best = { size: outSize, ssim: score, q };
          break; // first rung that is visually lossless AND smaller
        }
        why = `SSIM ${score.toFixed(4)} < ${SSIM_MIN}`;
      } catch {
        why = "encode failed";
        break;
      }
    }

    if (best) {
      entry[kind] = true;
      row[kind] = best;
    } else {
      if (existsSync(out)) unlinkSync(out);
      row[kind] = { skipped: why };
    }
  }

  if (Object.keys(entry).length) manifest[c.web] = entry;
  origTotal += c.size;
  if (row.avif?.size) savedAvif += c.size - row.avif.size;
  report.push(row);
  const a = row.avif?.size ? `avif ${(row.avif.size / 1024).toFixed(0)}KB` : `avif SKIP`;
  const w = row.webp?.size ? `webp ${(row.webp.size / 1024).toFixed(0)}KB` : `webp SKIP`;
  console.log(`  ${(c.size / 1024).toFixed(0).padStart(5)}KB  ${c.web.padEnd(52)} -> ${w}, ${a}`);
}

// ---- write the manifest the <Picture> component reads ----
const entries = Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b));
const body = `/**
 * GENERATED by scripts/optimize-images.mjs — do not edit by hand.
 *
 * Maps an original image path to the optimized variants that exist ON DISK next
 * to it. <Picture> emits a <source> only for variants listed here: a <source>
 * whose file 404s makes the browser render a BROKEN image rather than falling
 * back to <img>, so this manifest is what makes the fallback safe.
 *
 * Every original file is still present and is always the <img> fallback.
 */
const OPTIMIZED_IMAGES = {
${entries.map(([k, v]) => `  "${k}": { avif: ${!!v.avif}, webp: ${!!v.webp} },`).join("\n")}
};

export default OPTIMIZED_IMAGES;
`;
writeFileSync(join(ROOT, "src", "utils", "optimizedImages.js"), body, "utf8");

if (existsSync(TMP)) {
  writeFileSync(join(TMP, "image-report.json"), JSON.stringify(report, null, 2), "utf8");
}

console.log(`\n[optimize-images] converted: ${entries.length} / ${candidates.length}`);
console.log(`[optimize-images] originals: ${(origTotal / 1048576).toFixed(2)} MB`);
console.log(`[optimize-images] saved (AVIF path): ${(savedAvif / 1048576).toFixed(2)} MB`);
console.log(`[optimize-images] manifest -> src/utils/optimizedImages.js`);
