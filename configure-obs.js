const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uuid = () => crypto.randomUUID();

const ROOT = 'D:/organizador financeiro/gta6-3d-stream-package';
const OBS_SCENES_DIR = 'C:/Users/Usuario/AppData/Roaming/obs-studio/basic/scenes';

// Read existing Sem_nome.json to preserve exact hardware device IDs (monitors, microphone, webcam)
const existingPath = path.join(OBS_SCENES_DIR, 'Sem_nome.json');
const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

// Backup existing Sem_nome.json safely
fs.copyFileSync(existingPath, path.join(OBS_SCENES_DIR, 'Sem_nome.backup-before-gta6.json'));

// Reusable item builder for a scene (computes exact OBS pos_rel = (x - 960)/540, (y - 540)/540 so nothing ever shifts or crops!)
let globalItemId = 1;
function makeSceneItem(name, sourceUuid, opts = {}) {
  const px = opts.x || 0.0;
  const py = opts.y || 0.0;
  const sx = opts.scaleX || 1.0;
  const sy = opts.scaleY || 1.0;
  const bx = opts.boundsX || 0.0;
  const by = opts.boundsY || 0.0;

  return {
    name,
    source_uuid: sourceUuid,
    visible: opts.visible !== undefined ? opts.visible : true,
    locked: opts.locked !== undefined ? opts.locked : false,
    rot: 0.0,
    scale_ref: { x: 1920.0, y: 1080.0 },
    align: 5,
    bounds_type: opts.bounds_type || 0,
    bounds_align: 0,
    bounds_crop: false,
    crop_left: 0,
    crop_top: 0,
    crop_right: 0,
    crop_bottom: 0,
    id: globalItemId++,
    group_item_backup: false,
    pos: { x: px, y: py },
    pos_rel: {
      x: (px - 960.0) / 540.0,
      y: (py - 540.0) / 540.0
    },
    scale: { x: sx, y: sy },
    scale_rel: { x: sx, y: sy },
    bounds: { x: bx, y: by },
    bounds_rel: {
      x: bx / 540.0,
      y: by / 540.0
    },
    scale_filter: 'disable',
    blend_method: 'default',
    blend_type: 'normal',
    show_transition: { duration: 0 },
    hide_transition: { duration: 0 },
    private_settings: {}
  };
}

function makeBrowserSource(name, localFileOrUrl, width = 1920, height = 1080, isLocal = true, rerouteAudio = false) {
  const id = uuid();
  return {
    prev_ver: 536870916,
    name,
    uuid: id,
    id: 'browser_source',
    versioned_id: 'browser_source',
    settings: isLocal
      ? {
          is_local_file: true,
          local_file: localFileOrUrl,
          width,
          height,
          fps: 60,
          fps_custom: true,
          reroute_audio: rerouteAudio,
          shutdown: false
        }
      : {
          is_local_file: false,
          url: localFileOrUrl,
          width,
          height,
          fps: 60,
          fps_custom: true,
          reroute_audio: rerouteAudio,
          shutdown: false
        },
    mixers: 255,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: { 'ObsBrowser.Refresh': [] },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    private_settings: {}
  };
}

// 1. Hardware Sources (Preserved from user's PC)
const webcamUuid = 'b66dc51f-b860-467f-8602-26099c441ee4';
const webcamSource = {
  prev_ver: 536870916,
  name: 'Dispositivo de captura de vídeo',
  uuid: webcamUuid,
  id: 'dshow_input',
  versioned_id: 'dshow_input',
  settings: {
    video_device_id: 'Camera (NVIDIA Broadcast):',
    last_video_device_id: 'Camera (NVIDIA Broadcast):'
  },
  mixers: 255,
  sync: 0,
  flags: 0,
  volume: 1.0,
  balance: 0.5,
  enabled: true,
  muted: false,
  'push-to-mute': false,
  'push-to-mute-delay': 0,
  'push-to-talk': false,
  'push-to-talk-delay': 0,
  hotkeys: {},
  deinterlace_mode: 0,
  deinterlace_field_order: 0,
  monitoring_type: 0,
  private_settings: {}
};

const monitorUuid = 'a419a4f6-8c86-4fa4-8098-58589c1f5e20';
const monitorSource = {
  prev_ver: 536870916,
  name: 'Captura de monitor',
  uuid: monitorUuid,
  id: 'monitor_capture',
  versioned_id: 'monitor_capture',
  settings: {
    method: 0,
    monitor_id: '\\\\?\\DISPLAY#VIE2023#5&ded3b26&0&UID4357#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}'
  },
  mixers: 0,
  sync: 0,
  flags: 0,
  volume: 1.0,
  balance: 0.5,
  enabled: true,
  muted: false,
  'push-to-mute': false,
  'push-to-mute-delay': 0,
  'push-to-talk': false,
  'push-to-talk-delay': 0,
  hotkeys: {},
  deinterlace_mode: 0,
  deinterlace_field_order: 0,
  monitoring_type: 0,
  private_settings: {}
};

