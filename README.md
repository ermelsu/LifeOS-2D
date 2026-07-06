# LifeOS 2D

Um joguinho 2D pra "controlar os aspectos da sua vida" — no estilo *Life is a Game* / The Sims,
feito com **Canvas 2D puro** (HTML + JavaScript, sem instalação e sem dependências).

👉 Roda direto no navegador. Se estiver publicado no **GitHub Pages**, é só abrir a URL do projeto.

## Páginas

| Arquivo | O que é |
|---------|---------|
| `index.html`   | Página inicial (hub) com links pra tudo |
| `editor.html`  | **Módulo Chão & Paredes** — desenhe piso e paredes (texturas Modern Interiors), escolha o personagem e clique em *Jogar* |
| `topdown.html` | Demo top-down antiga (pacote TopDownHouse) |
| `click.html`   | Protótipo inicial de cliques (cenas de lado, portas com nome) |

## Módulo atual: Chão & Paredes

O jogo está sendo construído por módulos. O primeiro é o **desenho da casa**:

- **🟫 Piso** — 8 texturas do pacote *Modern Interiors* (madeiras, tijolo, cerâmica, azulejo, espinha, cinza).
- **🧱 Parede** — parede branca uniforme que fica correta na horizontal **e** na vertical, com relevo por sombra.
- **🪣 Encher** — balde de tinta pra preencher uma área conectada.
- **🧽 Apagar** e **▦ Grade**.
- **Personagem** — Adam, Alex, Amelia ou Bob (sprites 16×16 do pacote), com caminhada nas 4 direções.
- **▶ Jogar** — anda com **WASD/setas** e colide com as paredes.

Próximo módulo: **móveis** (na proporção certa dos personagens, usando o `Interiors_free`).

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

- `assets/modern/` — pacote **Modern Interiors** (LimeZu), tiles de 16px: `Room_Builder_free_16x16.png`
  (chão + paredes) e os personagens `Adam/Alex/Amelia/Bob` (`_run` e `_idle`).
- `assets/` — pacote antigo **TopDownHouse**, usado só pela demo `topdown.html`.

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
