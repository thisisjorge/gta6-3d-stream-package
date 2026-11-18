# GTA 6 Pacote Stream 3D Completo (`@apenasojorge`) — Guia Passo a Passo para Twitch & OBS Studio

Bem-vindo ao mundo das lives, Jorge! Como você está começando agora na Twitch (`twitch.tv/apenasojorge`), preparei tudo pensado tanto para o seu **momento atual (Iniciante / Rumo a Afiliado)** quanto para quando você **liberar o botão de Sub (Afiliado/Parceiro)** — sem você precisar refazer nada depois!

---

## 1. Como funciona na Twitch para quem está começando?

- **Agora no começo (Antes de bater Afiliado):**
  - Todo mundo já pode te dar **Follow (Seguir)**, mandar **Raid** (quando outro streamer joga o público dele pra sua live no fim da transmissão) e mandar **Doação via PIX** (usando sites gratuitos como *LivePix* ou *StreamElements*).
  - Por isso, criei a **Facecam com `META SEGUIDORES` (`50/100`)** + o ícone 3D de Seguidor! Na Twitch, você precisa de **50 seguidores** para virar Afiliado e liberar Subs e Bits.
- **Assim que você bater 50 seguidores (Afiliado Twitch):**
  - Você já tem pronta a **Facecam com `META SUBS`** + todos os alertas 3D de **Novo Inscrito (Sub)**, **Presente de Sub (Sub Gift)** e **Bits**!

---

## 2. Como Colocar as Cenas no OBS Studio (Passo a Passo Fácil)

1. Abra o **OBS Studio**.
2. No painel **Cenas** (canto inferior esquerdo), crie suas cenas:
   - `1. Começando`
   - `2. Gameplay GTA 6`
   - `3. Intervalo / Trocando Ideia`
   - `4. Já Volto (BRB)`
   - `5. Encerrando`
3. Em cada cena, clique no botão **`+`** dentro de **Fontes (Sources)** → escolha **Navegador (Browser Source)**.
4. Configure o tamanho sempre para:
   - **Largura (Width):** `1920`
   - **Altura (Height):** `1080`
   - **FPS:** `60`
5. Você pode abrir o arquivo [`index.html`](file:///d:/organizador%20financeiro/gta6-3d-stream-package/index.html) no seu navegador para testar qualquer alerta ao vivo com 1 clique e clicar em **"📋 Copiar Link pro OBS"**, ou usar os caminhos abaixo:

---

## 3. Lista Completa das Cenas & Todos os 6 Alertas 3D (`@apenasojorge`)

### A. Telas de Abertura, Pausa, Conversa e Encerramento
- **Começando (5 Minutos):** `scenes/01-starting-soon.html?minutes=5&lang=pt`
- **Começando (10 Minutos):** `scenes/01-starting-soon.html?minutes=10&lang=pt`
- **Já Volto / BRB (8 Minutos):** `scenes/02-be-right-back.html?minutes=8&lang=pt`
- **Encerrando a Live (10 Minutos):** `scenes/03-ending-soon.html?minutes=10&lang=pt`
- **Intervalo Ao Vivo (Gameplay + Cam + Chat):**
  - Com fundo e estrela 3D: `scenes/04-intermission.html?lang=pt`
  - Com janelas vazadas para encaixar sua câmera e jogo no OBS: `scenes/04-intermission.html?lang=pt&star=0&transparent=1`
- **Missão Concluída (Tela Cheia 3D Transparente):** `scenes/05-mission-completed.html?lang=pt`

### B. Facecam 3D + Metas (Seguidores & Subs)
*(Adicione `&transparent=1` no OBS para deixar o fundo da moldura transparente sobre a sua webcam)*
- **Facecam com META DE SEGUIDORES (Ideal para começar agora!):**
  `scenes/06-facecam-alerts-widget.html?mode=followgoal&goal=follows&subs=50/100&transparent=1&lang=pt`
  *(Para mudar o número da meta, basta trocar `subs=15/50` ou `subs=50/100` na URL!)*
- **Facecam com META DE SUBS (Para quando liberar Sub):**
  `scenes/06-facecam-alerts-widget.html?mode=subgoal&goal=subs&subs=50/100&transparent=1&lang=pt`

### C. Todos os 6 Alertas 3D com a Moeda `"J"` em Chamas (`@apenasojorge`)
Todos os 6 alertas destacam automaticamente o ícone 3D correspondente no topo e no rodapé da Facecam:
1. **👤 Alerta de Novo Seguidor (Follow):**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=follow&icons=1&lang=pt`
2. **⭐ Alerta de Novo Inscrito (Sub):**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=sub&icons=1&lang=pt`
3. **🎁 Alerta de Presente de Sub (Sub Gift):**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=subgift&icons=1&lang=pt`
4. **💲 Alerta de Doação PIX / Donate:**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=donate&icons=1&lang=pt`
5. **⚡ Alerta de Raid:**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=raid&icons=1&lang=pt`
6. **💎 Alerta de Bits / Cheers:**
   `scenes/06-facecam-alerts-widget.html?mode=alert&alertType=bits&icons=1&lang=pt`

---

## 4. Vídeos `.webm` Pré-Renderizados (1080p VP9 com Transparência Alpha)

Se preferir importar qualquer cena ou alerta como vídeo `.webm` (**Fonte de Mídia / Media Source** no OBS ou para subir como vídeo de alerta no **StreamElements / Streamlabs / LivePix**), todos os 16 vídeos já estão renderizados em `renders/webm/`:
- `01-starting-soon-5min.webm`
- `01b-starting-soon-10min.webm`
- `02-be-right-back.webm`
- `03-ending-soon.webm`
- `04-intermission.webm`
- `05-mission-completed.webm` *(Alpha Transparente)*
- `06a-facecam-subgoal.webm` *(Meta de Subs — Alpha Transparente)*
- `06a2-facecam-followgoal.webm` *(Meta de Seguidores — Alpha Transparente)*
- `06b-facecam-alert-donation.webm` *(Alerta Doação PIX R$ 100 — Alpha Transparente)*
- `06c-facecam-alert-follow.webm` *(Alerta Novo Seguidor `@apenasojorge` — Alpha Transparente)*
- `06d-facecam-alert-sub.webm` *(Alerta Novo Sub — Alpha Transparente)*
- `06e-facecam-alert-subgift.webm` *(Alerta Presente de Sub / Sub Gift — Alpha Transparente)*
- `06f-facecam-alert-raid.webm` *(Alerta de Raid — Alpha Transparente)*
- `06g-facecam-alert-bits.webm` *(Alerta de Bits — Alpha Transparente)*
- `07-chat-widget.webm` *(Chat Widget `@apenasojorge` — Alpha Transparente)*
- `08-gameplay-live-hud.webm` *(HUD Completa de Gameplay — Alpha Transparente)*