const gameCaptureUuid = uuid();
const gameCaptureSource = {
  prev_ver: 536870916,
  name: 'Captura de Jogo (GTA 6 / Fullscreen)',
  uuid: gameCaptureUuid,
  id: 'game_capture',
  versioned_id: 'game_capture',
  settings: {
    capture_mode: 'any_fullscreen'
  },
  mixers: 0,
  sync: 0,
  flags: 0,
  volume: 1.0,
  balance: 0.5,
  enabled: true,
  muted: false,
  'push-to-mute': false,
  'push-to-mute-delay': 0,
  'push-to-talk': false,
  'push-to-talk-delay': 0,
  hotkeys: {},
  deinterlace_mode: 0,
  deinterlace_field_order: 0,
  monitoring_type: 0,
  private_settings: {}
};

// 2. Overlay & Widget Browser Sources (Matching friend's exact architecture + 3D enhancements)
const bsInicio   = makeBrowserSource('Overlay Início 3D', `${ROOT}/cena-inicio.html`, 1920, 1080, true);
const bsChat     = makeBrowserSource('Overlay Só Chat 3D', `${ROOT}/cena-chat.html`, 1920, 1080, true);
const bsGameplay = makeBrowserSource('Overlay Gameplay 3D', `${ROOT}/overlay-gameplay.html`, 1920, 1080, true);
const bsPausa    = makeBrowserSource('Overlay Pausa 3D', `${ROOT}/cena-pausa.html`, 1920, 1080, true);
const bsFim      = makeBrowserSource('Overlay Fim 3D', `${ROOT}/cena-fim.html`, 1920, 1080, true);
const bsMissao   = makeBrowserSource('Missão Concluída 3D (Ativar ao vencer)', `${ROOT}/cena-missao.html`, 1920, 1080, true);

// Read custom LivePix CSS so OBS Browser Source automatically styles the live widget!
const livePixCustomCss = fs.readFileSync(path.join(ROOT, 'livepix-alert.css'), 'utf8');
const LIVEPIX_WIDGET_URL = 'https://widget.livepix.gg/embed/bba99ac8-999e-4bf3-898f-17815c347686';

// Alerts & Chat Widgets (Positioned identically to friend's OBS setup!)
const bsAlerts   = makeBrowserSource('alerts', `${ROOT}/preview-alertas.html`, 820, 270, true, true);
const bsLivePix  = makeBrowserSource('livepix', LIVEPIX_WIDGET_URL, 820, 270, false, true);
bsLivePix.settings.css = livePixCustomCss;
const bsChatBox  = makeBrowserSource('chat', `${ROOT}/chat-widget.html`, 476, 640, true, false);
const bsStinger  = makeBrowserSource('Transição Stinger (@apenasojorge)', `${ROOT}/transicao.html?manual=1`, 1920, 1080, true, false);

// 3. Build the 8 Scenes from Friend's OBS Screenshot:
//    Início, Só Chat, Gameplay, Pausa, Fim, Web Cam, Desktop, Vídeo
function makeScene(name, items) {
  return {
    prev_ver: 536870916,
    name,
    uuid: uuid(),
    id: 'scene',
    versioned_id: 'scene',
    settings: {
      id_counter: globalItemId + 10,
      custom_size: false,
      items
    },
    mixers: 0,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: { 'OBSBasic.SelectScene': [] },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    canvas_uuid: '6c69626f-6273-4c00-9d88-c5136d61696e',
    private_settings: {}
  };
}

