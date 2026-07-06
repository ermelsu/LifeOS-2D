# LifeOS 2

Um jogo 2D pra "organizar a sua vida, um cômodo de cada vez" — feito com **Canvas 2D puro**
(HTML + JavaScript, sem instalação e sem dependências). Roda direto no navegador.

👉 No **GitHub Pages**, a URL do projeto abre direto na tela inicial **LifeOS 2**.

## O fluxo do jogo

1. **Tela inicial** — LifeOS 2, com um cenário de exemplo. Clique em **▶ JOGAR**.
2. **Escolha o personagem** — Adam, Alex, Amelia ou **Bob** (o principal).
3. **Passo 1 — Desenhe o chão** — pinte o piso de todos os cômodos (pincel, balde, borracha)
   e clique em **Finalizar chão**.
4. **Passo 2 — Paredes e portas** — contorne os cômodos com paredes e use a **Porta** pra
   deixar passagens.
5. **▶ JOGAR** — ande pela casa que você criou com **WASD/setas**, com colisão nas paredes.

## Texturas

Pacote **Modern Interiors** (LimeZu), tiles de 16px, em `assets/modern/`:
- `Room_Builder_free_16x16.png` — pisos e paredes.
- `Adam/Alex/Amelia/Bob` (`_run` e `_idle`) — personagens 16×16 com caminhada nas 4 direções.

## Arquivos

| Arquivo | O que é |
|---------|---------|
| `index.html`   | **LifeOS 2** — o jogo (fluxo título → personagem → chão → paredes → jogar) |
| `topdown.html` | Demo top-down antiga (pacote TopDownHouse) |
| `click.html`   | Protótipo inicial de cliques |

## Rodando localmente

As páginas carregam imagens de `assets/`, então sirva por HTTP (o `file://` pode bloquear as texturas):

```bash
python3 -m http.server 8000   # depois abra http://localhost:8000
```

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha a branch a servir (raiz `/`). Já existe um `.nojekyll`.
URL no formato `https://<usuario>.github.io/<repositorio>/`.

## Próximos módulos

Móveis (na proporção certa dos personagens), objetos interativos e mecânicas de vida
(status, dinheiro, tempo).
