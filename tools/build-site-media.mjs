import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const exec = promisify(execFile);
const photo = (job, filename) => `source-photos/${job}/${filename}`;
const porsche = 'Porsche 911 inside outside-1-001/Porsche 911 inside outside';
const range = 'range rover sport ceramic-1-001/range rover sport ceramic';
const interiors = 'finished interiors-1-001/finished interiors';
const seats = 'Seat cleaning-1-001/Seat cleaning';
const selections = [
  [
    'porsche',
    photo(porsche, 'PXL_20260701_110538397.jpg'),
    'after',
    'Blue Porsche front three-quarter; glossy finished bodywork. Keep the portrait composition.',
  ],
  [
    'porsche-detail',
    photo(porsche, 'PXL_20260701_110623841.jpg'),
    'after',
    'Clean blue bodywork and carbon mirror; finished detail, not evidence of correction.',
  ],
  [
    'porsche-interior',
    photo(porsche, 'PXL_20260701_110637513.jpg'),
    'after',
    'Clean front cabin, original portrait.',
  ],
  [
    'range-rover',
    photo(range, 'PXL_20261016_152707210.RAW-01.COVER.jpg'),
    'after',
    'Finished vehicle in the ceramic job folder; contextual coating caption only.',
  ],
  [
    'range-detail',
    photo(range, 'PXL_20261016_152747386.RAW-01.COVER.jpg'),
    'after',
    'Reflective bonnet and headlight after work; no defect removal percentage asserted.',
  ],
  [
    'polishing',
    photo(range, 'PXL_20261016_115605087.RAW-01.COVER.jpg'),
    'during',
    'Machine polisher visibly contacting paint. Process imagery only.',
  ],
  [
    'john-on-the-job',
    'source-photos/owner/PXL_20261016_115614009.RAW-01.COVER.jpg',
    'during',
    'John beside a customer Range Rover holding a polisher. Authentic owner portrait, not a result claim.',
  ],
  [
    'coating-product',
    photo(range, 'PXL_20261016_140202069.RAW-01.COVER.jpg'),
    'during',
    'Matrix Blue bottle held beside vehicle; context, not visible application.',
  ],
  [
    'honda-interior',
    photo(interiors, 'PXL_20250726_114017355.jpg'),
    'after',
    'Clean Honda cabin; landscape service image.',
  ],
  [
    'taycan-interior',
    photo(interiors, 'PXL_20261028_145739920.RAW-01.COVER.jpg'),
    'after',
    'Clean Taycan front interior.',
  ],
  [
    'mercedes-interior',
    photo(interiors, 'PXL_20261111_150222827.RAW-01.COVER.jpg'),
    'after',
    'Finished Mercedes cabin.',
  ],
  [
    'seat-before',
    photo(seats, 'video_capture_1785437872407.jpeg'),
    'before',
    'Visibly marked passenger seat and debris on rail. Capture timestamp is misleading: this is before-condition imagery.',
  ],
  [
    'seat-after',
    photo(seats, 'video_capture_1785437894553.jpeg'),
    'after',
    'Same passenger-seat shape, lever, console and blue sill; cleaned fabric and rail. Different light and viewpoint; show side by side, not an aligned slider.',
  ],
  [
    'bmw',
    'source-photos/Green BMW ceramic coating -1-001/Green BMW ceramic coating/PXL_20260808_170527676.mp4',
    'after',
    'Frame at 0.68 seconds; glossy green BMW from ceramic job.',
  ],
];
await mkdir('public/media', { recursive: true });
await mkdir('src/data', { recursive: true });
await mkdir('website-assets/site-build', { recursive: true });
const manifest = {};
for (const [name, source, stage, note] of selections) {
  let input = source;
  if (source.endsWith('.mp4')) {
    input = `website-assets/site-build/${name}.jpg`;
    await exec(ffmpeg.path, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-ss',
      '0.68',
      '-i',
      source,
      '-frames:v',
      '1',
      '-y',
      input,
    ]);
  }
  const original = await sharp(input).rotate().toBuffer();
  const meta = await sharp(original).metadata();
  const widths = [480, 800, 1200, 1600].filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  for (const width of widths) {
    await sharp(original)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(`public/media/${name}-${width}.webp`);
    await sharp(original)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(`public/media/${name}-${width}.avif`);
  }
  manifest[name] = { width: meta.width, height: meta.height, widths, stage };
}
// User-initiated, silent footage; never autoplay on the public site.
const clipSource =
  'source-photos/Green BMW ceramic coating -1-001/Green BMW ceramic coating/PXL_20260808_170609742.mp4';
await exec(ffmpeg.path, [
  '-hide_banner',
  '-loglevel',
  'error',
  '-ss',
  '1.04',
  '-i',
  clipSource,
  '-t',
  '3.10',
  '-an',
  '-vf',
  'scale=720:-2,fps=30',
  '-c:v',
  'libx264',
  '-preset',
  'medium',
  '-crf',
  '25',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  '-y',
  'public/media/bmw-finish.mp4',
]);
await exec(ffmpeg.path, [
  '-hide_banner',
  '-loglevel',
  'error',
  '-ss',
  '1.55',
  '-i',
  'public/media/bmw-finish.mp4',
  '-frames:v',
  '1',
  '-y',
  'website-assets/site-build/bmw-finish-poster.jpg',
]);
await sharp('website-assets/site-build/bmw-finish-poster.jpg')
  .webp({ quality: 83 })
  .toFile('public/media/bmw-finish-poster.webp');
await writeFile('src/data/media.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile(
  'content/media-selection.json',
  JSON.stringify(
    {
      reviewDate: '2026-11-12',
      method:
        'All 12 job contact sheets inspected; selected originals and clip samples reviewed. Classification describes visible condition, not measured coating or correction performance.',
      assets: selections.map(([name, source, stage, note]) => ({ name, source, stage, note })),
      video: {
        source: clipSource,
        stage: 'after',
        start: 1.04,
        end: 4.14,
        notes:
          'Silent side-panel reflection excerpt; no application claim. Playback is user initiated.',
      },
    },
    null,
    2,
  ) + '\n',
);
const inventory = JSON.parse(await readFile('asset-review/inventory.json', 'utf8'));
const chosen = new Map(
  selections.map(([name, source, stage, note]) => [
    source.replace('source-photos/', ''),
    { stage, note, selected: name },
  ]),
);
const classification = inventory.assets.map((a) => ({
  id: a.id,
  source: a.relativePath,
  ...(chosen.get(a.relativePath) || {
    stage: 'uncertain',
    note: 'Contact-sheet review only; not selected. Requires individual review before publication.',
  }),
}));
await writeFile(
  'asset-review/site-classification.json',
  JSON.stringify(classification, null, 2) + '\n',
);
console.log(
  `Generated ${selections.length} responsive image sets and one silent clip; originals untouched.`,
);
