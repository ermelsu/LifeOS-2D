# LifeOS 2D

Um joguinho 2D pra "controlar os aspectos da sua vida" — no estilo *Life is a Game* / The Sims,
feito com **Canvas 2D puro** (HTML + JavaScript, sem instalação e sem dependências).

👉 Roda direto no navegador. Se estiver publicado no **GitHub Pages**, é só abrir a URL do projeto.

## Páginas

| Arquivo | O que é |
|---------|---------|
| `index.html`   | Página inicial (hub) com links pra tudo |
| `editor.html`  | **Editor de Casa** — desenhe piso → paredes → móveis e clique em *Jogar* |
| `topdown.html` | Demo top-down (visão de cima) de um apartamento pronto, com texturas |
| `click.html`   | Protótipo inicial de cliques (cenas de lado, portas com nome) |

## Editor de Casa (o principal)

O fluxo segue a ordem natural de construção:

1. **🟫 Piso** — escolha uma textura e clique/arraste pra desenhar os cômodos.
2. **🧱 Parede** — levante as paredes ao redor (deixe vãos pras portas).
3. **🛋️ Móvel** — escolha um móvel na paleta e clique pra posicionar (colisão automática).
4. **▶ Jogar** — entra no modo jogo: ande com **WASD/setas**, aperte **E** perto de um móvel pra usar.

Outras ações: **💾 Salvar** (guarda no navegador), **⬇ Exportar** (baixa um `.json`), **🧽 Apagar**, **🗑️ Limpar**.

## Status de vida

`Energia · Fome · Higiene · Diversão` caem com o tempo. Usar os móveis certos recupera:

| Móvel | Efeito |
|-------|--------|
| Cama | +Energia |
| Geladeira / Fogão | +Fome |
| Sofá / Estante | +Diversão |
| Banheira | +Higiene |

## Texturas

Os pisos e móveis usam o pacote **TopDownHouse** (tiles de 16px), na pasta `assets/`.
A cama é desenhada por código porque o pacote não inclui uma.

## Rodando localmente

Como as páginas carregam imagens da pasta `assets/`, sirva a pasta por HTTP
(abrir o arquivo direto pelo `file://` pode bloquear as texturas em alguns navegadores):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha a branch a servir (raiz `/`).
Um `.nojekyll` já está incluído pra o Pages servir todos os arquivos como estão.
A URL fica no formato `https://<usuario>.github.io/<repositorio>/`.
