import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const exec = promisify(execFile);
const scratch = 'website-assets/editorial';
await mkdir(scratch, { recursive: true });
const cars = 'source-photos/cars-1-001/cars/';
const assets = [
  {
    name: 'vauxhall-finish',
    source: cars + 'PXL_20250905_175036624.mp4',
    frameTime: 0.89,
    stage: 'after',
    crop: { left: 0, top: 310, width: 1080, height: 1000 },
    widths: [480, 800, 1080],
    note: 'Clean white Vauxhall Insignia with reflective panels and finished wheels, reviewed at the selected frame. Crop removes surplus foreground pavement. No specific treatment is inferred.',
  },
  {
    name: 'blue-bmw-finish',
    source: cars + 'PXL_20250825_170110831.mp4',
    frameTime: 1,
    stage: 'after',
    widths: [480, 800, 1080],
    note: 'Replacement reviewed 2026-11-16: later footage of the same blue BMW X5, showing the bonnet and front end. Earlier 135325833 footage shows circular bonnet marks; this 170110831 clip shows clearer reflections. Different lighting and angles do not establish quantified defect removal. No coating claim. Supersedes the disputed 170040614 frame throughout the site.',
  },
  {
    name: 'audi-wheel-finish',
    source: cars + 'PXL_20260424_134358047.mp4',
    frameTime: 0.9,
    stage: 'after',
    widths: [480, 800, 1080],
    note: 'White Audi rear quarter and clean dark alloy. Natural brake-disc colour retained; no retouching.',
  },
  {
    name: 'light-leather-interior',
    source: 'source-photos/finished interiors-1-001/finished interiors/PXL_20260916_124654199.jpg',
    stage: 'after',
    widths: [480, 800, 1200, 1600],
    note: 'Clean light-leather passenger seat and door trim. Existing leather creasing, door-pocket contents and genuine surroundings retained.',
  },
  {
    name: 'range-assessment',
    source:
      'source-photos/range rover sport ceramic-1-001/range rover sport ceramic/PXL_20261016_102733608.mp4',
    frameTime: 1.2,
    stage: 'before',
    widths: [480, 800, 1080],
    note: 'Range Rover door during initial assessment, with visible fine marks and droplets. Same documented job as machine-polishing and finished Range Rover photographs. Different surfaces and lighting prohibit an aligned comparison or quantified correction claim.',
  },
];
for (const asset of assets) {
  let input = asset.source;
  if (asset.frameTime !== undefined) {
    input = `${scratch}/${asset.name}.jpg`;
    await exec(ffmpeg.path, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-ss',
      String(asset.frameTime),
      '-i',
      asset.source,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      '-y',
      input,
    ]);
  }
  let source = sharp(input).rotate();
  if (asset.crop) source = source.extract(asset.crop);
  const buffer = await source.toBuffer();
  const metadata = await sharp(buffer).metadata();
  asset.width = metadata.width;
  asset.height = metadata.height;
  asset.outputs = [];
  for (const width of asset.widths)
    for (const format of ['avif', 'webp']) {
      const path = `public/media/${asset.name}-${width}.${format}`;
      const pipeline = sharp(buffer).resize({ width, withoutEnlargement: true });
      if (format === 'avif') await pipeline.avif({ quality: 58, effort: 4 }).toFile(path);
      else await pipeline.webp({ quality: 85 }).toFile(path);
      asset.outputs.push({ path: path.replace('public', ''), bytes: (await stat(path)).size });
    }
}
await writeFile(
  'content/editorial-media-selection.json',
  JSON.stringify(
    {
      reviewDate: '2026-11-16',
      method:
        'Reconsidered the three mixed-exterior sheets plus the interior, seat and Range Rover job sheets. Selected frames and original photographs reviewed individually. Extraction, documented crop, resize and encoding only; no defect removal or colour grading.',
      assets,
    },
    null,
    2,
  ) + '\n',
);
console.log(`Built ${assets.length} reviewed image sets.`);
// Keep the local review inventory in step with all published selections.
const classifications = JSON.parse(await readFile('asset-review/site-classification.json', 'utf8'));
const disputedBmw = classifications.find(
  (item) => item.source === 'cars-1-001/cars/PXL_20250825_170040614.mp4',
);
if (disputedBmw) {
  disputedBmw.stage = 'uncertain';
  disputedBmw.note = 'User disputed the finished-work classification on 2026-11-16. Withdrawn from public use; do not reselect as a verified finished result.';
}
const base = JSON.parse(await readFile('content/media-selection.json', 'utf8'));
const art = JSON.parse(await readFile('content/art-media-selection.json', 'utf8'));
for (const asset of [...base.assets, ...art.assets, ...assets]) {
  const original = classifications.find(
    (item) => item.source === asset.source.replace(/^source-photos\//, ''),
  );
  if (original) {
    original.stage = asset.stage;
    original.note = `${asset.note} Classification applies to the selected photograph/frame, not unreviewed footage elsewhere in a clip.`;
  }
}
await writeFile(
  'asset-review/site-classification.json',
  JSON.stringify(classifications, null, 2) + '\n',
);
