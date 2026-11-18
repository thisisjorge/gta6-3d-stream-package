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
    id: '01-cena-inicio-3d',
    file: 'cena-inicio.html',
    alpha: false
  },
  {
    id: '02-cena-pausa-3d',
    file: 'cena-pausa.html',
    alpha: false
  },
  {
    id: '03-cena-fim-3d',
    file: 'cena-fim.html',
    alpha: false
  },
  {
    id: '04-cena-so-chat-3d',
    file: 'cena-chat.html',
    alpha: false
  },
  {
    id: '05-overlay-gameplay-clean-3d',
    file: 'overlay-gameplay.html?guias=1',
    alpha: true
  },
  {
    id: '06-estudio-preview-completo',
    file: 'preview.html',
    alpha: false,
    triggerAlert: 'raid'
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
    await page.waitForTimeout(950);

    if (scene.triggerAlert) {
      await page.click(`[data-alert="${scene.triggerAlert}"]`);
      await page.waitForTimeout(750);
    }

    const pngPath = path.join(PREVIEWS_DIR, `${scene.id}.png`);
    await page.screenshot({
      path: pngPath,
      omitBackground: scene.alpha
    });
    console.log(`  Saved PNG preview: ${pngPath}`);
  }

  await browser.close();
  console.log('All unified Miami Sunset + 3D GTA 6 scenes rendered successfully!');
})();
