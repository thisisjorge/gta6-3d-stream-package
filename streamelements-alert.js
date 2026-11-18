/**
 * ============================================================================
 *  STREAMELEMENTS CUSTOM WIDGET — JS (MIAMI SUNSET / VICE EDITION)
 *  Cole este arquivo na aba JS do Custom Widget no StreamElements.
 *  Suporta: Follow/Inscrito, Sub/Membro, Gift Sub, SuperChat/Donate (com
 *           evolução por valor: notas -> maço -> maleta -> cofre),
 *           Bits/Super Sticker e Raid (Polícia GTA 6★).
 * ============================================================================
 */

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // CONFIGURAÇÕES RÁPIDAS DO ALERTA
  // --------------------------------------------------------------------------
  const ALERT_CONFIG = {
    duracaoMs: 6200,         // Tempo visível de cada alerta (ms)
    intervaloEntreMs: 500,   // Pausa entre um alerta e o próximo da fila (ms)
    ativarSom: true,         // true = toca musiquinha ambiente suave por evento
    volumeSom: 0.26,         // Volume baixo e agradável (0.0 a 1.0) para não brigar com a voz
    moedaPadrao: "R$",       // Moeda exibida quando o evento não informa símbolo

    // Limites para evolução visual do Donate / SuperChat (em R$ ou moeda configurada)
    tiersDonate: {
      macoMin: 20,           // >= 20: Maço de notas
      maletaMin: 50,         // >= 50: Maleta de dinheiro
      cofreMin: 100          // >= 100: Mega Cofre
    },

    // Opcional: cole links diretos de MP3/OGG caso queira usar músicas próprias
    sonsCustomizados: {
      follow: "",
      sub: "",
      gift: "",
      tip: "",
      cheer: "",
      raid: ""
    }
  };

  // --------------------------------------------------------------------------
  // ÍCONES SVG ESPECÍFICOS POR TIPO DE EVENTO (E POR TIER DE DONATE)
  // --------------------------------------------------------------------------
  const STAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.4l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 16.95l-5.7 3.01 1.09-6.35-4.62-4.5 6.38-.93L12 2.4z"/></svg>`;

  const BILL_SVG = `<svg viewBox="0 0 42 22" fill="none"><rect x="1" y="1" width="40" height="20" rx="3" fill="rgba(46, 204, 113, 0.25)" stroke="currentColor" stroke-width="1.5"/><circle cx="21" cy="11" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M21 8.5v5M19.5 9.8c0-.6.7-1 1.5-1s1.5.4 1.5 1-.7 1-1.5 1.1-1.5.5-1.5 1.1.7 1 1.5 1 1.5-.4 1.5-1" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><circle cx="6.5" cy="11" r="1.2" fill="currentColor"/><circle cx="35.5" cy="11" r="1.2" fill="currentColor"/></svg>`;

  const COIN_SVG = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(255, 212, 121, 0.28)" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M14.2 9.2c0-.9-1-1.5-2.2-1.5s-2.2.6-2.2 1.5 1 1.5 2.2 1.7c1.2.2 2.2.8 2.2 1.7s-1 1.6-2.2 1.6-2.2-.7-2.2-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  const CHIP_SVG = `<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#e86878" stroke="#fffaf4" stroke-width="2" stroke-dasharray="4 3"/><circle cx="14" cy="14" r="8" fill="#1e1238" stroke="#ffd479" stroke-width="1.4"/><circle cx="14" cy="14" r="3.2" fill="#67d7e0"/></svg>`;

  const SPARK_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2z"/></svg>`;

  const ICONS = {
    // Follow: Sol do pôr do sol de Miami + Palmeira
    follow: `<svg viewBox="0 0 64 56" fill="none"><circle cx="32" cy="30" r="18" fill="url(#followSun)" opacity="0.9"/><defs><linearGradient id="followSun" x1="32" y1="12" x2="32" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd479"/><stop offset="0.55" stop-color="#ff9466"/><stop offset="1" stop-color="#e86878"/></linearGradient></defs><path d="M10 42h44" stroke="#67d7e0" stroke-width="2.2" stroke-linecap="round"/><path d="M33 42c0-7 1-14 3-19" stroke="#1e1238" stroke-width="3" stroke-linecap="round"/><path d="M36 23c-5-4-11-3-14 1 4-1 9 0 14-1zM36 23c5-4 11-3 14 1-4-1-9 0-14-1zM36 23c-4-7-9-8-12-5 4 1 8 3 12 5zM36 23c4-7 9-8 12-5-4 1-8 3-12 5z" fill="#1e1238"/></svg>`,
    // Sub: Cartão Passe VIP com Coroa
    sub: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M7.5 14.5l1.2-4.2 3.3 2.3 3.3-2.3 1.2 4.2H7.5z" fill="currentColor" opacity="0.3"/><path d="M7.5 14.5l1.2-4.2 3.3 2.3 3.3-2.3 1.2 4.2H7.5z"/></svg>`,
    // Gift: Caixa de Presente VIP
    gift: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 7h-2.18A3 3 0 0 0 12 4.35 3 3 0 0 0 6.18 7H4a2 2 0 0 0-2 2v3h9V7h2v5h9V9a2 2 0 0 0-2-2zM9 7a1 1 0 1 1 0-2c1.1 0 2 .9 2 2H9zm6 0h-2c0-1.1.9-2 2-2a1 1 0 1 1 0 2zM4 14v6a2 2 0 0 0 2 2h5v-8H4zm9 0v8h5a2 2 0 0 0 2-2v-6h-7z"/></svg>`,
    // Tier 1 Donate: Leque de notas verdes
    tip1: `<svg viewBox="0 0 92 78" fill="none"><g transform="rotate(-12 46 42)"><rect x="14" y="20" width="60" height="32" rx="4" fill="#1e5c42" stroke="#4fe39a" stroke-width="2"/><circle cx="44" cy="36" r="8" stroke="#4fe39a" stroke-width="1.8"/></g><g transform="rotate(6 46 42)"><rect x="18" y="24" width="60" height="32" rx="4" fill="#257352" stroke="#6ff2b2" stroke-width="2.2"/><circle cx="48" cy="40" r="8.5" fill="rgba(79,227,154,0.22)" stroke="#a3ffcf" stroke-width="1.8"/><text x="48" y="44" text-anchor="middle" fill="#a3ffcf" font-family="Montserrat,sans-serif" font-size="12" font-weight="900">$</text></g></svg>`,
    // Tier 2 Donate: Maço grosso amarrado com cinta dourada
    tip2: `<svg viewBox="0 0 92 78" fill="none"><rect x="12" y="42" width="68" height="20" rx="3" fill="#174a35" stroke="#4fe39a" stroke-width="1.8"/><rect x="12" y="34" width="68" height="20" rx="3" fill="#1e5e44" stroke="#4fe39a" stroke-width="1.8"/><rect x="12" y="22" width="68" height="22" rx="4" fill="#267a57" stroke="#7cf5ba" stroke-width="2.2"/><rect x="37" y="21" width="18" height="42" rx="2" fill="#ffd479" stroke="#fff3c4" stroke-width="1.5"/><text x="46" y="37" text-anchor="middle" fill="#1a1026" font-family="Montserrat,sans-serif" font-size="13" font-weight="900">$$</text></svg>`,
    // Tier 3 Donate: Maleta executiva aberta transbordando notas
    tip3: `<svg viewBox="0 0 92 78" fill="none"><path d="M18 32L24 14H68L74 32" fill="#2c1d24" stroke="#ffd479" stroke-width="2.2" stroke-linejoin="round"/><rect x="26" y="18" width="18" height="16" rx="2" transform="rotate(-10 26 18)" fill="#2a825c" stroke="#6ff2b2" stroke-width="1.8"/><rect x="44" y="16" width="18" height="16" rx="2" transform="rotate(8 44 16)" fill="#246e4e" stroke="#6ff2b2" stroke-width="1.8"/><rect x="34" y="19" width="22" height="16" rx="2" fill="#32996d" stroke="#a3ffcf" stroke-width="2"/><rect x="12" y="30" width="68" height="38" rx="6" fill="#2d1e26" stroke="#ffd479" stroke-width="2.4"/><path d="M12 43H80" stroke="#ffd479" stroke-width="2"/><rect x="39" y="38" width="14" height="10" rx="2" fill="#ffd479"/><path d="M36 30V25C36 22.8 37.8 21 40 21H52C54.2 21 56 22.8 56 25V30" stroke="#ffe59e" stroke-width="2.4"/></svg>`,
    // Tier 4 Donate: Mega Cofre blindado dourado e esmeralda
    tip4: `<svg viewBox="0 0 96 82" fill="none"><rect x="12" y="8" width="72" height="64" rx="8" fill="#1e1b29" stroke="#ffe17d" stroke-width="2.8"/><rect x="20" y="16" width="56" height="48" rx="4" fill="#122126" stroke="#39f09c" stroke-width="1.8"/><circle cx="48" cy="40" r="16" fill="#231e2c" stroke="#ffe17d" stroke-width="2.6"/><circle cx="48" cy="40" r="5" fill="#39f09c"/><path d="M48 24V56M32 40H64M36.7 28.7L59.3 51.3M59.3 28.7L36.7 51.3" stroke="#ffe17d" stroke-width="2.2" stroke-linecap="round"/><rect x="22" y="72" width="10" height="5" rx="2" fill="#ffe17d"/><rect x="64" y="72" width="10" height="5" rx="2" fill="#ffe17d"/></svg>`,
    // Cheer / Bits: Ficha de Poker Neon Miami Sunset (Indigo, Coral, Ouro e Aqua)
    cheer: `<svg viewBox="0 0 92 92" fill="none"><circle cx="46" cy="46" r="42" fill="#1e1238" stroke="#e86878" stroke-width="5"/><circle cx="46" cy="46" r="40" stroke="#ffd479" stroke-width="6" stroke-dasharray="10 10.9"/><circle cx="46" cy="46" r="31" fill="#2a164d" stroke="#67d7e0" stroke-width="2.2"/><circle cx="46" cy="46" r="24" fill="#180d30" stroke="rgba(255,250,244,0.35)" stroke-width="1.2"/><text x="46" y="43" text-anchor="middle" fill="#ffd479" font-family="Montserrat,sans-serif" font-size="16" font-weight="900">A♦</text><text x="46" y="59" text-anchor="middle" fill="#67d7e0" font-family="Montserrat,sans-serif" font-size="9" font-weight="800" letter-spacing="1.5">VICE</text></svg>`,
    // Raid: Sirene de Polícia GTA
    raid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17v-4a6 6 0 0 1 12 0v4" fill="currentColor" opacity="0.24"/><path d="M6 17v-4a6 6 0 0 1 12 0v4"/><rect x="4" y="17" width="16" height="3" rx="1"/><path d="M12 3v2M4.5 6.5l1.5 1.5M19.5 6.5L18 8"/></svg>`
  };

  // --------------------------------------------------------------------------
  // TRILHAS E EFEITOS SONOROS ESPECÍFICOS POR ALERTA (WEB AUDIO API)
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function playTone(ctx, dest, opts) {
    const {
      type = "sine",
      freq = 440,
      freqEnd = null,
      start = ctx.currentTime,
      dur = 0.3,
      peak = 0.14,
      attack = 0.02
    } = opts;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (freqEnd !== null) {
      osc.frequency.linearRampToValueAtTime(freqEnd, start + dur);
    }
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(peak, start + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.04);
  }

  function playAlertMusic(type, tier = 1) {
    if (!ALERT_CONFIG.ativarSom) return;

    const customUrl = ALERT_CONFIG.sonsCustomizados[type];
    if (customUrl) {
      try {
        const audio = new Audio(customUrl);
        audio.volume = ALERT_CONFIG.volumeSom;
        audio.play().catch(() => {});
        return;
      } catch (_) {}
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

      const now = audioCtx.currentTime;
      const masterVol = Math.max(0.03, Math.min(0.45, ALERT_CONFIG.volumeSom));

      const masterGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);

      masterGain.gain.setValueAtTime(masterVol, now);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      // 1. FOLLOW — Sino tropical breve e leve (2 notas ensolaradas)
      if (type === "follow") {
        playTone(audioCtx, filter, { type: "sine", freq: 587.33, start: now, dur: 0.42, peak: 0.2 });
        playTone(audioCtx, filter, { type: "triangle", freq: 880.0, start: now + 0.12, dur: 0.65, peak: 0.18 });
        playTone(audioCtx, filter, { type: "sine", freq: 1174.66, start: now + 0.24, dur: 0.85, peak: 0.12 });
        return;
      }

      // 2. SUB — Fanfarra estilo GTA "Mission Passed / Respect+" (synth anos 80 quente)
      if (type === "sub") {
        const fanfareChords = [
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [196.0, 246.94, 293.66, 392.0],  // G6
          [220.0, 261.63, 329.63, 440.0]   // Am
        ];
        fanfareChords.forEach((chord, idx) => {
          const st = now + idx * 0.44;
          chord.forEach((f) =>
            playTone(audioCtx, filter, { type: "sawtooth", freq: f, start: st, dur: 0.72, peak: 0.06, attack: 0.05 })
          );
        });
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playTone(audioCtx, filter, { type: "triangle", freq: f, start: now + 0.08 + idx * 0.22, dur: 0.75, peak: 0.16 });
        });
        return;
      }

      // 3. GIFT — Cascata cintilante de arpejo festivo (Drop VIP)
      if (type === "gift") {
        [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98].forEach((f, idx) => {
          playTone(audioCtx, filter, { type: "triangle", freq: f, start: now + idx * 0.09, dur: 0.55, peak: 0.16, attack: 0.015 });
        });
        [261.63, 329.63, 392.0].forEach((f) => {
          playTone(audioCtx, filter, { type: "sine", freq: f, start: now + 0.15, dur: 1.6, peak: 0.11, attack: 0.08 });
        });
        return;
      }

      // 4. DONATE / LIVEPIX — Caixa registradora / Moedas + groove que evolui com o Tier
      if (type === "tip") {
        // Cha-ching metálico suave
        playTone(audioCtx, masterGain, { type: "sine", freq: 1479.98, start: now, dur: 0.22, peak: 0.16, attack: 0.008 });
        playTone(audioCtx, masterGain, { type: "sine", freq: 1975.53, start: now + 0.08, dur: 0.55, peak: 0.18, attack: 0.008 });

        // Moedas extras nos tiers Maleta (3) e Cofre (4)
        if (tier >= 3) {
          [2349.32, 2637.02, 3135.96].forEach((f, idx) => {
            playTone(audioCtx, masterGain, { type: "sine", freq: f, start: now + 0.18 + idx * 0.08, dur: 0.45, peak: 0.12, attack: 0.01 });
          });
        }

        const groove = tier >= 3 ? [130.81, 164.81, 196.0, 261.63] : [130.81, 164.81, 196.0];
        groove.forEach((f, idx) => {
          playTone(audioCtx, filter, { type: "triangle", freq: f, start: now + 0.18 + idx * 0.24, dur: 0.9, peak: 0.13, attack: 0.04 });
        });
        return;
      }

      // 5. BITS (POKER) — Estalinhos de ficha de poker + riff neon Ocean Drive
      if (type === "cheer") {
        // 3 cliques curtos simulando fichas batendo na mesa
        [0, 0.075, 0.15].forEach((offset, idx) => {
          playTone(audioCtx, masterGain, {
            type: "triangle",
            freq: 2600 + idx * 320,
            freqEnd: 900,
            start: now + offset,
            dur: 0.045,
            peak: 0.18,
            attack: 0.003
          });
        });
        // Riff synth neon
        [440, 523.25, 659.25, 587.33, 783.99].forEach((f, idx) => {
          playTone(audioCtx, filter, { type: "sawtooth", freq: f, start: now + 0.24 + idx * 0.16, dur: 0.36, peak: 0.09, attack: 0.02 });
        });
        playTone(audioCtx, filter, { type: "sine", freq: 110, start: now + 0.22, dur: 1.3, peak: 0.22, attack: 0.04 });
        return;
      }

      // 6. RAID (POLÍCIA GTA 6★) — Bip de rádio policial + Sirene bi-tom + pulso grave
      if (type === "raid") {
        // Bip de rádio dispatch
        playTone(audioCtx, filter, { type: "square", freq: 1180, start: now, dur: 0.08, peak: 0.08, attack: 0.005 });
        // Sirene alternando (azul / vermelho) suave com lowpass
        for (let i = 0; i < 4; i++) {
          const st = now + 0.14 + i * 0.36;
          playTone(audioCtx, filter, { type: "triangle", freq: 760, freqEnd: 560, start: st, dur: 0.34, peak: 0.14, attack: 0.02 });
        }
        // Pulso grave estilo perseguição synthwave
        [110, 110, 130.81, 146.83].forEach((f, idx) => {
          playTone(audioCtx, filter, { type: "sawtooth", freq: f, start: now + 0.12 + idx * 0.36, dur: 0.32, peak: 0.12, attack: 0.02 });
        });
      }
    } catch (_) {
      // Ignora bloqueio de autoplay caso o browser exija interação prévia
    }
  }

  window.tocarSomAlerta = playAlertMusic;

  // --------------------------------------------------------------------------
  // ELEMENTOS DO DOM, PARTÍCULAS E FILA DE ALERTAS
  // --------------------------------------------------------------------------
  const cardEl = document.getElementById("alertCard");
  const particlesEl = document.getElementById("alertParticles");
  const iconEl = document.getElementById("alertIcon");
  const badgeEl = document.getElementById("alertBadge");
  const starsEl = document.getElementById("alertStars");
  const amountEl = document.getElementById("alertAmount");
  const userEl = document.getElementById("alertUser");
  const actionEl = document.getElementById("alertAction");
  const msgWrapEl = document.getElementById("alertMessageWrap");
  const msgEl = document.getElementById("alertMessage");
  const stubEl = document.getElementById("alertStub");
  const stubTopEl = document.getElementById("alertStubTop");
  const stubMainEl = document.getElementById("alertStubMain");
  const timerBarEl = document.getElementById("alertTimerBar");

  const queue = [];
  let isPlaying = false;

  function getDonateTier(amount) {
    const val = Number(amount) || 0;
    const t = ALERT_CONFIG.tiersDonate;
    if (val >= t.cofreMin) return 4;
    if (val >= t.maletaMin) return 3;
    if (val >= t.macoMin) return 2;
    return 1;
  }

  function renderParticles(type, tier = 1) {
    if (!particlesEl) return;
    particlesEl.innerHTML = "";

    // Donate / SuperChat: quantidade de notas e moedas evolui com o tier
    if (type === "tip") {
      const billCounts = { 1: 4, 2: 8, 3: 12, 4: 16 };
      const coinCounts = { 1: 0, 2: 3, 3: 6, 4: 10 };
      const bills = billCounts[tier] || 4;
      const coins = coinCounts[tier] || 0;

      for (let i = 0; i < bills; i++) {
        const bill = document.createElement("span");
        bill.className = "fx-bill";
        bill.style.left = (4 + ((i * 92) / bills)) + "%";
        bill.style.setProperty("--dur", (2.1 + (i % 3) * 0.45) + "s");
        bill.style.setProperty("--delay", ((i * 0.22) % 1.8) + "s");
        bill.innerHTML = BILL_SVG;
        particlesEl.appendChild(bill);
      }

      for (let i = 0; i < coins; i++) {
        const coin = document.createElement("span");
        coin.className = "fx-coin";
        coin.style.left = (8 + ((i * 84) / Math.max(1, coins))) + "%";
        coin.style.setProperty("--dur", (1.9 + (i % 3) * 0.35) + "s");
        coin.style.setProperty("--delay", ((i * 0.27) % 1.5) + "s");
        coin.innerHTML = COIN_SVG;
        particlesEl.appendChild(coin);
      }
      return;
    }

    // Bits / Cheer: fichas de poker subindo
    if (type === "cheer") {
      [8, 22, 38, 54, 70, 84, 93].forEach((left, i) => {
        const chip = document.createElement("span");
        chip.className = "fx-chip";
        chip.style.left = left + "%";
        chip.style.setProperty("--dur", (2.1 + (i % 3) * 0.4) + "s");
        chip.style.setProperty("--delay", (i * 0.25) + "s");
        chip.innerHTML = CHIP_SVG;
        particlesEl.appendChild(chip);
      });
      return;
    }

    // Raid: sem partículas suaves para deixar o foco nas luzes de giroflex e nas 6★
    if (type === "raid") {
      return;
    }

    // Follow, Sub e Gift: brilhos sutis
    const sparkPositions = type === "gift"
      ? [6, 18, 30, 44, 58, 70, 82, 92]
      : [10, 26, 44, 62, 78, 90];

    sparkPositions.forEach((left, i) => {
      const spark = document.createElement("span");
      spark.className = "fx-spark";
      spark.style.left = left + "%";
      spark.style.setProperty("--dur", (2.2 + (i % 3) * 0.45) + "s");
      spark.style.setProperty("--delay", (i * 0.3) + "s");
      spark.innerHTML = SPARK_SVG;
      particlesEl.appendChild(spark);
    });
  }

  function renderStars(count) {
    if (!starsEl) return;
    if (!count || count <= 0) {
      starsEl.innerHTML = "";
      starsEl.classList.add("hidden");
      return;
    }
    starsEl.innerHTML = Array.from({ length: count }, () => STAR_SVG).join("");
    starsEl.classList.remove("hidden");
  }

  function formatMoney(amount, currency) {
    const val = Number(amount);
    if (Number.isNaN(val)) return String(amount || "");
    const symbol = currency || ALERT_CONFIG.moedaPadrao;
    const formatted = val.toFixed(2).replace(".", ",");
    return `${symbol} ${formatted}`;
  }

  function enqueueAlert(payload) {
    if (!payload) return;
    queue.push(payload);
    if (!isPlaying) {
      processNext();
    }
  }

  function processNext() {
    if (queue.length === 0) {
      isPlaying = false;
      return;
    }

    isPlaying = true;
    const item = queue.shift();
    const tier = item.tier || 1;

    cardEl.setAttribute("data-type", item.type);
    cardEl.setAttribute("data-tier", String(tier));
    iconEl.innerHTML = ICONS[item.iconKey || item.type] || ICONS.follow;
    badgeEl.textContent = item.badge;
    userEl.textContent = item.user;
    actionEl.textContent = item.action;
    renderParticles(item.type, tier);
    renderStars(item.stars || 0);

    if (item.amountText) {
      amountEl.textContent = item.amountText;
      amountEl.classList.remove("hidden");
    } else {
      amountEl.textContent = "";
      amountEl.classList.add("hidden");
    }

    if (stubEl && item.stubTop && item.stubMain) {
      stubTopEl.textContent = item.stubTop;
      stubMainEl.textContent = item.stubMain;
      stubEl.classList.remove("hidden");
    } else if (stubEl) {
      stubEl.classList.add("hidden");
    }

    const cleanMsg = (item.message || "").trim();
    if (cleanMsg) {
      msgEl.textContent = cleanMsg;
      msgWrapEl.classList.remove("hidden");
    } else {
      msgEl.textContent = "";
      msgWrapEl.classList.add("hidden");
    }

    timerBarEl.style.transition = "none";
    timerBarEl.style.transform = "scaleX(1)";
    void cardEl.offsetWidth;

    cardEl.classList.remove("is-leaving", "is-visible");
    cardEl.classList.add("is-entering");
    playAlertMusic(item.type, tier);

    requestAnimationFrame(() => {
      timerBarEl.style.transition = `transform ${ALERT_CONFIG.duracaoMs}ms linear`;
      timerBarEl.style.transform = "scaleX(0)";
    });

    setTimeout(() => {
      cardEl.classList.remove("is-entering");
      cardEl.classList.add("is-visible");
    }, 540);

    setTimeout(() => {
      cardEl.classList.remove("is-visible");
      cardEl.classList.add("is-leaving");

      setTimeout(() => {
        cardEl.classList.remove("is-leaving");
        setTimeout(processNext, ALERT_CONFIG.intervaloEntreMs);
      }, 450);
    }, ALERT_CONFIG.duracaoMs);
  }

  // --------------------------------------------------------------------------
  // MAPEAMENTO DOS EVENTOS DO STREAMELEMENTS (TWITCH / YOUTUBE / KICK)
  // --------------------------------------------------------------------------
  function parseStreamElementsEvent(listener, event) {
    if (!event) return null;
    const name = event.name || event.displayName || event.sender || "Anônimo";
    const message = event.message || "";

    // 1. Follow / Inscrição (Check-in Miami + 1★)
    if (listener === "follower-latest" || listener === "follower") {
      return {
        type: "follow",
        badge: "CHECK-IN • SEGUIDOR",
        stars: 1,
        user: name,
        action: "começou a acompanhar a live!",
        amountText: "",
        message: ""
      };
    }

    // 2 e 3. Sub / Membro / Gift Sub
    if (listener === "subscriber-latest" || listener === "subscriber" || listener === "sponsor-latest") {
      if (event.isCommunityGift && !event.bulkGifted) {
        return null;
      }

      if (event.bulkGifted || event.gifted) {
        const gifter = event.sender || name;
        const count = Number(event.amount) || 1;
        return {
          type: "gift",
          badge: "DROP VIP • GIFT",
          stars: 0,
          user: gifter,
          action: count > 1
            ? `presenteou ${count} passes VIP para o chat!`
            : `presenteou um passe VIP para ${name}!`,
          amountText: `${count}× VIP`,
          message
        };
      }

      const months = Number(event.amount) || 1;
      return {
        type: "sub",
        badge: months > 1 ? `RESPECT + • ${months} MESES` : "RESPECT + • VICE CLUB",
        stars: 0,
        user: name,
        action: months > 1
          ? `renovou o passe VIP (${months} meses)!`
          : "entrou para o clube VIP!",
        amountText: "",
        message
      };
    }

    // 4. SuperChat / Donate (Evolui por valor: Notas -> Maço -> Maleta -> Cofre)
    if (listener === "tip-latest" || listener === "tip" || listener === "superchat-latest" || listener === "superchat") {
      const isSuperChat = listener.includes("superchat");
      const tier = getDonateTier(event.amount);
      const tierNames = {
        1: "NOTAS",
        2: "MAÇO DE NOTAS",
        3: "MALETA VIP",
        4: "MEGA COFRE"
      };
      const tierActions = {
        1: isSuperChat ? "mandou um SuperChat!" : "jogou umas notas na mesa!",
        2: "mandou um maço de notas!",
        3: "abriu uma maleta de dinheiro!",
        4: "desbloqueou o mega cofre da live!"
      };

      return {
        type: "tip",
        tier,
        iconKey: `tip${tier}`,
        badge: `${isSuperChat ? "SUPERCHAT" : "DONATE"} • ${tierNames[tier]}`,
        stars: 0,
        user: name,
        action: tierActions[tier],
        amountText: `+ ${formatMoney(event.amount, event.currency)}`,
        message
      };
    }

    // 5. Bits / Super Sticker (Mesa de Poker Vice)
    if (listener === "cheer-latest" || listener === "cheer" || listener === "supersticker-latest") {
      const isSticker = listener.includes("supersticker");
      const qty = Number(event.amount) || 0;
      return {
        type: "cheer",
        badge: isSticker ? "SUPER STICKER" : "POKER • BITS",
        stars: 0,
        user: name,
        action: isSticker ? "enviou um Super Sticker!" : "jogou fichas na mesa!",
        amountText: isSticker
          ? formatMoney(event.amount, event.currency)
          : `${qty.toLocaleString("pt-BR")} BITS`,
        message
      };
    }

    // 6. Raid / Host (Polícia GTA Vice 6★)
    if (listener === "raid-latest" || listener === "raid") {
      const viewers = Number(event.amount) || 1;
      return {
        type: "raid",
        badge: "PROCURADO • RAID",
        stars: 6,
        user: name,
        action: `invadiu a live com ${viewers} viewer${viewers > 1 ? "s" : ""}!`,
        amountText: `${viewers} VIEWERS`,
        message
      };
    }

    return null;
  }

  window.addEventListener("onWidgetLoad", function (obj) {
    const fieldData = obj?.detail?.fieldData || {};
    if (fieldData.duracaoMs) ALERT_CONFIG.duracaoMs = Number(fieldData.duracaoMs);
    if (fieldData.volumeSom !== undefined) ALERT_CONFIG.volumeSom = Number(fieldData.volumeSom);
  });

  window.addEventListener("onEventReceived", function (obj) {
    const detail = obj && obj.detail;
    if (!detail || !detail.listener || !detail.event) return;

    const payload = parseStreamElementsEvent(detail.listener, detail.event);
    if (payload) {
      enqueueAlert(payload);
    }
  });

  // --------------------------------------------------------------------------
  // CONEXÃO DIRETA COM TWITCH IRC (@apenasojorge) — DISPARA SUB, GIFT SUB,
  // BITS E RAID AUTOMATICAMENTE MESMO SEM STREAMELEMENTS!
  // --------------------------------------------------------------------------
  (function connectTwitchLiveAlerts() {
    try {
      const channel = "apenasojorge";
      const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      ws.onopen = function () {
        ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
        ws.send("PASS SCHMOOPIIE");
        ws.send("NICK justinfan" + Math.floor(10000 + Math.random() * 89999));
        ws.send("JOIN #" + channel);
      };
      ws.onmessage = function (e) {
        const lines = String(e.data || "").split("\r\n");
        for (const line of lines) {
          if (!line) continue;
          if (line.startsWith("PING")) {
            ws.send("PONG :tmi.twitch.tv");
            continue;
          }
          // Detecta Bits (cheer) no chat da Twitch
          if (line.includes("PRIVMSG #" + channel) && line.includes("bits=")) {
            const bitsMatch = line.match(/bits=(\d+)/);
            const nameMatch = line.match(/display-name=([^;]+)/);
            const msgPart = line.split("PRIVMSG #" + channel + " :")[1] || "";
            if (bitsMatch) {
              const payload = parseStreamElementsEvent("cheer-latest", {
                name: (nameMatch && nameMatch[1]) || "Viewer",
                amount: Number(bitsMatch[1]),
                message: msgPart
              });
              if (payload) enqueueAlert(payload);
            }
          }
          // Detecta Sub, Resub, SubGift e Raid via USERNOTICE da Twitch
          if (line.includes("USERNOTICE #" + channel)) {
            const msgIdMatch = line.match(/msg-id=([^;]+)/);
            const nameMatch = line.match(/display-name=([^;]+)/);
            const msgId = msgIdMatch ? msgIdMatch[1] : "";
            const user = (nameMatch && nameMatch[1]) || "Viewer";

            if (msgId === "sub" || msgId === "resub") {
              const monthsMatch = line.match(/msg-param-cumulative-months=(\d+)/);
              const payload = parseStreamElementsEvent("subscriber-latest", {
                name: user,
                amount: monthsMatch ? Number(monthsMatch[1]) : 1
              });
              if (payload) enqueueAlert(payload);
            } else if (msgId === "subgift" || msgId === "submysterygift") {
              const countMatch = line.match(/msg-param-mass-gift-count=(\d+)/);
              const payload = parseStreamElementsEvent("subscriber-latest", {
                sender: user,
                name: "Chat",
                amount: countMatch ? Number(countMatch[1]) : 1,
                bulkGifted: true,
                gifted: true
              });
              if (payload) enqueueAlert(payload);
            } else if (msgId === "raid") {
              const viewersMatch = line.match(/msg-param-viewerCount=(\d+)/);
              const payload = parseStreamElementsEvent("raid-latest", {
                name: user,
                amount: viewersMatch ? Number(viewersMatch[1]) : 10
              });
              if (payload) enqueueAlert(payload);
            }
          }
        }
      };
      ws.onclose = function () {
        setTimeout(connectTwitchLiveAlerts, 4000);
      };
    } catch (_) {}
  })();

  // --------------------------------------------------------------------------
  // FUNÇÃO DE TESTE RÁPIDO (CONSOLE OU PREVIEW.HTML)
  // --------------------------------------------------------------------------
  window.simularAlerta = function (tipo = "tip", customAmount) {
    const tipAmount = Number.isFinite(Number(customAmount)) ? Number(customAmount) : 25;
    const mocks = {
      follow: { listener: "follower-latest", event: { name: "LucasM_BR" } },
      sub:    { listener: "subscriber-latest", event: { name: "MariSunset", amount: 3, message: "Tamo junto na live de hoje, qualidade absurda!" } },
      gift:   { listener: "subscriber-latest", event: { sender: "RafaelVIP", name: "Viewer1", amount: 5, bulkGifted: true, gifted: true } },
      tip:    { listener: "tip-latest", event: { name: "GabrielD", amount: tipAmount, currency: "R$", message: "Manda um salve! O visual novo ficou limpo demais." } },
      cheer:  { listener: "cheer-latest", event: { name: "PedroH", amount: 500, message: "Bora pra cima!" } },
      raid:   { listener: "raid-latest", event: { name: "CanalParceiro", amount: 48 } }
    };
    const mock = mocks[tipo] || mocks.tip;
    const payload = parseStreamElementsEvent(mock.listener, mock.event);
    if (payload) enqueueAlert(payload);
  };
})();
