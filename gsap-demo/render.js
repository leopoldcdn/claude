// Renders a GSAP page frame by frame by seeking its paused timeline (window.tl), then encodes with ffmpeg.
// Usage: node render.js [page.html] [output.mp4] [fps] [workers]
const { chromium } = require('playwright-core');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PAGE = path.resolve(__dirname, process.argv[2] || 'index.html');
const OUT = process.argv[3] || 'demo.mp4';
const FPS = Number(process.argv[4] || 30);
const WORKERS = Number(process.argv[5] || 4);
const FRAMES_DIR = path.join(__dirname, 'frames');
const VIEWPORT = { width: 1920, height: 1080 };

async function openPage(browser) {
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto('file://' + PAGE);
  await page.evaluate(() => window.ready);
  return page;
}

(async () => {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR);

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const first = await openPage(browser);
  const duration = await first.evaluate(() => window.tl.duration());
  const total = Math.ceil(duration * FPS);
  console.log(`Duration ${duration.toFixed(2)}s -> ${total} frames @ ${FPS}fps, ${WORKERS} workers`);

  // Each worker renders a contiguous chunk so its timeline only ever seeks forward.
  const chunk = Math.ceil(total / WORKERS);
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const page = w === 0 ? first : await openPage(browser);
    for (let i = w * chunk; i < Math.min(total, (w + 1) * chunk); i++) {
      // Don't return seek()'s result: Playwright would try to serialize the whole timeline.
      await page.evaluate((t) => { window.tl.seek(t, false); }, i / FPS);
      await page.screenshot({ path: path.join(FRAMES_DIR, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
    }
  }));
  await browser.close();

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'f%05d.jpg'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('Wrote', OUT);
})();
