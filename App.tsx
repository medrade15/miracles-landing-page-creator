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
  "299107028485-rt15gad0gbrvo56pb98dosne69jffb4h.apps.googleusercontent.com";

/** Imagem e vídeo do banner principal (topo da página) */
const HERO_CONFIG = {
  videoId: "Dp8-wKmx8wY",
  coverImage:
    "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=2000",
  title: "O MILAGRE DA VIDA",
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

// ---------- 6 CATEGORIAS (cada uma = uma fila/carrossel) ----------
// NOME DA CATEGORIA: mude a string em "nome". MAIS VÍDEOS: copie um bloco { id, title, thumbnail, ... } e cole em videos: [ ... ]
const CATEGORIAS: { nome: string; videos: Movie[] }[] = [
  {
    nome: "Em Alta",  // ← NOME DA CATEGORIA (legenda da fila)
    videos: [
      // Cada objeto abaixo = 1 vídeo. Para adicionar mais: copie o bloco inteiro { id, title, thumbnail, ... } e cole aqui (com vírgula).
      {
        id: "Dp8-wKmx8wY",  // ← ID do vídeo no YouTube (do link watch?v=XXXXX)
        title: "A CRIAÇÃO",
        thumbnail: "https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=800",  // ← CAPA do vídeo (URL da imagem)
        description:
          "Uma experiência cinematográfica sobre os milagres que nos cercam todos os dias.",
        match: 99,
        year: "2024",
        duration: "1h 45min",
        rating: "L",
      },
      {
        id: "EBiuebsaU0c",  // ID YouTube
        title: "ADÃO E EVA",
        thumbnail: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800",  // CAPA
        description:
          "Descubra como a fé move montanhas e transforma realidades impossíveis.",
        match: 95,
        year: "2023",
        duration: "10 Episódios",
        rating: "12",
      },
    ],
  },
  {
    nome: "Séries Épicas",  // ← NOME DA CATEGORIA
    videos: [
      {
        id: "ScMzIvxBSi4",
        title: "Caminhos de Luz",
        thumbnail:
          "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=800",
        description: "Relatos reais de superação e encontro com o sagrado.",
        match: 92,
        year: "2024",
        duration: "1h 10min",
        rating: "L",
      },
    ],
  },
  {
    nome: "Documentários",  // ← NOME DA CATEGORIA
    videos: [
      {
        id: "dQw4w9WgXcQ",
        title: "Exemplo Documentário",
        thumbnail:
          "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
        description:
          "Adicione aqui seus vídeos do YouTube e URLs das imagens de capa.",
        match: 88,
        year: "2024",
        duration: "50min",
        rating: "L",
      },
    ],
  },
  {
    nome: "Filmes",  // ← NOME DA CATEGORIA
    videos: [
      {
        id: "Dp8-wKmx8wY",
        title: "Filme em Destaque",
        thumbnail:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
        description: "Troque o id e thumbnail pelos seus vídeos e imagens.",
        match: 90,
        year: "2024",
        duration: "1h 30min",
        rating: "12",
      },
    ],
  },
  {
    nome: "Testemunhos",
    videos: [
      {
        id: "kJQP7kiw5Fk",
        title: "Testemunho de Fé",
        thumbnail:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
        description: "Histórias reais de transformação. Edite id e thumbnail.",
        match: 85,
        year: "2024",
        duration: "15min",
        rating: "L",
      },
    ],
  },
  {
    nome: "Música e Louvor",  // ← NOME DA CATEGORIA
    videos: [
      {
        id: "ScMzIvxBSi4",
        title: "Louvor ao Vivo",
        thumbnail:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
        description:
          "Adicione seus vídeos de música e louvor. Troque id e thumbnail.",
        match: 87,
        year: "2024",
        duration: "5min",
        rating: "L",
      },
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

const MovieRow: React.FC<{
  title: string;
  movies: Movie[];
  onPlay: (id: string) => void;
  onInfo: (m: Movie) => void;
}> = ({ title, movies, onPlay, onInfo }) => {
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
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onPlay(movie.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPlay(movie.id)}
              className="flex-none w-[280px] md:w-[360px] aspect-video rounded-md overflow-hidden cursor-pointer hover:scale-110 md:hover:scale-125 hover:z-50 transition-all duration-500 delay-75 relative group/card shadow-2xl bg-[#2a2a2a]"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-4 md:p-5 pointer-events-none">
                <div className="flex gap-2 mb-4 pointer-events-auto">
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:bg-white/90 shadow-lg"
                    aria-hidden
                  >
                    <Play size={18} fill="black" />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onInfo(movie);
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/50 flex items-center justify-center ml-auto hover:border-white text-white"
                  >
                    <ChevronDown size={18} />
                  </div>
                </div>
                <h3 className="text-white text-xs md:text-sm font-black truncate pointer-events-none">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
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
  isOpen: boolean;
  onClose: () => void;
  onPlay: (id: string) => void;
}> = ({ movie, isOpen, onClose, onPlay }) => {
  if (!isOpen) return null;
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
          <img src={movie.thumbnail} className="w-full h-full object-cover pointer-events-none" alt="" />
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
        src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2000"
        className="w-full h-full object-cover opacity-50 blur-[2px]"
        alt="Background"
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
  const heroMovie = useMemo((): Movie => {
    const found = todosOsFilmes.find((m) => m.id === HERO_CONFIG.videoId);
    return (
      found ?? {
        id: HERO_CONFIG.videoId,
        title: HERO_CONFIG.title,
        thumbnail: HERO_CONFIG.coverImage,
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
              isOpen={!!infoMovie}
              onClose={() => setInfoMovie(null)}
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
                  movies={cat.videos}
                  onPlay={setActiveVideoId}
                  onInfo={setInfoMovie}
                />
              ))
            ) : (
              <MovieRow
                title="Resultados da busca"
                movies={filteredMovies}
                onPlay={setActiveVideoId}
                onInfo={setInfoMovie}
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
