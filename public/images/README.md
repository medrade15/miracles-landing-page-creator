# Pastas de imagens

Coloque aqui todas as fotos de capa do site. Cada pasta corresponde a um uso no app.

## Estrutura

```
images/
├── hero/                    → Capa do banner principal (topo da página)
│   └── cover.jpg
├── login/                   → Fundo da tela de login
│   └── background.jpg
└── categorias/              → Uma pasta por categoria (cada vídeo = uma foto de capa)
    ├── em-alta/
    │   ├── a-criacao.jpg
    │   └── adao-e-eva.jpg
    ├── series-epicas/
    │   └── caminhos-de-luz.jpg
    ├── documentarios/
    │   └── exemplo-documentario.jpg
    ├── filmes/
    │   └── filme-destaque.jpg
    ├── testemunhos/
    │   └── testemunho-fe.jpg
    └── musica-louvor/
        └── louvor-ao-vivo.jpg
```

## Onde colocar cada foto

| Pasta | Arquivo | Uso |
|-------|---------|-----|
| `hero/` | `cover.jpg` | Imagem grande do banner no topo |
| `login/` | `background.jpg` | Fundo da tela de entrada |
| `categorias/em-alta/` | Nomes dos arquivos conforme o `App.tsx` (ex.: `a-criacao.jpg`, `adao-e-eva.jpg`) | Capas dos vídeos da categoria "Em Alta" |
| `categorias/series-epicas/` | Idem | Capas da categoria "Séries Épicas" |
| `categorias/documentarios/` | Idem | Capas da categoria "Documentários" |
| `categorias/filmes/` | Idem | Capas da categoria "Filmes" |
| `categorias/testemunhos/` | Idem | Capas da categoria "Testemunhos" |
| `categorias/musica-louvor/` | Idem | Capas da categoria "Música e Louvor" |

Os nomes dos arquivos de cada vídeo estão definidos no `App.tsx` na constante `CATEGORIAS` (campo `thumbnail` de cada vídeo). Se adicionar um novo vídeo, use um nome em minúsculas, com hífens (ex.: `meu-video.jpg`), e registre o fallback em `IMAGENS.categorias` se quiser uma imagem de reserva enquanto o arquivo local não existir.
