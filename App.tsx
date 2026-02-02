import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Play,
  Info,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

/**
 * =========================================================================
 * 🚩 GUIA: ONDE MUDAR NOME, CAPA E VÍDEOS
 * =========================================================================
 *
 * BANNER DO TOPO (grande imagem e vídeo em destaque):
 *   HERO_CONFIG.coverImage  → URL da IMAGEM DE CAPA do banner
 *   HERO_CONFIG.videoId     → ID do vídeo no YouTube (link watch?v=XXXXX → id = XXXXX)
 *   HERO_CONFIG.title       → Título no banner
 *   HERO_CONFIG.description → Descrição no banner
 *
 * CATEGORIAS (6 filas / carrosséis):
 *   nome   → NOME DA CATEGORIA (legenda da fila). Mude em cada "nome: '...'"
 *   videos → Lista de vídeos da fila. Para COLOCAR MAIS VÍDEOS: copie um bloco
 *            { id, title, thumbnail, description, match, year, duration, rating }
 *            e cole dentro de videos: [ ... ], separado por vírgula.
 *
 * Em CADA vídeo:
 *   id         → ID do vídeo no YouTube (youtube.com/watch?v=ID_AQUI)
 *   thumbnail  → URL da CAPA do vídeo (imagem do cartão)
 *   title      → Nome do vídeo no cartão
 *   description, year, duration, rating, match → textos (qualquer valor)
 */

// ID do Cliente Google para Login (vem do .env.local com prefixo VITE_)
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "544638929164-bnuhjbpi6nf0951o76nbot790lca3avk.apps.googleusercontent.com";

/** Pasta base das imagens (organizadas em public/images/) */
const IMAGES_BASE = "/images";

/** Caminhos das fotos de capa — coloque os arquivos nas pastas indicadas em public/images/ */
const IMAGENS = {
  hero: {
    cover: `${IMAGES_BASE}/hero/cover.jpg`,
    fallback:
      "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=2000",
  },
  login: {
    background: `${IMAGES_BASE}/login/background.jpg`,
    fallback:
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2000",
  },
  /** Thumbnail de cada vídeo = arquivo na pasta da categoria. Chave = nome do arquivo (ex: inicio-03.jpg). */
  categorias: {
    "ÍNICIO": {
      "a-criacao.jpg": "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=800",
      "adao-e-eva.jpg": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800",
      "inicio-03.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-04.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-05.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-06.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-07.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-08.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-09.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-10.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-11.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "inicio-12.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    },
    "em-alta": {
      "a-criacao.jpg": "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=800",
      "adao-e-eva.jpg": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800",
    },
    "series-epicas": {
      "caminhos-de-luz.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-02.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-03.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-04.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-05.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-06.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-07.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-08.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-09.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-10.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
      "series-11.jpg": "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
    },
    documentarios: {
      "exemplo-documentario.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-02.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-03.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-04.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-05.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-06.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-07.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-08.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-09.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-10.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
      "documentario-11.jpg": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
    },
    filmes: {
      "filme-destaque.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-02.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-03.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-04.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-05.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-06.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-07.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-08.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-09.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-10.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
      "filme-11.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    },
    testemunhos: {
      "testemunho-fe.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-02.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-03.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-04.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-05.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-06.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-07.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-08.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-09.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-10.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      "testemunho-11.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    },
    "musica-louvor": {
      "louvor-ao-vivo.jpg":
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
    },
  },
} as const;

/** Retorna URL da thumbnail: pasta da categoria + arquivo. Fallback se a imagem local não carregar. */
function getThumbnailUrl(
  categorySlug: keyof typeof IMAGENS.categorias,
  filename: string
): string {
  return `${IMAGES_BASE}/categorias/${categorySlug}/${filename}`;
}
function getThumbnailFallback(
  categorySlug: keyof typeof IMAGENS.categorias,
  filename: string
): string | undefined {
  const cat = IMAGENS.categorias[categorySlug] as Record<string, string> | undefined;
  return cat?.[filename];
}

/** Retorna o slug da categoria que contém o vídeo com esse id. */
function getCategorySlugForMovie(videoId: string): keyof typeof IMAGENS.categorias {
  const cat = CATEGORIAS.find((c) => c.videos.some((v) => v.id === videoId));
  return cat?.slug ?? "em-alta";
}

/** Imagem e vídeo do banner principal (topo da página) */
const HERO_CONFIG = {
  videoId: "Dp8-wKmx8wY",
  coverImage: IMAGENS.hero.cover,
  coverImageFallback: IMAGENS.hero.fallback,
  title: "A CRIAÇÃO",
  description:
    "Uma experiência cinematográfica sobre os milagres que nos cercam todos os dias. Assista agora ao conteúdo original.",
};

interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  match: number;
  year: string;
  duration: string;
  rating: string;
}

interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
}

/** Cria um vídeo placeholder para você configurar: troque id (YouTube), title, thumbnail (arquivo na pasta da categoria), description, etc. */
function video(
  id: string,
  title: string,
  thumbnail: string,
  description: string,
  extra: { match?: number; year?: string; duration?: string; rating?: string } = {}
): Movie {
  return {
    id,
    title,
    thumbnail,
    description,
    match: extra.match ?? 90,
    year: extra.year ?? "2024",
    duration: extra.duration ?? "—",
    rating: extra.rating ?? "L",
  };
}

// ---------- CATEGORIAS (cada uma = uma fila/carrossel) ----------
// slug = pasta em public/images/categorias/{slug}/ — coloque as fotos de capa com o nome indicado em thumbnail
const CATEGORIAS: { nome: string; slug: keyof typeof IMAGENS.categorias; videos: Movie[] }[] = [
  {
    nome: "ÍNICIO",
    slug: "ÍNICIO",
    videos: [
      video("Dp8-wKmx8wY", "A CRIAÇÃO", "a-criacao.jpg", ),
      video("EBiuebsaU0c", "ADÃO E EVA", "adao-e-eva.jpg",),
      video("MwkakCTN8OA", "A ARCA", "arca.jpg", ),
      video("Meb3uBlf6vE", "TORRE DE BABEL", "torre-de-babel.jpg", ),
      video("jl8xXVGPgTs", "moises", "moises.jpg", ),
      video("7xFfuCWEnFQ", "DAVI E GOLIAS", "davi-egolias.jpg", ),
      video("3QNkkA51WCQ", "sansão", "sansao.jpg", ),
      video("lelL2EFXdiQ", "OS 10 MANDAMENTOS ", "os-10-mandamentos.jpg"),
      video("Gj5_twnAL9c", "JOSÉ DO EGITO ", "jose-do-egito.jpg", ),
      video("COLOQUE_ID_YOUTUBE", "Vídeo 10 — configure", "inicio-10.jpg",),
      video("COLOQUE_ID_YOUTUBE", "Vídeo 11 — configure", "inicio-11.jpg", ),
      video("COLOQUE_ID_YOUTUBE", "Vídeo 12 — configure", "inicio-12.jpg", ),
    ],
  },
  {
    nome: "Séries Épicas",
    slug: "series-epicas",
    videos: [
      video("ScMzIvxBSi4", "Caminhos de Luz", "caminhos-de-luz.jpg", "Relatos reais de superação e encontro com o sagrado.", { match: 92, duration: "1h 10min" }),
      video("COLOQUE_ID_YOUTUBE", "Série 2 — configure", "series-02.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-02.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 3 — configure", "series-03.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-03.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 4 — configure", "series-04.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-04.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 5 — configure", "series-05.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-05.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 6 — configure", "series-06.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-06.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 7 — configure", "series-07.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-07.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 8 — configure", "series-08.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-08.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 9 — configure", "series-09.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-09.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 10 — configure", "series-10.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-10.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Série 11 — configure", "series-11.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/series-epicas/series-11.jpg"),
    ],
  },
  {
    nome: "Documentários",
    slug: "documentarios",
    videos: [
      video("dQw4w9WgXcQ", "Exemplo Documentário", "exemplo-documentario.jpg", "Adicione aqui seus vídeos do YouTube e URLs das imagens de capa.", { match: 88, duration: "50min" }),
      video("COLOQUE_ID_YOUTUBE", "Documentário 2 — configure", "documentario-02.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-02.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 3 — configure", "documentario-03.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-03.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 4 — configure", "documentario-04.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-04.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 5 — configure", "documentario-05.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-05.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 6 — configure", "documentario-06.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-06.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 7 — configure", "documentario-07.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-07.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 8 — configure", "documentario-08.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-08.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 9 — configure", "documentario-09.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-09.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 10 — configure", "documentario-10.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-10.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Documentário 11 — configure", "documentario-11.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/documentarios/documentario-11.jpg"),
    ],
  },
  {
    nome: "Filmes",
    slug: "filmes",
    videos: [
      video("Dp8-wKmx8wY", "Filme em Destaque", "filme-destaque.jpg", "Troque o id e thumbnail pelos seus vídeos e imagens.", { duration: "1h 30min", rating: "12" }),
      video("COLOQUE_ID_YOUTUBE", "Filme 2 — configure", "filme-02.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-02.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 3 — configure", "filme-03.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-03.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 4 — configure", "filme-04.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-04.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 5 — configure", "filme-05.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-05.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 6 — configure", "filme-06.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-06.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 7 — configure", "filme-07.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-07.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 8 — configure", "filme-08.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-08.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 9 — configure", "filme-09.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-09.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 10 — configure", "filme-10.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-10.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Filme 11 — configure", "filme-11.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/filmes/filme-11.jpg"),
    ],
  },
  {
    nome: "Testemunhos",
    slug: "testemunhos",
    videos: [
      video("kJQP7kiw5Fk", "Testemunho de Fé", "testemunho-fe.jpg", "Histórias reais de transformação. Edite id e thumbnail.", { match: 85, duration: "15min" }),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 2 — configure", "testemunho-02.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-02.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 3 — configure", "testemunho-03.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-03.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 4 — configure", "testemunho-04.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-04.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 5 — configure", "testemunho-05.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-05.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 6 — configure", "testemunho-06.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-06.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 7 — configure", "testemunho-07.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-07.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 8 — configure", "testemunho-08.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-08.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 9 — configure", "testemunho-09.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-09.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 10 — configure", "testemunho-10.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-10.jpg"),
      video("COLOQUE_ID_YOUTUBE", "Testemunho 11 — configure", "testemunho-11.jpg", "Configure: id do YouTube, título, descrição e coloque a capa em public/images/categorias/testemunhos/testemunho-11.jpg"),
    ],
  },
  {
    nome: "Música e Louvor",
    slug: "musica-louvor",
    videos: [
      video("ScMzIvxBSi4", "Louvor ao Vivo", "louvor-ao-vivo.jpg", "Adicione seus vídeos de música e louvor. Troque id e thumbnail.", { match: 87, duration: "5min" }),
    ],
  },
];

