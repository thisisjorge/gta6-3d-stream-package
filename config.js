/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DO PACOTE DE OVERLAYS 3D — MIAMI SUNSET / GTA VI EDITION
 *  Personalizado para: @apenasojorge (Twitch, YouTube & Kick)
 *  Todas as cenas e alertas 3D leem este arquivo automaticamente.
 * ============================================================================
 */

window.STREAM_CONFIG = {
  // 1. IDENTIDADE PRINCIPAL (@apenasojorge)
  nomeExibicao: "apenasojorge",
  arroba: "@apenasojorge",
  iniciaisEmblema: "J", // Emblema 3D e crachá da cena Só Chat / Transição Stinger
  tagLive: "AO VIVO",

  // 2. CONTROLE GLOBAL DA WEBCAM E EFEITOS 3D
  mostrarWebcam: true,
  ativarEfeitos3D: true, // Ativa algemas 3D, Glock 3D, maços de dólar $100 3D e estrelas 3D

  // Estilo da Moldura da Webcam no overlay-gameplay.html:
  // "cam3" (Padrão: Moldura Jacaré de Óculos com Drink + Sol de Óculos!)
  // "cam2" (Moldura GTA VI Logo + Palmeiras Neon)
  // "cam1" (Moldura Vice City Neon Script + Palmeiras)
  // "cam4" (Moldura Vice City Leonida)
  // "sunset" (Moldura minimalista Sunset Dourada)
  // Dica: também pode trocar via URL no OBS: overlay-gameplay.html?frame=cam2
  webcamFrameStyle: "cam3",

  // Barra de Meta opcional abaixo da barra @apenasojorge (ideal para iniciante na Twitch!)
  // tipoMeta: "seguidores" | "subs" | "off"
  metaAtiva: true,
  tipoMeta: "seguidores",
  metaAtual: 15,
  metaTotal: 50,

  // Posição da moldura 16:9 (424x242) no overlay-gameplay.html:
  // "middle-left" (padrão — acima do minimapa do GTA, sem tampar HUD inferior/superior)
  // "top-left" | "bottom-left" | "top-right" | "middle-right" | "bottom-right"
  webcamPosicao: "middle-left",

  // true = exibe medidas-guia dentro das áreas de webcam/chat para alinhar no OBS
  mostrarGuiasOBS: false,

  // 3. TEXTOS DINÂMICOS POR CENA (PT-BR)
  textoStatus: "",

  // Cena Início (cena-inicio.html)
  tituloInicio: "A LIVE JÁ VAI COMEÇAR",
  subtituloInicio: "Prepare-se para Vice City • Em instantes no ar",
  tempoInicialMinutos: 5, // Aceita override na URL do OBS: cena-inicio.html?t=10
  textoTimerZerado: "COMEÇANDO AGORA",

  // Cena Só Chat (cena-chat.html)
  tituloChat: "SÓ CHAT",
  subtituloChat: "Trocando ideia com o chat",

  // Cena Pausa (cena-pausa.html)
  tituloPausa: "PAUSA",
  subtituloPausa: "JÁ VOLTO",
  textoPausa: "Segura as 6 estrelas aí! Voltamos em instantes.",

  // Cena Fim (cena-fim.html)
  tituloFim: "MISSÃO CONCLUÍDA",
  textoAgradecimento: "Obrigado por acompanhar a live de hoje com o @apenasojorge!",
  proximaLive: "Siga na Twitch, YouTube e Kick para não perder as próximas lives",

  // 4. TRANSMISSÃO SIMULTÂNEA (MULTISTREAM: YOUTUBE, TWITCH & KICK)
  plataformas: {
    twitch:  { ativo: true, nome: "Twitch",  handle: "/apenasojorge" },
    youtube: { ativo: true, nome: "YouTube", handle: "@apenasojorge" },
    kick:    { ativo: true, nome: "Kick",    handle: "/apenasojorge" }
  },

  // 5. REDES SOCIAIS COMPLEMENTARES (Preencha se quiser exibir na barra inferior)
  redesSociais: {
    instagram: "",
    twitter:   "",
    tiktok:    "@livesjorge",
    discord:   ""
  },

  // 6. CANAL DA TWITCH PARA SINCRONIZAR CHAT & EVENTOS EM TEMPO REAL + WIDGET LIVEPIX
  twitchChannel: "apenasojorge",
  livepixWidgetUrl: "https://widget.livepix.gg/embed/bba99ac8-999e-4bf3-898f-17815c347686"
};


