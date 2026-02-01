# Onde mudar nome, capa e vídeos

Tudo fica no arquivo **`App.tsx`**. Abra o arquivo e use este guia para encontrar cada coisa.

---

## 1. Banner do topo (imagem grande + vídeo em destaque)

Procure por **`HERO_CONFIG`** no `App.tsx`. Você verá algo assim:

| Linha / campo      | O que é                         | O que colocar |
|--------------------|----------------------------------|---------------|
| **coverImage**     | Imagem de capa do banner        | URL da sua imagem (link direto que termina em .jpg, .png etc.) |
| **videoId**        | Vídeo do YouTube em destaque    | ID do vídeo. No link `youtube.com/watch?v=ABC123` o ID é **ABC123** |
| **title**          | Título que aparece no banner    | Qualquer texto |
| **description**    | Descrição que aparece no banner| Qualquer texto |

---

## 2. Nome de cada categoria (legenda de cada fila)

Procure por **`CATEGORIAS`** no `App.tsx`. São **6 blocos**, um para cada fila/carrossel.

Em cada bloco, a **primeira linha** é o nome da categoria:

```ts
nome: "Em Alta",        // ← mude aqui o nome da 1ª categoria
nome: "Séries Épicas", // ← mude aqui o nome da 2ª categoria
nome: "Documentários",  // ← mude aqui o nome da 3ª categoria
nome: "Filmes",        // ← 4ª
nome: "Testemunhos",   // ← 5ª
nome: "Música e Louvor", // ← 6ª
```

**Onde mudar:** troque só o texto entre aspas. Exemplo: `nome: "Minha Categoria"`.

---

## 3. Capa de cada vídeo (imagem do cartão)

Dentro de cada categoria há uma lista **`videos: [ ... ]`**. Cada vídeo é um objeto com vários campos.

A **capa** do vídeo (imagem que aparece no cartão) é o campo **`thumbnail`**:

```ts
thumbnail: "https://...."  // ← URL da imagem de capa deste vídeo
```

**Onde mudar:** coloque a URL da sua imagem (link direto para a imagem). Pode ser screenshot do YouTube, imagem do Imgur, Google Drive público, etc.

---

## 4. Colocar mais vídeos (em qualquer categoria)

Cada vídeo é um **bloco** assim (dentro de `videos: [ ... ]`):

```ts
{
  id: "ID_DO_YOUTUBE",           // ID do vídeo (link watch?v=XXXXX → XXXXX)
  title: "Nome do vídeo",
  thumbnail: "https://url-da-capa.jpg",  // Capa do vídeo
  description: "Descrição...",
  match: 99,
  year: "2024",
  duration: "10min",
  rating: "L",
},
```

**Para adicionar mais vídeos:**

1. Copie um bloco inteiro como o de cima (do `{` até o `},`).
2. Cole **dentro** do `videos: [ ... ]` da categoria que quiser, separado por vírgula dos outros.
3. Troque **id** (YouTube) e **thumbnail** (capa) pelo seu vídeo e sua imagem.

Exemplo: na categoria "Em Alta", se já existem 2 vídeos e você quer o 3º, cole o novo bloco depois do segundo, com vírgula:

```ts
videos: [
  { id: "...", title: "...", thumbnail: "...", ... },  // vídeo 1
  { id: "...", title: "...", thumbnail: "...", ... },  // vídeo 2
  { id: "SEU_ID", title: "Seu vídeo", thumbnail: "SUA_CAPA", ... },  // vídeo novo
],
```

---

## Resumo rápido

| O que você quer mudar      | Onde no App.tsx                         |
|---------------------------|-----------------------------------------|
| Capa do banner do topo    | `HERO_CONFIG.coverImage`                |
| Vídeo em destaque no topo | `HERO_CONFIG.videoId`                   |
| Nome de uma categoria     | `nome: "..."` dentro de cada bloco de `CATEGORIAS` |
| Capa de um vídeo          | `thumbnail: "..."` dentro do vídeo     |
| Colocar mais vídeos       | Copiar um bloco `{ id, title, thumbnail, ... }` e colar em `videos: [ ... ]` |

---

**ID do YouTube:** no link `https://www.youtube.com/watch?v=Dp8-wKmx8wY` o ID é **Dp8-wKmx8wY** (a parte depois de `v=`)...
