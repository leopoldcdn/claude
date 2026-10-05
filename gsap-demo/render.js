// Renders index.html frame by frame by seeking the GSAP timeline, then encodes with ffmpeg.
// Usage: node render.js [fps] [output]
const { chromium } = require('playwright-core');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = Number(process.argv[2] || 30);
const OUT = process.argv[3] || 'demo.mp4';
const FRAMES_DIR = path.join(__dirname, 'frames');

(async () => {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR);

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => window.ready);

  const duration = await page.evaluate(() => window.tl.duration());
  const total = Math.ceil(duration * FPS);
  console.log(`Duration ${duration.toFixed(2)}s -> ${total} frames @ ${FPS}fps`);

  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => { window.tl.seek(t, false); }, i / FPS);
    await page.screenshot({ path: path.join(FRAMES_DIR, `f${String(i).padStart(5, '0')}.png`) });
  }
  await browser.close();

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'f%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('Wrote', OUT);
})();
