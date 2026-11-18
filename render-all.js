const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT = __dirname;
const PREVIEWS_DIR = path.join(ROOT, 'renders', 'previews');
const WEBM_DIR = path.join(ROOT, 'renders', 'webm');
const FRAMES_TMP = path.join(ROOT, 'renders', '_tmp_frames');

fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
fs.mkdirSync(WEBM_DIR, { recursive: true });

const SCENES = [
  {
    id: '01-starting-soon-5min',
    file: 'scenes/01-starting-soon.html?seconds=297&lang=pt',
    alpha: false
  },
  {
    id: '01b-starting-soon-10min',
    file: 'scenes/01-starting-soon.html?seconds=598&lang=pt',
    alpha: false
  },
  {
    id: '02-be-right-back',
    file: 'scenes/02-be-right-back.html?seconds=474&lang=pt',
    alpha: false
  },
  {
    id: '03-ending-soon',
    file: 'scenes/03-ending-soon.html?seconds=598&lang=pt',
    alpha: false
  },
  {
    id: '04-intermission',
    file: 'scenes/04-intermission.html?lang=pt',
    alpha: false
  },
  {
    id: '05-mission-completed',
    file: 'scenes/05-mission-completed.html?lang=pt',
    alpha: true
  },
  {
    id: '06a-facecam-subgoal',
    file: 'scenes/06-facecam-alerts-widget.html?mode=subgoal&goal=subs&lang=pt',
    alpha: true
  },
  {
    id: '06a2-facecam-followgoal',
    file: 'scenes/06-facecam-alerts-widget.html?mode=followgoal&goal=follows&lang=pt',
    alpha: true
  },
  {
    id: '06b-facecam-alert-donation',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=donate&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '06c-facecam-alert-follow',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=follow&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '06d-facecam-alert-sub',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=sub&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '06e-facecam-alert-subgift',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=subgift&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '06f-facecam-alert-raid',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=raid&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '06g-facecam-alert-bits',
    file: 'scenes/06-facecam-alerts-widget.html?mode=alert&alertType=bits&icons=1&lang=pt',
    alpha: true
  },
  {
    id: '07-chat-widget',
    file: 'scenes/07-chat-widget.html?lang=pt',
    alpha: true
  },
  {
    id: '08-gameplay-live-hud',
    file: 'scenes/08-gameplay-live-hud.html?transparent=0&mode=alert&alertType=follow&lang=pt',
    alpha: true
  }
];

(async () => {
  console.log('Launching Headless Chromium with WebGL hardware acceleration...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  page.on('console', msg => { if (msg.type() === 'error') console.error('PAGE ERR:', msg.text()); });
  page.on('pageerror', err => console.error('PAGE EXCEPTION:', err.message));

  for (const scene of SCENES) {
    const url = 'file:///' + path.join(ROOT, scene.file.split('?')[0]).replace(/\\/g, '/') +
                (scene.file.includes('?') ? '?' + scene.file.split('?')[1] : '');

    console.log(`Rendering Scene: ${scene.id} -> ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    // 1. High-Res 1920x1080 PNG Preview
    const pngPath = path.join(PREVIEWS_DIR, `${scene.id}.png`);
    await page.screenshot({
      path: pngPath,
      omitBackground: scene.alpha
    });
    console.log(`  Saved PNG preview: ${pngPath}`);

    // 2. Render 36-frame 24fps WebM Loop
    const sceneTmp = path.join(FRAMES_TMP, scene.id);
    fs.mkdirSync(sceneTmp, { recursive: true });

    const totalFrames = 36;
    for (let f = 0; f < totalFrames; f++) {
      const frameFile = path.join(sceneTmp, `frame_${String(f).padStart(3, '0')}.png`);
      await page.screenshot({
        path: frameFile,
        omitBackground: scene.alpha
      });
      await page.waitForTimeout(40);
    }

    const webmOut = path.join(WEBM_DIR, `${scene.id}.webm`);
    const pixFmt = scene.alpha ? 'yuva420p' : 'yuv420p';
    const ffmpegCmd = `ffmpeg -y -framerate 24 -i "${path.join(sceneTmp, 'frame_%03d.png')}" -c:v libvpx-vp9 -pix_fmt ${pixFmt} -b:v 4M -auto-alt-ref 0 "${webmOut}"`;
    execSync(ffmpegCmd, { stdio: 'ignore' });
    console.log(`  Encoded OBS WebM: ${webmOut}`);

    fs.rmSync(sceneTmp, { recursive: true, force: true });
  }

  fs.rmSync(FRAMES_TMP, { recursive: true, force: true });
  await browser.close();
  console.log('All scenes & all 6 alert types rendered successfully!');
})();