// Scene 1: Início
const sceneInicio = makeScene('Início', [
  makeSceneItem(bsInicio.name, bsInicio.uuid, { locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsLivePix.name, bsLivePix.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 2: Só Chat (Webcam 1280x720 at X:52, Y:132 behind Overlay Só Chat 3D + Chat at X:1376, Y:196)
const sceneSoChat = makeScene('Só Chat', [
  makeSceneItem(webcamSource.name, webcamSource.uuid, {
    x: 52,
    y: 132,
    bounds_type: 2,
    boundsX: 1280,
    boundsY: 720
  }),
  makeSceneItem(bsChat.name, bsChat.uuid, { locked: true }),
  makeSceneItem(bsChatBox.name, bsChatBox.uuid, { x: 1376, y: 196, scaleX: 1.0, scaleY: 1.0, locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsLivePix.name, bsLivePix.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 3: Gameplay (Monitor + Game Capture + Webcam 416x234 at X:40, Y:304 + Overlay Gameplay 3D + Chat ABOVE Cam + Alerts + LivePix)
const sceneGameplay = makeScene('Gameplay', [
  makeSceneItem(monitorSource.name, monitorSource.uuid, { locked: true }),
  makeSceneItem(gameCaptureSource.name, gameCaptureSource.uuid, { locked: true }),
  makeSceneItem(webcamSource.name, webcamSource.uuid, {
    x: 40,
    y: 304,
    bounds_type: 2,
    boundsX: 416,
    boundsY: 234
  }),
  makeSceneItem(bsGameplay.name, bsGameplay.uuid, { locked: true }),
  makeSceneItem(bsChatBox.name, bsChatBox.uuid, { x: 36, y: 32, scaleX: 0.89, scaleY: 0.38, locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsLivePix.name, bsLivePix.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsMissao.name, bsMissao.uuid, { visible: false, locked: false })
]);

// Scene 4: Pausa
const scenePausa = makeScene('Pausa', [
  makeSceneItem(bsPausa.name, bsPausa.uuid, { locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsLivePix.name, bsLivePix.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 5: Fim
const sceneFim = makeScene('Fim', [
  makeSceneItem(bsFim.name, bsFim.uuid, { locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 6: Web Cam (Full Screen Webcam + Alerts)
const sceneWebCam = makeScene('Web Cam', [
  makeSceneItem(webcamSource.name, webcamSource.uuid, {
    x: 0,
    y: 0,
    bounds_type: 2,
    boundsX: 1920,
    boundsY: 1080
  }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true }),
  makeSceneItem(bsLivePix.name, bsLivePix.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 7: Desktop (Full Screen Desktop + Mini Cam + Overlay Gameplay 3D)
const sceneDesktop = makeScene('Desktop', [
  makeSceneItem(monitorSource.name, monitorSource.uuid, { locked: true }),
  makeSceneItem(webcamSource.name, webcamSource.uuid, {
    x: 40,
    y: 304,
    bounds_type: 2,
    boundsX: 416,
    boundsY: 234
  }),
  makeSceneItem(bsGameplay.name, bsGameplay.uuid, { locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true })
]);

// Scene 8: Vídeo (Reaction / Media Scene)
const sceneVideo = makeScene('Vídeo', [
  makeSceneItem(monitorSource.name, monitorSource.uuid, { locked: true }),
  makeSceneItem(webcamSource.name, webcamSource.uuid, {
    x: 40,
    y: 304,
    bounds_type: 2,
    boundsX: 416,
    boundsY: 234
  }),
  makeSceneItem(bsGameplay.name, bsGameplay.uuid, { locked: true }),
  makeSceneItem(bsAlerts.name, bsAlerts.uuid, { x: 550, y: 20, locked: true })
]);

const allScenes = [
  sceneInicio,
  sceneSoChat,
  sceneGameplay,
  scenePausa,
  sceneFim,
  sceneWebCam,
  sceneDesktop,
  sceneVideo
];

const allSources = [
  ...allScenes,
  webcamSource,
  monitorSource,
  gameCaptureSource,
  bsInicio,
  bsChat,
  bsGameplay,
  bsPausa,
  bsFim,
  bsMissao,
  bsAlerts,
  bsLivePix,
  bsChatBox,
  bsStinger
];

const obsCollection = {
  DesktopAudioDevice1: existing.DesktopAudioDevice1,
  AuxAudioDevice1: existing.AuxAudioDevice1,
  current_scene: 'Gameplay',
  current_program_scene: 'Gameplay',
  scene_order: allScenes.map(s => ({ name: s.name })),
  name: 'Sem nome',
  sources: allSources,
  groups: [],
  quick_transitions: existing.quick_transitions || [],
  transitions: [],
  saved_projectors: [],
  canvases: [],
  current_transition: 'Esmaecer',
  transition_duration: 350,
  preview_locked: false,
  scaling_enabled: false,
  scaling_level: -8,
  scaling_off_x: 0.0,
  scaling_off_y: 0.0,
  'virtual-camera': { type2: 3 },
  modules: existing.modules || {},
  resolution: { x: 1920, y: 1080 },
  version: 2
};

// Write directly to active OBS scene collection (Sem_nome.json) AND a dedicated backup file (apenasojorge_GTA6.json)
fs.writeFileSync(existingPath, JSON.stringify(obsCollection, null, 4), 'utf8');

const namedCollection = { ...obsCollection, name: 'apenasojorge GTA 6 3D' };
fs.writeFileSync(path.join(OBS_SCENES_DIR, 'apenasojorge_GTA6_3D.json'), JSON.stringify(namedCollection, null, 4), 'utf8');
fs.writeFileSync(path.join(ROOT, 'OBS-Cena-Colecao-apenasojorge.json'), JSON.stringify(namedCollection, null, 4), 'utf8');

console.log('OBS Studio Scene Collection configured with all 8 scenes & 3D overlays!');
