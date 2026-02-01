<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1eGDDHQwSGKULoGpJkQbAAUMRiwS2MIGr

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`

---

## Como personalizar vídeos e imagens

Tudo é configurado no arquivo **`App.tsx`**, no topo do arquivo.

### 1. Banner do topo (capa + vídeo em destaque)

- **`HERO_CONFIG.coverImage`** — URL da imagem de capa do banner (pode ser link do Imgur, Google Drive público, etc.).
- **`HERO_CONFIG.videoId`** — ID do vídeo no YouTube. No link `https://www.youtube.com/watch?v=XXXXX`, o ID é `XXXXX`.
- **`HERO_CONFIG.title`** e **`HERO_CONFIG.description`** — Título e descrição que aparecem no banner.

### 2. Categorias e carrosséis (máximo 6)

Cada **categoria** vira um **carrossel** com uma legenda diferente (ex: "Em Alta", "Documentários").

- **`CATEGORIAS`** — Array de categorias. Cada item tem:
  - **`nome`** — Legenda do carrossel (ex: "Em Alta", "Séries").
  - **`videos`** — Lista de vídeos dessa categoria. Cada vídeo tem:
    - **`id`** — ID do vídeo no YouTube.
    - **`thumbnail`** — URL da imagem de capa do cartão (sua imagem ou screenshot).
    - **`title`**, **`description`**, **`year`**, **`duration`**, **`rating`**, **`match`** — Textos exibidos nos cartões e no modal.

Para adicionar mais categorias, copie um bloco no mesmo formato e cole dentro de `CATEGORIAS` (até 6 no total).