/* ============================================================================
 *  ÍCONES SVG E UTILITÁRIOS COMPARTILHADOS ENTRE TODAS AS CENAS
 * ============================================================================ */

window.STREAM_ICONS = {
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  twitch: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.265 3 3 6.236v13.223h4.502V21l2.531 1.541h2.532l2.11-1.541h3.375L21 18.082V3H4.265zm15.048 14.238-2.813 2.813h-4.502l-2.39 2.39v-2.39H5.813V4.688h13.5v12.55zM16.5 8.063h-1.688v4.78H16.5v-4.78zm-4.5 0h-1.688v4.78H12v-4.78z"/></svg>`,
  kick: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 2h6.2v6.6h2.2V6.4h2.2V4.2h2.2V2H21v6.2h-2.2v2.2h-2.2v3.2h2.2v2.2H21V22h-5.2v-2.2h-2.2v-2.2h-2.2v-2.2H9.2V22H3V2z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .593.047.875.14V9.4a6.33 6.33 0 0 0-.875-.06A6.34 6.34 0 0 0 3.13 15.7a6.34 6.34 0 0 0 10.86 4.43A6.28 6.28 0 0 0 15.82 15.7V8.77a8.18 8.18 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1-.15z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`
};

window.STREAM_HELPERS = {
  escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  renderPlatforms(container, mode = "pills") {
    if (!container) return;
    const cfg = window.STREAM_CONFIG.plataformas || {};
    const order = ["youtube", "twitch", "kick"];
    const items = order
      .filter((key) => cfg[key] && cfg[key].ativo)
      .map((key) => ({ key, ...cfg[key] }));

    if (mode === "icons") {
      container.innerHTML = items
        .map(
          (p) => `
          <span class="platform-icon platform-${p.key}" title="${this.escapeHtml(p.nome)}">
            ${window.STREAM_ICONS[p.key]}
          </span>`
        )
        .join("");
      return;
    }

    if (mode === "cards") {
      container.innerHTML = items
        .map(
          (p) => `
          <div class="social-card platform-card platform-${p.key}">
            <div class="social-card-icon">${window.STREAM_ICONS[p.key]}</div>
            <div class="social-card-meta">
              <span class="social-card-label">${this.escapeHtml(p.nome)}</span>
              <span class="social-card-handle">${this.escapeHtml(p.handle)}</span>
            </div>
          </div>`
        )
        .join("");
      return;
    }

    container.innerHTML = items
      .map(
        (p) => `
        <div class="platform-pill platform-${p.key}">
          <span class="platform-pill-icon">${window.STREAM_ICONS[p.key]}</span>
          <span class="platform-pill-handle">${this.escapeHtml(p.handle)}</span>
        </div>`
      )
      .join("");
  },

  renderSocials(container, mode = "pills") {
    if (!container) return;
    const socials = window.STREAM_CONFIG.redesSociais || {};
    const meta = {
      instagram: "Instagram",
      twitter: "X / Twitter",
      tiktok: "TikTok",
      discord: "Discord"
    };

    const active = Object.keys(meta)
      .filter((key) => socials[key] && String(socials[key]).trim() !== "")
      .map((key) => ({ key, nome: meta[key], handle: String(socials[key]).trim() }));

    if (active.length === 0) {
      container.style.display = "none";
      return;
    }

    if (mode === "cards") {
      container.innerHTML = active
        .map(
          (s) => `
          <div class="social-card social-${s.key}">
            <div class="social-card-icon">${window.STREAM_ICONS[s.key]}</div>
            <div class="social-card-meta">
              <span class="social-card-label">${this.escapeHtml(s.nome)}</span>
              <span class="social-card-handle">${this.escapeHtml(s.handle)}</span>
            </div>
          </div>`
        )
        .join("");
      return;
    }

    container.innerHTML = active
      .map(
        (s) => `
        <div class="social-pill social-${s.key}">
          <span class="social-pill-icon">${window.STREAM_ICONS[s.key]}</span>
          <span class="social-pill-handle">${this.escapeHtml(s.handle)}</span>
        </div>`
      )
      .join("");
  },

  bindTextFields() {
    const cfg = window.STREAM_CONFIG;
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.getAttribute("data-config");
      if (key && cfg[key] !== undefined) {
        const val = String(cfg[key]).trim();
        el.textContent = val;
        if (val === "") {
          el.classList.add("hidden");
        } else {
          el.classList.remove("hidden");
        }
      }
    });
  },

  getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
};
