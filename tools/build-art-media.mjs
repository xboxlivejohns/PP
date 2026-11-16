import { mkdir, writeFile, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';

// Art-directed derivatives only. The selected originals are never modified.
const exec = promisify(execFile);
const out = 'public/media';
const scratch = 'website-assets/art-direction';
await mkdir(out, { recursive: true });
await mkdir(scratch, { recursive: true });
const source = (folder, name) => `source-photos/${folder}/${name}`;
const porsche = 'Porsche 911 inside outside-1-001/Porsche 911 inside outside';
const bmw = 'Green BMW ceramic coating -1-001/Green BMW ceramic coating';
const cars = 'cars-1-001/cars';

async function frame(input, time, name) {
  const file = `${scratch}/${name}.jpg`;
  await exec(ffmpeg.path, ['-hide_banner', '-loglevel', 'error', '-ss', String(time), '-i', input, '-frames:v', '1', '-q:v', '2', '-y', file]);
  return file;
}

const selections = [
  {
    name: 'art-porsche-front',
    source: source(porsche, 'PXL_20260701_110616064.jpg'),
    stage: 'after',
    crop: { left: 0, top: 1776, width: 3072, height: 2304 },
    widths: [480, 800, 1200, 1600],
    alt: 'Sky reflected across the blue bonnet and rounded headlights of a freshly detailed Porsche 911.',
    note: 'Low frontal original. A deliberate 4:3 crop retains the bonnet, badge and both headlights, with only the lower windshield and a narrow strip of the real setting. No colour grading or object removal.',
  },
  {
    name: 'art-porsche-front-portrait',
    source: source(porsche, 'PXL_20260701_110616064.jpg'),
    stage: 'after',
    crop: { left: 0, top: 900, width: 3072, height: 3180 },
    widths: [480, 800, 1200],
    alt: 'Low frontal view of a blue Porsche 911 with crisp reflections across its finished bonnet.',
    note: 'Mobile alternative retaining more of the windshield and genuine driveway context. Near-square crop, not a fabricated landscape extension.',
  },
  {
    name: 'art-bmw-rear',
    source: source(bmw, 'PXL_20260808_170414511.mp4'),
    frameTime: 2.07,
    stage: 'after',
    widths: [480, 800, 1080],
    alt: 'Glossy emerald green BMW rear quarter, red rear lamp and black alloy wheel after detailing.',
    note: 'Frame from the ceramic-coating job. Paint appearance and job context are visible; this is not a coating-performance claim. Original portrait framing retained.',
  },
  {
    name: 'art-mercedes-exterior',
    source: source(cars, 'PXL_20250716_190505741.mp4'),
    frameTime: 0.65,
    stage: 'after',
    widths: [480, 800, 1200, 1600],
    alt: 'Finished black Mercedes SUV with clear reflections across its side panels and bonnet.',
    note: 'Native landscape frame provides a broader whole-vehicle view. Genuine driveway surroundings and reflections retained; no coating/correction claim.',
  },
  {
    name: 'art-porsche-console',
    source: source(porsche, 'PXL_20260701_110640994.jpg'),
    stage: 'after',
    widths: [480, 800, 1200, 1600],
    alt: 'Detailed Porsche interior showing the centre console, carbon trim and yellow rev counter.',
    note: 'Closer interior composition contrasts exterior paintwork with material detail. Original image and visible surface appearance retained.',
  },
];

const assets = [];
for (const selection of selections) {
  const input = selection.frameTime === undefined ? selection.source : await frame(selection.source, selection.frameTime, selection.name);
  let pipeline = sharp(input).rotate();
  if (selection.crop) pipeline = pipeline.extract(selection.crop);
  const buffer = await pipeline.toBuffer();
  const { width, height } = await sharp(buffer).metadata();
  const outputs = [];
  for (const w of selection.widths) {
    for (const format of ['avif', 'webp']) {
      const file = `${out}/${selection.name}-${w}.${format}`;
      const resized = sharp(buffer).resize({ width: w, withoutEnlargement: true });
      if (format === 'avif') await resized.avif({ quality: 58, effort: 4 }).toFile(file);
      else await resized.webp({ quality: 85 }).toFile(file);
      outputs.push({ path: `/${file.replace('public/', '')}`, width: w, bytes: (await stat(file)).size });
    }
  }
  assets.push({ ...selection, width, height, outputs });
}

const heroSource = source(cars, 'PXL_20250716_190516323.mp4');
const video = {
  name: 'art-hero-finish',
  source: heroSource,
  stage: 'after',
  start: 0.8,
  end: 4.8,
  width: 1280,
  height: 720,
  posterTime: 1.08,
  sampleTimes: [0.8, 1.08, 1.4, 1.72, 2.04, 2.36, 2.68, 3, 3.32, 3.64, 3.96, 4.28, 4.6, 4.8],
  note: 'Silent native landscape pan from a finished Mercedes headlight across clean bonnet reflections. No water, foam, visible dirty condition or active process. Does not establish ceramic application or quantified correction. No colour grading. A pause control and reduced-motion poster are required if used as a looping background.',
};
await exec(ffmpeg.path, ['-hide_banner', '-loglevel', 'error', '-ss', String(video.start), '-i', heroSource, '-t', String(video.end - video.start), '-an', '-vf', 'scale=1280:720,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', `${out}/${video.name}.mp4`]);
video.path = `/media/${video.name}.mp4`;
video.bytes = (await stat(`${out}/${video.name}.mp4`)).size;
const heroPoster = await frame(heroSource, video.posterTime, 'art-hero-finish-poster');
for (const width of [480, 800, 1280, 1600]) {
  await sharp(heroPoster).resize({ width }).webp({ quality: 86 }).toFile(`${out}/art-hero-finish-poster-${width}.webp`);
  await sharp(heroPoster).resize({ width }).avif({ quality: 58, effort: 4 }).toFile(`${out}/art-hero-finish-poster-${width}.avif`);
}

// Distributed original-frame review sheet, including both edit points.
const composites = [];
for (const [index, time] of video.sampleTimes.entries()) {
  const file = await frame(heroSource, time, `hero-review-${index}`);
  const left = (index % 4) * 320;
  const top = Math.floor(index / 4) * 205;
  composites.push({ input: await sharp(file).resize(320, 180).toBuffer(), left, top });
  const label = `<svg width="320" height="25"><rect width="320" height="25" fill="#111820"/><text x="10" y="18" fill="white" font-family="Arial" font-size="13">${time}s</text></svg>`;
  composites.push({ input: Buffer.from(label), left, top: top + 180 });
}
await sharp({ create: { width: 1280, height: Math.ceil(video.sampleTimes.length / 4) * 205, channels: 3, background: '#111820' } }).composite(composites).jpeg({ quality: 90 }).toFile(`${scratch}/hero-review-sheet.jpg`);

await writeFile('content/art-media-selection.json', JSON.stringify({
  reviewDate: '2026-11-12',
  method: 'Exterior contact sheets reconsidered for the redesign. Selected photographs reviewed individually at original scale, selected video stills reviewed individually, and hero excerpt reviewed at 14 distributed times including both edit points. Visual stage classifications describe observed condition, not independently measured detailing outcomes.',
  originalsModified: false,
  imageProcessing: 'Auto-orient, explicitly documented crops, resize and encoding only. No object removal, defect retouching or colour grading.',
  assets,
  video,
}, null, 2) + '\n');
console.log(JSON.stringify({ imageSets: assets.map(({ name, width, height }) => ({ name, width, height })), video: { path: video.path, bytes: video.bytes, duration: video.end - video.start } }, null, 2));
