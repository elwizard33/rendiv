// usage: node render.mjs <CompositionId> [concurrency]
import path from 'node:path';
import os from 'node:os';
import { bundle } from '@rendiv/bundler';
import { selectComposition, renderFrames, stitchFramesToVideo } from '@rendiv/renderer';

const [id, concurrency = '1'] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.tsx') });
const composition = await selectComposition(serveUrl, id);
const framesDir = path.join(os.tmpdir(), `repro-${id}-${Date.now()}`);
const { audioSources } = await renderFrames({ serveUrl, composition, outputDir: framesDir, concurrency: Number(concurrency) });
console.log('audioSources:', JSON.stringify(audioSources));
await stitchFramesToVideo({ framesDir, outputPath: `out/${id}.mp4`, fps: composition.fps, audioSources, assetsDir: serveUrl });
console.log('done:', `out/${id}.mp4`);