/**
 * PLAYER DE VÍDEO — só dentro do sistema, sem abrir YouTube.
 * Overlay cobre a logo do YouTube no canto para não aparecer nem ser clicável.
 */
const NetflixPlayer: React.FC<{ videoId: string; onClose: () => void }> = ({
  videoId,
  onClose,
}) => {
  const currentOrigin = window.location.origin;
  // modestbranding=1 reduz branding; rel=0 não sugere outros vídeos; sem link para abrir no YouTube
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&origin=${encodeURIComponent(currentOrigin)}`;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-profile overflow-hidden">
      {/* Botão de fechar */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-[210] bg-gradient-to-b from-black/90 to-transparent">
        <button
          onClick={onClose}
          className="text-white bg-white/10 p-3 md:p-4 rounded-full backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
        >
          <ChevronLeft size={24} />
          <span className="font-bold pr-1 text-sm md:text-base">Voltar</span>
        </button>
        <X
          size={40}
          className="text-white/50 cursor-pointer hover:text-white transition-colors"
          onClick={onClose}
        />
      </div>

      {/* Vídeo só no sistema — bloqueador cobre toda a barra inferior para ninguém clicar e sair para o YouTube */}
      <div className="flex-1 w-full h-full bg-black relative">
        <iframe
          key={videoId}
          className="w-full h-full border-0"
          src={embedUrl}
          title="Player de vídeo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {/* Bloqueador: barra inteira em baixo (logo + "Assistir no YouTube") — ninguém clica e sai para o YouTube */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-black pointer-events-auto z-[205]"
          aria-hidden
        />
      </div>
    </div>
  );
};

type CategorySlug = keyof typeof IMAGENS.categorias;

const MovieRow: React.FC<{
  title: string;
  slug: CategorySlug | ((movie: Movie) => CategorySlug);
  movies: Movie[];
  onPlay: (id: string) => void;
  onInfo: (m: Movie, slug: CategorySlug) => void;
}> = ({ title, slug, movies, onPlay, onInfo }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      rowRef.current.scrollTo({
        left:
          dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth",
      });
    }
  };
  const getSlug = (movie: Movie): CategorySlug => typeof slug === "function" ? slug(movie) : slug;
  return (
    <div className="mb-14 group/row relative px-4 md:px-12">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
        {title} <ChevronRight size={20} />
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-20px] md:left-[-40px] top-0 bottom-4 z-40 bg-black/40 w-10 md:w-16 hidden group-hover/row:flex items-center justify-center hover:bg-black/80 text-white transition-all"
        >
          <ChevronLeft size={32} />
        </button>
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-10 scroll-smooth px-2"
        >
          {movies.map((movie) => {
            const movieSlug = getSlug(movie);
            const thumbUrl = getThumbnailUrl(movieSlug, movie.thumbnail);
            const fallback = getThumbnailFallback(movieSlug, movie.thumbnail);
            return (
            <div
              key={movie.id}
              className="flex-none w-[280px] md:w-[360px] flex flex-col rounded-md overflow-hidden cursor-pointer hover:z-50 transition-all duration-300 group/card"
            >
              <div
                onClick={() => onPlay(movie.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onPlay(movie.id)}
                className="relative aspect-video rounded-t-md overflow-hidden bg-[#2a2a2a] hover:scale-[1.02] transition-transform duration-300 shadow-2xl"
              >
                <img
                  src={thumbUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => { if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover/card:bg-white group-hover/card:scale-110 transition-all duration-300">
                    <Play size={28} className="md:w-8 md:h-8 text-black ml-1" fill="black" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onInfo(movie, movieSlug); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center hover:border-white hover:bg-white/10 text-white transition-colors z-10"
                  aria-label="Mais informações"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <h3 className="text-white text-sm md:text-base font-bold text-center py-3 px-2 bg-[#1a1a1a] rounded-b-md truncate">
                {movie.title}
              </h3>
            </div>
          ); })}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-[-20px] md:right-[-40px] top-0 bottom-4 z-40 bg-black/40 w-10 md:w-16 hidden group-hover/row:flex items-center justify-center hover:bg-black/80 text-white transition-all"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

const InfoModal: React.FC<{
  movie: Movie;
  categorySlug?: keyof typeof IMAGENS.categorias;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (id: string) => void;
}> = ({ movie, categorySlug, isOpen, onClose, onPlay }) => {
  if (!isOpen) return null;
  const thumbUrl = categorySlug ? getThumbnailUrl(categorySlug, movie.thumbnail) : movie.thumbnail;
  const thumbFallback = categorySlug ? getThumbnailFallback(categorySlug, movie.thumbnail) : undefined;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-profile">
      <div className="bg-[#181818] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[160] bg-black/50 p-2 rounded-full hover:bg-black/80 text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div
          onClick={() => onPlay(movie.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onPlay(movie.id)}
          className="relative aspect-video cursor-pointer"
        >
          <img
            src={thumbUrl}
            className="w-full h-full object-cover pointer-events-none"
            alt=""
            onError={(e) => { if (thumbFallback && e.currentTarget.src !== thumbFallback) e.currentTarget.src = thumbFallback; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent pointer-events-none"></div>
          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 pointer-events-none">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 uppercase tracking-tighter text-white drop-shadow-lg">
              {movie.title}
            </h1>
            <span className="inline-flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-md font-black text-base md:text-xl">
              <Play fill="black" /> Assistir Agora
            </span>
          </div>
        </div>
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-4 text-green-500 font-bold text-sm">
            <span>{movie.match}% relevante</span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="border border-gray-600 px-1 text-[10px] text-gray-400">
              {movie.rating}
            </span>
          </div>
          <p className="text-white text-sm md:text-lg font-light leading-relaxed opacity-80">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginScreen: React.FC<{
  onLogin: (response: CredentialResponse) => void;
  onGuestLogin: () => void;
  error?: string;
}> = ({ onLogin, onGuestLogin, error }) => (
  <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <img
        src={IMAGENS.login.background}
        className="w-full h-full object-cover opacity-50 blur-[2px]"
        alt="Background"
        onError={(e) => { if (e.currentTarget.src !== IMAGENS.login.fallback) e.currentTarget.src = IMAGENS.login.fallback; }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
    </div>
    <div className="relative z-10 w-full max-w-[420px] p-8 md:p-12 bg-black/80 rounded-md flex flex-col shadow-2xl border border-white/5 animate-profile backdrop-blur-md">
      <h1 className="text-[#e50914] text-5xl font-black mb-10 text-center tracking-tighter">
        BÍBLIA
      </h1>
      <h2 className="text-white text-2xl font-bold mb-6 text-center uppercase tracking-widest">
        Entrar
      </h2>
      <p className="text-gray-300 mb-8 text-sm text-center leading-relaxed">
        Assista ao melhor conteúdo cristão com qualidade premium.
      </p>
      <div className="w-full flex flex-col items-center gap-4">
        <GoogleLogin
          onSuccess={onLogin}
          onError={() => console.error("Login Error")}
          theme="filled_blue"
          shape="pill"
        />
        <div className="flex items-center w-full gap-4 my-2">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-gray-600 text-[10px] uppercase font-bold">
            Ou
          </span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>
        <button
          onClick={onGuestLogin}
          className="w-full py-3 border border-white/20 rounded-full text-xs font-bold text-white hover:bg-white/5 transition-all uppercase tracking-widest active:scale-95"
        >
          Continuar como Convidado
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);
  const [infoCategorySlug, setInfoCategorySlug] = useState<keyof typeof IMAGENS.categorias | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const savedUser = localStorage.getItem("biblia_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoogleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const decoded: any = jwtDecode(response.credential);
        const newUser = {
          name: decoded.name,
          email: decoded.email,
          photoURL: decoded.picture,
        };
        setUser(newUser);
        localStorage.setItem("biblia_user", JSON.stringify(newUser));
      } catch (err) {
        console.error("Erro ao decodificar token", err);
      }
    }
  };

  const handleGuestLogin = () =>
    setUser({
      name: "Convidado",
      email: "guest@stream.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faith",
    });

  const todosOsFilmes = useMemo(() => CATEGORIAS.flatMap((c) => c.videos), []);
  const heroCategorySlug = useMemo(() => {
    const cat = CATEGORIAS.find((c) => c.videos.some((v) => v.id === HERO_CONFIG.videoId));
    return cat?.slug;
  }, []);

  const heroMovie = useMemo((): Movie => {
    const cat = CATEGORIAS.find((c) => c.videos.some((v) => v.id === HERO_CONFIG.videoId));
    const found = cat?.videos.find((m) => m.id === HERO_CONFIG.videoId);
    return (
      found ?? {
        id: HERO_CONFIG.videoId,
        title: HERO_CONFIG.title,
        thumbnail: IMAGENS.hero.cover,
        description: HERO_CONFIG.description,
        match: 99,
        year: "",
        duration: "",
        rating: "L",
      }
    );
  }, [todosOsFilmes]);
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return todosOsFilmes;
    return todosOsFilmes.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, todosOsFilmes]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!user ? (
        <LoginScreen
          onLogin={handleGoogleSuccess}
          onGuestLogin={handleGuestLogin}
        />
      ) : (
        <div className="min-h-screen bg-[#141414] text-white selection:bg-[#e50914] selection:text-white">
          {activeVideoId && (
            <NetflixPlayer
              videoId={activeVideoId}
              onClose={() => setActiveVideoId(null)}
            />
          )}
          {infoMovie && (
            <InfoModal
              movie={infoMovie}
              categorySlug={infoCategorySlug}
              isOpen={!!infoMovie}
              onClose={() => { setInfoMovie(null); setInfoCategorySlug(undefined); }}
              onPlay={setActiveVideoId}
            />
          )}

          <header
            className={`fixed top-0 w-full z-[100] transition-all px-6 md:px-12 py-4 flex items-center gap-6 md:gap-10 ${isScrolled ? "bg-[#141414] shadow-2xl" : "bg-gradient-to-b from-black/70 to-transparent"}`}
          >
            <h1
              className="text-[#e50914] text-2xl md:text-3xl font-black uppercase tracking-tighter cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              BÍBLIA
            </h1>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <span className="text-white font-bold cursor-pointer border-b-2 border-[#e50914] pb-1">
                Início
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Filmes
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Séries
              </span>
            </nav>
            <div className="ml-auto flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-white/30 transition-all">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none focus:ring-0 text-xs ml-2 w-24 md:w-40 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={user.photoURL}
                  className="w-7 h-7 md:w-8 md:h-8 rounded border border-white/10"
                  alt="Profile"
                />
                <button
                  onClick={() => {
                    googleLogout();
                    setUser(null);
                    localStorage.removeItem("biblia_user");
                  }}
                  className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          {!searchQuery && (
            <section
              onClick={() => setActiveVideoId(HERO_CONFIG.videoId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveVideoId(HERO_CONFIG.videoId)}
              className="relative h-[85vh] md:h-[100vh] w-full flex items-center px-6 md:px-12 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 z-0 bg-black">
                <img
                  src={HERO_CONFIG.coverImage}
                  className="w-full h-full object-cover opacity-50 animate-pulse-slow pointer-events-none"
                  alt="Hero"
                  onError={(e) => { if (e.currentTarget.src !== HERO_CONFIG.coverImageFallback) e.currentTarget.src = HERO_CONFIG.coverImageFallback; }}
                />
                <div className="absolute inset-0 hero-gradient"></div>
              </div>
              <div className="relative z-10 max-w-4xl pt-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-[#e50914] rounded-sm flex items-center justify-center font-black text-[9px]">
                    B
                  </div>
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                    ORIGINAL BÍBLIA STREAM
                  </span>
                </div>
                <h1 className="text-4xl md:text-[8rem] font-black leading-none mb-6 drop-shadow-2xl uppercase tracking-tighter">
                  {HERO_CONFIG.title}
                </h1>
                <p className="text-base md:text-xl mb-10 opacity-90 font-light leading-relaxed max-w-2xl text-gray-200 drop-shadow-md">
                  {HERO_CONFIG.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoId(HERO_CONFIG.videoId);
                    }}
                    className="bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded font-black flex items-center gap-3 text-base md:text-xl shadow-2xl transition-all hover:bg-opacity-90 active:scale-95"
                  >
                    <Play fill="black" size={24} /> Assistir
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoMovie(heroMovie);
                    }}
                    className="bg-gray-500/40 text-white px-6 md:px-10 py-3 md:py-4 rounded font-black flex items-center gap-3 text-base md:text-xl backdrop-blur-xl border border-white/20 hover:bg-gray-500/60 transition-all"
                  >
                    <Info size={24} /> Mais Info
                  </button>
                </div>
              </div>
            </section>
          )}

          <div
            className={`${!searchQuery ? "-mt-24 md:-mt-48" : "mt-28"} relative z-30 pb-32 flex flex-col gap-8 md:gap-12`}
          >
            {!searchQuery ? (
              CATEGORIAS.slice(0, 6).map((cat) => (
                <MovieRow
                  key={cat.nome}
                  title={cat.nome}
                  slug={cat.slug}
                  movies={cat.videos}
                  onPlay={setActiveVideoId}
                  onInfo={(movie, slug) => { setInfoMovie(movie); setInfoCategorySlug(slug); }}
                />
              ))
            ) : (
              <MovieRow
                title="Resultados da busca"
                slug={(movie) => getCategorySlugForMovie(movie.id)}
                movies={filteredMovies}
                onPlay={setActiveVideoId}
                onInfo={(movie, slug) => { setInfoMovie(movie); setInfoCategorySlug(slug); }}
              />
            )}
          </div>

          <footer className="py-16 px-6 text-center text-gray-500 text-[10px] md:text-xs border-t border-white/5 bg-[#141414]">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              <p className="leading-relaxed opacity-60">
                © 2024 Bíblia Stream. Todos os direitos reservados. Este site
                utiliza a API do YouTube para incorporação de vídeos cristãos e
                inspiradores.
              </p>
              <div className="flex justify-center gap-6 md:gap-10 opacity-40 text-[9px] md:text-[11px] font-bold uppercase tracking-widest">
                <span className="hover:text-white cursor-pointer transition-colors">
                  Privacidade
                </span>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Termos de Uso
                </span>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Contato
                </span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
